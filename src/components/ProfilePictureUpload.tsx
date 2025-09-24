'use client';
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useWalletAuth } from '@/hooks/useWalletAuth';

interface ProfilePictureUploadProps {
  onUploadSuccess?: (profilePicture: { publicId: string; secureUrl: string; uploadedAt: string }) => void;
  onError?: (error: string) => void;
}

interface UploadStatus {
  isOpen: boolean;
  status: 'uploading' | 'success' | 'error';
  message: string;
  progress?: number;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({ 
  onUploadSuccess, 
  onError 
}) => {
  const { user, token, refreshUserData } = useWalletAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    isOpen: false,
    status: 'uploading',
    message: '',
    progress: 0,
  });

  const handleFileSelect = (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      onError?.('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeInBytes) {
      onError?.('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const uploadToCloudinary = async () => {
    if (!selectedFile || !user?.wallet) {
      onError?.('Please select a file and ensure you are authenticated');
      return;
    }

    setIsUploading(true);
    setUploadStatus({
      isOpen: true,
      status: 'uploading',
      message: 'Uploading profile picture...',
      progress: 0,
    });

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

      if (!cloudName) {
        throw new Error('Cloudinary configuration is missing');
      }

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('upload_preset', uploadPreset);
      formData.append('folder', `profile-pictures/${user.wallet}`);
      formData.append('public_id', `${user.wallet}_profile_${Date.now()}`);
      formData.append('tags', 'profile-picture,user-upload');
      // Note: Transformation parameters are not allowed with unsigned uploads
      // The transformation will be handled on the frontend or via Cloudinary's auto-upload settings

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Cloudinary upload error:', errorData);
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();

      // Save to database via API
      const saveResponse = await fetch('/api/user/profile-picture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          publicId: result.public_id,
          secureUrl: result.secure_url,
        }),
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save profile picture to database');
      }

      const saveData = await saveResponse.json();

      setUploadStatus({
        isOpen: true,
        status: 'success',
        message: 'Profile picture uploaded successfully!',
      });

      // Call success callback
      onUploadSuccess?.(saveData.profilePicture);

      // Clear selected file and preview
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Auto-close success dialog after 3 seconds
      setTimeout(() => {
        setUploadStatus(prev => ({ ...prev, isOpen: false }));
        window.location.reload();
      }, 3000);

    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      
      setUploadStatus({
        isOpen: true,
        status: 'error',
        message: errorMessage,
      });
      
      onError?.(errorMessage);

      // Auto-close error dialog after 5 seconds
      setTimeout(() => {
        setUploadStatus(prev => ({ ...prev, isOpen: false }));
      }, 5000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeProfilePicture = async () => {
    if (!token) {
      onError?.('Authentication required');
      return;
    }

    try {
      const response = await fetch('/api/user/profile-picture', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove profile picture');
      }

      // Refresh user data
      await refreshUserData();

      setUploadStatus({
        isOpen: true,
        status: 'success',
        message: 'Profile picture removed successfully!',
      });

      setTimeout(() => {
        setUploadStatus(prev => ({ ...prev, isOpen: false }));
      }, 3000);

    } catch (error) {
      console.error('Remove profile picture error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove profile picture';
      onError?.(errorMessage);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Current Profile Picture */}
      <div className="mb-6 text-center">
        <h3 className="text-lg font-bold text-white font-pixel mb-4">Current Profile Picture</h3>
        <div className="relative inline-block">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-yellow-400 shadow-lg">
            {user?.profilePicture?.secureUrl ? (
              <Image
                key={`profile-${user.profilePicture.secureUrl}`}
                src={user.profilePicture.secureUrl}
                alt="Profile Picture"
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                <span className="text-white text-4xl">👤</span>
              </div>
            )}
          </div>
          {user?.profilePicture?.secureUrl && (
            <button
              onClick={removeProfilePicture}
              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold transition-colors"
              title="Remove profile picture"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white font-pixel mb-4">
          {user?.profilePicture ? 'Update Profile Picture' : 'Upload Profile Picture'}
        </h3>

        {/* File Drop Zone */}
        <div
          className="border-2 border-dashed border-gray-600 hover:border-yellow-400 rounded-lg p-8 text-center transition-colors cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          {previewUrl ? (
            <div className="space-y-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-yellow-400 mx-auto">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-gray-300 font-pixel">
                {selectedFile?.name}
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                  className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded text-sm font-pixel"
                >
                  Remove
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-pixel"
                >
                  Change
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full mx-auto overflow-hidden border-2 border-gray-600">
                <Image
                  src="/default-avatar.png"
                  alt="Default Avatar"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover opacity-50"
                />
              </div>
              <div>
                <p className="text-gray-300 font-pixel mb-2">
                  Drop an image here or click to select
                </p>
                <p className="text-sm text-gray-500 font-pixel">
                  JPEG, PNG, or WebP • Max 5MB
                </p>
              </div>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileInput}
          className="hidden"
        />

        {/* Upload Button */}
        {selectedFile && (
          <button
            onClick={uploadToCloudinary}
            disabled={isUploading}
            className="w-full mt-4 bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold py-3 px-6 rounded-lg font-pixel transition-colors"
          >
            {isUploading ? 'Uploading...' : 'Upload Profile Picture'}
          </button>
        )}
      </div>

      {/* Upload Status Modal */}
      {uploadStatus.isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full border border-gray-700">
            <div className="text-center">
              {uploadStatus.status === 'uploading' && (
                <div className="space-y-4">
                  <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-white font-pixel">{uploadStatus.message}</p>
                </div>
              )}
              
              {uploadStatus.status === 'success' && (
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-green-400 font-pixel">{uploadStatus.message}</p>
                </div>
              )}
              
              {uploadStatus.status === 'error' && (
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-red-400 font-pixel">{uploadStatus.message}</p>
                  <button
                    onClick={() => setUploadStatus(prev => ({ ...prev, isOpen: false }))}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded font-pixel"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePictureUpload;
