export interface Warehouse {
  id?: number;
  name: string;
  location: string;
  capacity: number;
  createdDate: Date;
  isActive: boolean;
  description?: string;
}