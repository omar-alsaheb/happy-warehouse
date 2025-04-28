export interface WarehouseItem {
  id?: number;
  warehouseId: number;
  name: string;
  quantity: number;
  category: string;
  price: number;
  expirationDate?: Date;
  addedDate: Date;
}