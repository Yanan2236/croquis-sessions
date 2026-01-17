export type FileWithPreview = {
  file: File;
  previewUrl: string;
};

export type Drawing = {
  id: number;
  order:number;
  image_url: string;
  session: number;
  created_at: string;
  updated_at: string;
};