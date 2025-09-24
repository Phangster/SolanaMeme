'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { AuthState } from '@/types/interfaces';

// Singleton pattern - only allow one authentication manager
const authenticationManager: {
  isAuthenticating: boolean;
  hasAttempted: boolean;
  lastWalletAddress: string | null;
  authenticate: (() => Promise<boolean>) | null;
} = {
  isAuthenticating: false,
  hasAttempted: false,
  lastWalletAddress: null,
  authenticate: null,
};

// Track how many times the hook is instantiated
let hookInstanceCount = 0;

export const useWalletAuth = () => {
  const { publicKey, signMessage, connected } = useWallet();
  const router = useRouter();
  
  hookInstanceCount++;
  
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    user: null,
    isLoading: true, // Start with loading true to prevent premature redirects
    error: null,
  });
  
  const [hasAttemptedAuth, setHasAttemptedAuth] = useState(false);
  const isAuthenticating = useRef(false);
  const hasFetchedUserData = useRef(false);
  const userCancelled = useRef(false);
  const [forceUpdate, setForceUpdate] = useState(0);


  // Load token from localStorage on mount and auto-authenticate on wallet connection
  useEffect(() => {
    const savedToken = localStorage.getItem('wallet_token');
    
    if (savedToken && connected) {
      setAuthState(prev => ({
        ...prev,
        token: savedToken,
        isAuthenticated: true,
        isLoading: true,
      }));
      
      // Verify token is still valid by fetching user data
      fetchUserData(savedToken);
    } else {
      // No saved token or wallet not connected
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: false,
        token: null,
        user: null,
        isLoading: false,
      }));
      
      // Reset auth attempt flag when wallet disconnects
      if (!connected) {
        setHasAttemptedAuth(false);
        isAuthenticating.current = false;
        authenticationManager.isAuthenticating = false;
        authenticationManager.hasAttempted = false;
        authenticationManager.lastWalletAddress = null;
      }
    }
  }, [connected]);

  const fetchUserData = useCallback(async (token: string) => {
    // Prevent duplicate calls
    if (hasFetchedUserData.current) {
      console.log('🔍 Skipping fetchUserData - already fetched');
      return;
    }
    
    hasFetchedUserData.current = true;
    console.log('🔍 Fetching user data with token');
    
    try {
      const response = await fetch('/api/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAuthState(prev => ({
          ...prev,
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        }));
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('wallet_token');
        setAuthState(prev => ({
          ...prev,
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Session expired',
        }));
        hasFetchedUserData.current = false; // Reset on error
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to fetch user data',
      }));
      hasFetchedUserData.current = false; // Reset on error
    }
  }, []);

  const authenticate = useCallback(async () => {
    console.log('🔍 Authenticate called - Wallet state:', {
      hasPublicKey: !!publicKey,
      hasSignMessage: !!signMessage,
      connected,
      publicKey: publicKey?.toString()
    });

    if (!publicKey || !signMessage || !connected) {
      console.log('❌ Authentication conditions not met');
      setAuthState(prev => ({
        ...prev,
        error: 'Wallet not connected',
      }));
      return false;
    }

    const walletAddress = publicKey.toString();

    // Prevent multiple simultaneous authentication attempts
    if (authenticationManager.isAuthenticating || 
        (authenticationManager.hasAttempted && authenticationManager.lastWalletAddress === walletAddress)) {
      return false;
    }

    // Set global state
    authenticationManager.isAuthenticating = true;
    authenticationManager.hasAttempted = true;
    authenticationManager.lastWalletAddress = walletAddress;

    setAuthState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      // Step 1: Get authentication challenge
      const challengeResponse = await fetch('/api/auth/challenge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallet: walletAddress }),
      });

      if (!challengeResponse.ok) {
        throw new Error('Failed to get authentication challenge');
      }

      const challengeData = await challengeResponse.json();
      const { challenge } = challengeData;

      // Step 2: Sign the challenge message
      const messageBytes = new TextEncoder().encode(challenge);
      const signature = await signMessage(messageBytes);
      const signatureBase64 = Buffer.from(signature).toString('base64');

      // Step 3: Verify signature and get JWT
      const verifyResponse = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet: walletAddress,
          signature: signatureBase64,
          message: challenge,
        }),
      });

      if (!verifyResponse.ok) {
        const errorText = await verifyResponse.text();
        console.error('❌ Verification failed:', verifyResponse.status, errorText);
        throw new Error(`Authentication failed: ${verifyResponse.status} ${errorText}`);
      }

      const verifyData = await verifyResponse.json();
      const { token, user } = verifyData;

      // Store token in localStorage
      localStorage.setItem('wallet_token', token);


      // Update state in a single batch to prevent race conditions
      setAuthState({
        isAuthenticated: true,
        token,
        user,
        isLoading: false,
        error: null,
      });

      // Update flags after state update
      setHasAttemptedAuth(true);
      isAuthenticating.current = false;
      authenticationManager.isAuthenticating = false;

      
      // Also force update after a short delay to ensure all components catch up
      setTimeout(() => {
        setForceUpdate(prev => prev + 1);
      }, 50);

      setTimeout(() => {
        router.push('/dashboard');
      }, 100);
      
      return true;

    } catch (error) {
      console.error('Authentication error:', error);
      
      // Handle user rejection gracefully - just reset state without error message
      if (error instanceof Error && 
          (error.message.includes('User rejected') || error.message.includes('User rejected the request'))) {
        // User cancelled - just reset state silently
        console.log('🔍 User cancelled authentication - resetting state');
        userCancelled.current = true; // Set cancellation flag
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: null, // No error message for user cancellation
        }));
        
        // Reset flags after cancellation
        isAuthenticating.current = false;
        authenticationManager.isAuthenticating = false;
        authenticationManager.hasAttempted = false;
        setHasAttemptedAuth(false);
        
        // Reset cancellation flag after delay to allow manual retry
        setTimeout(() => {
          userCancelled.current = false;
        }, 2000);
      } else {
        // Other errors - show error message
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Authentication failed',
        }));
      }
      
      isAuthenticating.current = false;
      authenticationManager.isAuthenticating = false;
      authenticationManager.hasAttempted = false; // Reset so user can try again
      setHasAttemptedAuth(false); // Reset local state so user can try again
      return false;
    }
  }, [publicKey, signMessage, connected, router]);

  // Handle wallet connection - only call API when necessary
  useEffect(() => {
    console.log('🔍 Wallet connection effect triggered:', {
      connected,
      hasPublicKey: !!publicKey,
      isAuthenticated: authState.isAuthenticated,
      isLoading: authState.isLoading,
      userCancelled: userCancelled.current,
      walletAddress: publicKey?.toString()
    });

    if (connected && publicKey && !authState.isAuthenticated && !authState.isLoading && !userCancelled.current) {
      const savedToken = localStorage.getItem('wallet_token');
      console.log('🔍 Checking for saved token:', { hasToken: !!savedToken, walletAddress: publicKey.toString() });
      
      if (savedToken) {
        // Restore session with saved token
        console.log('🔍 Restoring session with saved token');
        setAuthState(prev => ({
          ...prev,
          token: savedToken,
          isAuthenticated: true,
          isLoading: true,
        }));
        fetchUserData(savedToken);
      } else if (signMessage) {
        // No saved token - auto-authenticate
        console.log('🔍 Auto-authenticating - no saved token');
        authenticate();
      }
    } else if (userCancelled.current) {
      console.log('🔍 Skipping auto-authentication - user cancelled');
    }
  }, [connected, publicKey, signMessage, authState.isAuthenticated, authState.isLoading, authenticate, fetchUserData]);

  // Debug authentication state changes
  useEffect(() => {
    console.log('🔍 Auth state changed:', {
      isAuthenticated: authState.isAuthenticated,
      isLoading: authState.isLoading,
      hasToken: !!authState.token,
      hasUser: !!authState.user,
      error: authState.error
    });
  }, [authState.isAuthenticated, authState.isLoading, authState.token, authState.user, authState.error]);

  // Handle wallet disconnection
  useEffect(() => {
    if (!connected) {
      // Reset authentication state when wallet disconnects
      setHasAttemptedAuth(false);
      isAuthenticating.current = false;
      hasFetchedUserData.current = false; // Reset fetch flag
      userCancelled.current = false; // Reset cancellation flag
      authenticationManager.isAuthenticating = false;
      authenticationManager.hasAttempted = false;
      authenticationManager.lastWalletAddress = null;
    }
  }, [connected]);

const logout = useCallback(() => {
    localStorage.removeItem('wallet_token');
    setAuthState({
      isAuthenticated: false,
      token: null,
      user: null,
      isLoading: false,
      error: null,
    });
    setHasAttemptedAuth(false);
    isAuthenticating.current = false;
    hasFetchedUserData.current = false; // Reset fetch flag
    authenticationManager.isAuthenticating = false;
    authenticationManager.hasAttempted = false;
    authenticationManager.lastWalletAddress = null;
  }, []);

  const refreshUserData = useCallback(async () => {
    if (authState.token) {
      hasFetchedUserData.current = false; // Reset flag to allow refresh
      await fetchUserData(authState.token);
    }
  }, [authState.token, fetchUserData]);

  return {
    ...authState,
    authenticate,
    logout,
    refreshUserData,
    forceUpdate, // Add forceUpdate to trigger re-renders
    // Debug info
    debugInfo: {
      hookInstanceCount,
      authenticationManager,
      hasAttemptedAuth,
      isAuthenticating: isAuthenticating.current,
    },
  };
};
