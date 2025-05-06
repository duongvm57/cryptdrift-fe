/**
 * API service for CryptDrift
 * Contains functions for API calls to the backend
 */

// API base URL
export const API_BASE_URL = '/api';

// Helper function to create full API URL
export function getApiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}

/**
 * Interface for file upload request
 */
interface UploadFileRequest {
  file: File;
  encryptedFile: Blob;
  expiration_hours?: number;
  download_limit?: number;
  decryption_key?: string;
  use_multipart?: boolean;
}

/**
 * Interface for file upload response
 */
interface UploadFileResponse {
  url: string;
  message: string;
  expires_at: string;
  download_limit: number;
}

/**
 * Interface for file information
 */
export interface FileInfo {
  id: string;
  expiration_time: string;
  download_limit: number;
  download_count: number;
  created_at: string;
  filename?: string; // Thêm trường filename vì nó được sử dụng trong FileContext.tsx
}

// Thêm interfaces mới theo API docs
interface InitMultipartResponse {
  upload_id: string;
  key: string;
  urls: {
    part_number: number;
    url: string;
  }[];
}

interface CompleteMultipartRequest {
  key: string;
  upload_id: string;
  parts: {
    part_number: number;
    etag: string;
  }[];
}

// Hàm khởi tạo multipart upload
async function initMultipartUpload(fileName: string, fileSize: number): Promise<InitMultipartResponse> {
  const response = await fetch(getApiUrl('/upload/multipart/init'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filename: fileName,
      file_size: fileSize
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to initialize multipart upload');
  }

  return response.json();
}

// Hàm upload một part
async function uploadPart(url: string, part: Blob): Promise<string> {
  const response = await fetch(url, {
    method: 'PUT',
    body: part,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload part: ${response.status}`);
  }

  // Get ETag from response headers
  const etag = response.headers.get('ETag');
  if (!etag) {
    throw new Error('No ETag received from upload');
  }
  
  // Remove quotes from ETag if present
  return etag.replace(/"/g, '');
}

// Hàm complete multipart upload
async function completeMultipartUpload(params: CompleteMultipartRequest): Promise<UploadFileResponse> {
  const response = await fetch(getApiUrl('/upload/multipart/complete'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to complete multipart upload');
  }

  return response.json();
}

/**
 * Upload file to server
 * @param params Upload parameters
 * @returns Promise with API response
 */
export async function uploadFile(params: UploadFileRequest): Promise<UploadFileResponse> {
  // Nếu file nhỏ hơn 10MB hoặc không yêu cầu multipart, dùng upload thường
  if (!params.use_multipart || params.encryptedFile.size < 10 * 1024 * 1024) {
    const formData = new FormData();
    formData.append('file', params.encryptedFile, params.file.name);
    if (params.expiration_hours) {
      formData.append('expiration_hours', params.expiration_hours.toString());
    }
    if (params.download_limit) {
      formData.append('download_limit', params.download_limit.toString());
    }
    if (params.decryption_key) {
      formData.append('decryption_key', params.decryption_key);
    }

    const response = await fetch(getApiUrl('/upload'), {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Upload failed');
    }

    return response.json();
  }

  // Multipart upload cho file lớn
  const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB chunks
  
  // 1. Khởi tạo multipart upload
  const initResponse = await initMultipartUpload(
    params.file.name,
    params.encryptedFile.size
  );

  // 2. Upload từng phần
  const uploadPromises = initResponse.urls.map(async ({ part_number, url }) => {
    const start = (part_number - 1) * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, params.encryptedFile.size);
    const chunk = params.encryptedFile.slice(start, end);
    const etag = await uploadPart(url, chunk);
    
    return {
      part_number,
      etag,
    };
  });

  const parts = await Promise.all(uploadPromises);

  // 3. Complete multipart upload
  return await completeMultipartUpload({
    key: initResponse.key,
    upload_id: initResponse.upload_id,
    parts,
  });
}

/**
 * Get file information
 * @param token Download token
 * @returns Promise with file information
 */
export async function getFileInfo(token: string): Promise<FileInfo> {
  const response = await fetch(getApiUrl(`/download/${token}/info`));

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to get file info');
  }

  return await response.json();
}

/**
 * Download file
 * @param token Download token
 * @returns Promise with Blob containing file content
 */
export async function downloadFile(token: string): Promise<Blob> {
  const response = await fetch(getApiUrl(`/download/${token}`));

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Download failed with status: ${response.status}`);
  }

  return await response.blob();
}
