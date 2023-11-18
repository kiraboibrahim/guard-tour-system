import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateTagDto } from './create-tag.dto';

export class UpdateTagDto extends PartialType(
  OmitType(CreateTagDto, ['companyId'] as const),
) {}
