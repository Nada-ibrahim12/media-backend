export interface Media {
  id: string;
  title: string;
  url: string;
  type: "image" | "video";
  likes: number;
}
export const mediaItems: Media[] = [];