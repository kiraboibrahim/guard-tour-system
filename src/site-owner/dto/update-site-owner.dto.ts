import { PartialType } from '@nestjs/swagger';
import { CreateSiteOwnerDto } from './create-site-owner.dto';

export class UpdateSiteOwnerDto extends PartialType(CreateSiteOwnerDto) {}
