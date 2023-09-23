import { PartialType } from '@nestjs/mapped-types';
import { CreateSiteAdminDto } from './create-site-admin.dto';

export class UpdateSiteAdminDto extends PartialType(CreateSiteAdminDto) {}
