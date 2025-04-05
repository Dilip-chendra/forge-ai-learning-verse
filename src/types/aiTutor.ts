
export type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
  attachments?: Array<{
    type: 'image' | 'document' | 'audio' | 'video';
    url: string;
    name: string;
    thumbnail?: string;
  }>;
};

export type LearningResource = {
  id: string;
  title: string;
  type: 'document' | 'image' | 'audio' | 'video' | 'topic';
  url?: string;
  content?: string;
  date: Date | string;
};

export type FileUpload = {
  file: File;
  progress: number;
  preview?: string;
  status: 'uploading' | 'complete' | 'error';
  error?: string;
};
