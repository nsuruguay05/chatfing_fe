export interface Question {
  id: number;
  question: string;
  answers: Answer[];
  created_at: Date;
  updated_at: Date;
}

export interface Answer {
  id: number;
  answer: string;
  derivation: any;
  references: Reference[];
  method: string;
  generative_model: string;
  temperature: number;
}

export interface Reference {
  id: number;
  document: Document;
  chunk: string;
  position: number;
  created_at: Date;
  updated_at: Date;
}

export interface Document {
  id: number;
  title: string;
  url: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Evaluation {
  like: boolean | null;
  comment: string;
  evaluation_author: string;
}

export interface Config {
  method: string;
  generative_model: string;
  temperature: number;
}