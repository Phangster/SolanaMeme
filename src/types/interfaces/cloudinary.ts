// Cloudinary related interfaces

export interface CloudinaryError {
  message?: string;
  status?: string;
}

export interface CloudinaryResult {
  event: string;
  info: {
    public_id: string;
    secure_url: string;
    bytes: number;
    total_bytes: number;
  };
}

export interface CloudinaryUploadWidget {
  open: () => void;
}

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
  sources: string[];
  multiple: boolean;
  maxFiles: number;
  resourceType: string;
  folder: string;
  tags: string[];
  context: Record<string, string>;
}
