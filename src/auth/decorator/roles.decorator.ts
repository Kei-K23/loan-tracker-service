import { SetMetadata } from '@nestjs/common';
import { USER_ROLES } from '@prisma/client';

export const ROLE_KEY = 'USER_ROLES';

export const Roles = (...roles: USER_ROLES[]) => SetMetadata(ROLE_KEY, roles);
