export type ChatRole = 'user' | 'assistant' | 'system';

export interface AppMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt?: string;
}

export interface AppSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    messages: number;
  };
}
