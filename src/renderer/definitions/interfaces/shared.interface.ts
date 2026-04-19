import { EUserRole } from '@/renderer/definitions/enums/shared.enum';

export interface IUserInfo {
  createdAt: string;
  displayName: string;
  email: string;
  id: number;
  role: EUserRole;
  updatedAt: string;
  username: string;
}
