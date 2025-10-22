import { create } from 'zustand';

interface UploadedImage {
  file: File;
  url: string;
  name: string;
  uploadTime: string;
}

interface UploadState {
  images: File[];
  previewURLs: string[];
  uploadedImages: UploadedImage[];
  setImages: (newImages: File[]) => void;
  setPreviewURLs: (newURLs: string[]) => void;
  addUploadedImages: (images: UploadedImage[]) => void;
  clearImages: () => void;
  clearUploadedImages: () => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  images: [],
  previewURLs: [],
  uploadedImages: [],
  setImages: (newImages) => set({ images: newImages }),
  setPreviewURLs: (newURLs) => set({ previewURLs: newURLs }),
  addUploadedImages: (newImages) =>
    set((state) => ({
      uploadedImages: [...state.uploadedImages, ...newImages],
    })),
  clearImages: () =>
    set((state) => {
      state.previewURLs.forEach((url) => URL.revokeObjectURL(url));
      return { images: [], previewURLs: [] };
    }),
  clearUploadedImages: () =>
    set((state) => {
      state.uploadedImages.forEach((img) => URL.revokeObjectURL(img.url));
      return { uploadedImages: [] };
    }),
}));