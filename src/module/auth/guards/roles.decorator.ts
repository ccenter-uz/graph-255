import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from '../../../types';

export const ROLES_KEY = 'roles';
export const RequiredRoles = (...roles: RolesEnum[]) =>
  SetMetadata(ROLES_KEY, roles);
