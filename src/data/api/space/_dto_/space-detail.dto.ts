export interface ISpaceDetailDto {
  id: number;
  name: string;
  description: string;
  /** Có thể rỗng nếu backend chưa gán ảnh */
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
