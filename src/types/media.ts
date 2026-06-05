/**
 * Media Upload Types
 * 
 * Generic image upload system for all entities
 */

export type MediaContext = 
  | 'products' 
  | 'variants' 
  | 'brands' 
  | 'categories' 
  | 'hero' 
  | 'tags' 
  | 'stores';

export interface UploadResponse {
  status: boolean;
  data: {
    path: string;
    url: string;
    full_url: string;
  };
  message: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface MediaError {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}
