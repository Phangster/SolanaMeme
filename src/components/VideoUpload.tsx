'use client';
import React, { useState, useEffect } from 'react';
import { useWalletAuth } from '@/hooks/useWalletAuth';
import { VideoUploadProps, CloudinaryError, CloudinaryResult, UploadStatus, UploadedVideo } from '@/types/interfaces';

declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (config: Record<string, unknown>, callback: (error: CloudinaryError | null, result: CloudinaryResult | null) => void) => {
        open: () => void;
      };
    };
  }
}

const VideoUpload: React.FC<VideoUploadProps> = ({ onUploadSuccess }) => {
  const { user, token } = useWalletAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedVideos, setUploadedVideos] = useState<UploadedVideo[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    isOpen: false,
    status: 'uploading',
    message: '',
    progress: 0,
  });
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Load Cloudinary Upload Widget script
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.cloudinary) {
      const script = document.createElement('script');
      script.src = 'https://upload-widget.cloudinary.com/global/all.js';
      script.async = true;
      script.onload = () => {
        setScriptLoaded(true);
      };
      script.onerror = () => {
        console.error('Failed to load Cloudinary Upload Widget');
        setScriptLoaded(false);
      };
      document.body.appendChild(script);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    } else if (window.cloudinary) {
      setScriptLoaded(true);
    }
  }, []);

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    // Validate file type
    const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/mkv', 'video/webm', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      setUploadStatus({
        isOpen: true,
        status: 'error',
        message: 'Invalid file type. Please select a video file (MP4, MOV, AVI, MKV, WebM).',
      });
      return;
    }

    // Validate file size (100MB)
    if (file.size > 100000000) {
      setUploadStatus({
        isOpen: true,
        status: 'error',
        message: 'File too large. Maximum size is 100MB.',
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const uploadToCloudinary = async () => {
    if (!selectedFile || !formData.title.trim() || !formData.description.trim()) return;

    setIsUploading(true);
    setUploadStatus({
      isOpen: true,
      status: 'uploading',
      message: 'Starting upload...',
      progress: 0,
    });

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedFile);
      uploadFormData.append('upload_preset', uploadPreset);
      uploadFormData.append('folder', `user-uploads/${user?.wallet}`);
      uploadFormData.append('public_id', `${user?.wallet}_${Date.now()}`);
      uploadFormData.append('tags', 'user-upload,community-video');

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Cloudinary upload error:', errorData);
        throw new Error(`Upload failed: ${response.statusText} - ${errorData}`);
      }

      const result = await response.json();
      
      const uploadedVideo: UploadedVideo = {
        publicId: result.public_id,
        secureUrl: result.secure_url,
        title: formData.title.trim(),
        description: formData.description.trim(),
        uploadedAt: new Date().toISOString(),
      };

      setUploadStatus({
        isOpen: true,
        status: 'success',
        message: 'Video uploaded successfully!',
      });

      setUploadedVideos(prev => [uploadedVideo, ...prev]);
      onUploadSuccess?.(uploadedVideo);
      
      // Clear form and file
      setFormData({ title: '', description: '' });
      setSelectedFile(null);
      
      // Save to database
      await saveVideoMetadata(uploadedVideo);
      
      // Auto-close success dialog after 3 seconds
      setTimeout(() => {
        setUploadStatus(prev => ({ ...prev, isOpen: false }));
        window.location.reload();
      }, 3000);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({
        isOpen: true,
        status: 'error',
        message: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const openUploadWidget = () => {    
    if (!scriptLoaded || !window.cloudinary) {
      console.error('Cloudinary Upload Widget not loaded');
      setUploadStatus({
        isOpen: true,
        status: 'error',
        message: 'Upload widget not loaded. Please refresh the page and try again.',
      });
      return;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
        
    if (!cloudName) {
      console.error('Cloudinary cloud name not configured');
      setUploadStatus({
        isOpen: true,
        status: 'error',
        message: 'Cloudinary not configured. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in environment variables.',
      });
      return;
    }

    if (!uploadPreset) {
      console.error('Cloudinary upload preset not configured');
      setUploadStatus({
        isOpen: true,
        status: 'error',
        message: 'Upload preset not configured. Please set NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in environment variables.',
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus({
      isOpen: true,
      status: 'uploading',
      message: 'Opening upload widget...',
      progress: 0,
    });

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: cloudName,
        uploadPreset: uploadPreset,
        sources: ['local', 'url', 'camera'],
        resourceType: 'video',
        maxFileSize: 100000000, // 100MB
        maxVideoFileSize: 100000000,
        clientAllowedFormats: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
        cropping: false,
        multiple: false,
        folder: `user-uploads/${user?.wallet}`,
        publicIdPrefix: `${user?.wallet}_`,
        tags: ['user-upload', 'community-video'],
        context: {
          uploader: user?.wallet || 'unknown',
          title: formData.title || 'Untitled Video',
          description: formData.description || 'No description',
        },
      },
      (error: CloudinaryError | null, result: CloudinaryResult | null) => {
        if (error) {
          console.error('Upload error:', error);
          setUploadStatus({
            isOpen: true,
            status: 'error',
            message: `Upload failed: ${error.message || 'Unknown error'}`,
          });
          setIsUploading(false);
          return;
        }

        if (result && result.event === 'progress') {
          setUploadStatus(prev => ({
            ...prev,
            message: 'Uploading video...',
            progress: Math.round(result.info.bytes / result.info.total_bytes * 100),
          }));
        }

        if (result && result.event === 'success') {          
          const uploadedVideo: UploadedVideo = {
            publicId: result.info.public_id,
            secureUrl: result.info.secure_url,
            title: formData.title || 'Untitled Video',
            description: formData.description || 'No description',
            uploadedAt: new Date().toISOString(),
          };

          setUploadStatus({
            isOpen: true,
            status: 'success',
            message: 'Video uploaded successfully!',
          });

          setUploadedVideos(prev => [uploadedVideo, ...prev]);
          onUploadSuccess?.(uploadedVideo);
          
          // Clear form
          setFormData({ title: '', description: '' });
          
          // Save to database
          saveVideoMetadata(uploadedVideo);
          
          setIsUploading(false);
          
          // Reload page after successful upload
          setTimeout(() => {
            window.location.reload();
          }, 2000); // Wait 2 seconds to show success message
        }

        if (result && result.event === 'abort') {
          setUploadStatus({
            isOpen: true,
            status: 'error',
            message: 'Upload cancelled by user',
          });
          setIsUploading(false);
          
          setTimeout(() => {
            setUploadStatus(prev => ({ ...prev, isOpen: false }));
          }, 2000);
        }
      }
    );

    widget.open();
  };

  const saveVideoMetadata = async (video: UploadedVideo) => {
    if (!token) return;

    try {
      const response = await fetch('/api/user/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(video),
      });

      if (!response.ok) {
        console.error('Failed to save video metadata');
      }
    } catch (error) {
      console.error('Error saving video metadata:', error);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-yellow-400 mb-2 font-pixel">
           Upload Your Video
        </h3>
        <p className="text-gray-300 text-sm font-pixel">
          Share your $YAO content with the community
        </p>
      </div>

      {/* Upload Form */}
      <div className="space-y-4 mb-4">
        <div>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter video title..."
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 font-pixel"
            maxLength={100}
          />
        </div>

        <div>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe your video..."
            rows={3}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 font-pixel resize-none"
            maxLength={500}
            required
          />
        </div>
      </div>

      {/* Drag and Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
          dragActive
            ? 'border-yellow-400 bg-yellow-400/10'
            : selectedFile
            ? 'border-green-400 bg-green-400/10'
            : 'border-gray-600 bg-gray-800'
        }`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="video/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        
        {selectedFile ? (
          <div className="space-y-3">
            <div className="text-4xl">📹</div>
            <div>
              <h4 className="text-lg font-bold text-green-400 font-pixel">
                {selectedFile.name}
              </h4>
              <p className="text-sm text-gray-400 font-pixel">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-red-400 hover:text-red-300 text-sm font-pixel underline"
            >
              Remove file
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <h4 className="text-lg font-bold text-gray-300 font-pixel">
                {dragActive ? 'Drop your video here' : 'Drag & drop your video'}
              </h4>
              <p className="text-sm text-gray-400 font-pixel">
                or click to browse files
              </p>
            </div>
            <div className="text-xs text-gray-500 font-pixel">
              MP4, MOV, AVI, MKV, WebM • Max 100MB
            </div>
          </div>
        )}
      </div>

      {/* Upload Button - Only show when file is selected */}
      {selectedFile && (
        <button
          onClick={uploadToCloudinary}
          disabled={isUploading || !formData.title.trim() || !formData.description.trim()}
          className="w-full mt-4 bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 px-6 rounded-lg font-pixel text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
              Uploading...
            </>
          ) : (
            <>
              Upload Video
            </>
          )}
        </button>
      )}

      {/* Uploaded Videos List */}
      {uploadedVideos.length > 0 && (
        <div className="mt-6 border-t border-gray-700 pt-6">
          <h4 className="text-lg font-bold text-yellow-400 mb-4 font-pixel">
            Your Uploads
          </h4>
          <div className="space-y-3">
            {uploadedVideos.map((video, index) => (
              <div key={index} className="bg-gray-800 border border-gray-600 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h5 className="font-bold text-white text-sm font-pixel">
                      {video.title}
                    </h5>
                    <p className="text-xs text-gray-400 font-pixel mt-1">
                      {video.description}
                    </p>
                    <p className="text-xs text-gray-500 font-pixel mt-2">
                      Uploaded: {new Date(video.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => window.open(video.secureUrl, '_blank')}
                    className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-pixel transition-colors"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Status Dialog */}
      {uploadStatus.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 w-[calc(100vw-320px)]">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              {/* Status Icon */}
              <div className="mb-4">
                {uploadStatus.status === 'uploading' && (
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto"></div>
                )}
                {uploadStatus.status === 'success' && (
                  <div className="text-6xl text-green-500">✅</div>
                )}
                {uploadStatus.status === 'error' && (
                  <div className="text-6xl text-red-500">❌</div>
                )}
              </div>

              {/* Status Message */}
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-pixel">
                {uploadStatus.status === 'uploading' && 'Uploading Video'}
                {uploadStatus.status === 'success' && 'Upload Successful!'}
                {uploadStatus.status === 'error' && 'Upload Failed'}
              </h3>

              <p className="text-gray-600 mb-4 font-pixel">
                {uploadStatus.message}
              </p>

              {/* Progress Bar */}
              {uploadStatus.status === 'uploading' && uploadStatus.progress !== undefined && (
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${uploadStatus.progress}%` }}
                  ></div>
                  <p className="text-sm text-gray-600 mt-2 font-pixel">
                    {uploadStatus.progress}% complete
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              {uploadStatus.status !== 'uploading' && (
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setUploadStatus(prev => ({ ...prev, isOpen: false }))}
                    className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-pixel transition-colors"
                  >
                    Close
                  </button>
                  
                  {uploadStatus.status === 'success' && (
                    <button
                      onClick={() => {
                        setUploadStatus(prev => ({ ...prev, isOpen: false }));
                        // Optionally navigate to shorts page to see the video
                        window.location.href = '/shorts';
                      }}
                      className="px-6 py-2 bg-yellow-400 hover:bg-yellow-300 text-black rounded-lg font-pixel transition-colors"
                    >
                      View Shorts
                    </button>
                  )}
                  
                  {uploadStatus.status === 'error' && (
                    <button
                      onClick={() => {
                        setUploadStatus(prev => ({ ...prev, isOpen: false }));
                        openUploadWidget();
                      }}
                      className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-pixel transition-colors"
                    >
                      Try Again
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
