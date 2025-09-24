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

  const fetchUserData = async (token: string) => {
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
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to fetch user data',
      }));
    }
  };

  const authenticate = useCallback(async () => {
    if (!publicKey || !signMessage || !connected) {
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
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      }));
      isAuthenticating.current = false;
      authenticationManager.isAuthenticating = false;
      return false;
    }
  }, [publicKey, signMessage, connected, router]);

  // Auto-authenticate when wallet connects for the first time
  useEffect(() => {
    const savedToken = localStorage.getItem('wallet_token');
    const walletAddress = publicKey?.toString();

    if (connected && 
        !savedToken && 
        !authState.isAuthenticated && 
        !authState.isLoading && 
        !hasAttemptedAuth && 
        !isAuthenticating.current &&
        walletAddress &&
        signMessage && // Ensure signMessage is available
        (!authenticationManager.hasAttempted || authenticationManager.lastWalletAddress !== walletAddress) &&
        !authenticationManager.isAuthenticating) {
      setHasAttemptedAuth(true);
      authenticate();
    }
  }, [connected, authState.isAuthenticated, authState.isLoading, hasAttemptedAuth, publicKey, signMessage, authenticate]);

  // Handle wallet disconnection
  useEffect(() => {
    if (!connected) {
      // Reset authentication state when wallet disconnects
      setHasAttemptedAuth(false);
      isAuthenticating.current = false;
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
    authenticationManager.isAuthenticating = false;
    authenticationManager.hasAttempted = false;
    authenticationManager.lastWalletAddress = null;
  }, []);

  const refreshUserData = useCallback(async () => {
    if (authState.token) {
      await fetchUserData(authState.token);
    }
  }, [authState.token]);

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
