export enum VaultType {
  TEXT = 'text',
  FILE = 'file'
}

export interface VaultItem {
  id: string;
  type: VaultType;

  content: string | null;     // ✅ FIXED
  file_path: string | null;
  file_name: string | null;
  mime_type?: string | null;

  password?: string | null;
  expires_at: string;
  is_one_time: boolean;
  view_count: number;
  created_at: string;
}



export interface UploadSettings {
  expiryMinutes: number;
  password?: string;
  isOneTime: boolean;
}
