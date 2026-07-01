/**
 * Generic Media Upload API Client
 * 
 * Unified image upload for all entities (products, brands, categories, etc.)
 */

import type { MediaContext, UploadResponse } from '@/types/media';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Upload an image to a specific context
 */
export async function uploadImage(
  storeSlug: string,
  context: MediaContext,
  file: File
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('context', context);
  formData.append('image', file);

  const response = await fetch(
    `${API_BASE}/api/v1/merchant/stores/${storeSlug}/media/upload`,
    {
      method: 'POST',
      body: formData,
      credentials: 'include', // Include cookies for auth
      headers: {
        // Note: Don't set Content-Type - browser will set it with boundary for FormData
        'Accept': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'Upload failed',
    }));
    
    // Extract the most specific error message
    // Priority: specific validation errors > generic message
    let errorMessage = 'Upload failed';
    
    // Check for Laravel validation errors first (more specific)
    if (error.errors && typeof error.errors === 'object') {
      // Laravel validation errors format: { errors: { field: ["message1", "message2"] } }
      const firstErrorArray = Object.values(error.errors)[0];
      if (Array.isArray(firstErrorArray) && firstErrorArray.length > 0) {
        errorMessage = firstErrorArray[0] as string;
      }
    } 
    // Fall back to generic message only if no specific errors
    else if (error.message && error.message !== 'Validation failed.') {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }

  return response.json();
}

/**
 * Delete an image from a specific context
 */
export async function deleteImage(
  storeSlug: string,
  context: MediaContext,
  path: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE}/api/v1/merchant/stores/${storeSlug}/media/delete`,
    {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ context, path }),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'Delete failed',
    }));
    
    // Extract the most specific error message
    // Priority: specific validation errors > generic message
    let errorMessage = 'Delete failed';
    
    // Check for Laravel validation errors first (more specific)
    if (error.errors && typeof error.errors === 'object') {
      // Laravel validation errors format: { errors: { field: ["message1", "message2"] } }
      const firstErrorArray = Object.values(error.errors)[0];
      if (Array.isArray(firstErrorArray) && firstErrorArray.length > 0) {
        errorMessage = firstErrorArray[0] as string;
      }
    } 
    // Fall back to generic message only if no specific errors
    else if (error.message && error.message !== 'Validation failed.') {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
}
