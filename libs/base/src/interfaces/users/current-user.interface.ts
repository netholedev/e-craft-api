import { IPermission } from '../permissions';

export interface ICurrentUser {
  id: string;
  email: string;
  permissions: IPermission[];
  subCompanies: string[];
}

export const CURRENT_USER_CONSTANT = 'CURRENT_USER_CONSTANT';
