export enum UserRole {
  Admin = 'Admin',
  Management = 'Management',
  Auditor = 'Auditor'
}

export interface User {
  id?: number;
  email: string;
  fullName: string;
  role: UserRole;
  active: boolean;
  password?: string;
}