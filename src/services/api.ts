/**
 * API service for CryptDrift
 * Contains functions for API calls to the backend
 */

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
interface FileInfo {
  id: string;
  expiration_time: string;
  download_limit: number;
  download_count: number;
  created_at: string;
}

/**
 * Upload file to server
 * @param params Upload parameters
 * @returns Promise with API response
 */
export async function uploadFile(params: UploadFileRequest): Promise<UploadFileResponse> {
  const formData = new FormData();

  // Add encrypted file to form data
  formData.append('file', params.encryptedFile, params.file.name);

  // Add other parameters
  if (params.expiration_hours) {
    formData.append('expiration_hours', params.expiration_hours.toString());
  }

  if (params.download_limit) {
    formData.append('download_limit', params.download_limit.toString());
  }

  if (params.decryption_key) {
    formData.append('decryption_key', params.decryption_key);
  }

  if (params.use_multipart) {
    formData.append('use_multipart', params.use_multipart.toString());
  }

  // Call upload API
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Upload failed');
  }

  return await response.json();
}

/**
 * Get file information
 * @param token Download token
 * @returns Promise with file information
 */
export async function getFileInfo(token: string): Promise<FileInfo> {
  const response = await fetch(`/api/download/${token}/info`);

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
  const response = await fetch(`/api/download/${token}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Download failed with status: ${response.status}`);
  }

  return await response.blob();
}
