import { PartialType } from '@nestjs/swagger';
import { CreateShiftDto } from '@shift/dto/create-shift.dto';
import { OmitType } from '@nestjs/mapped-types';

export class UpdateShiftDto extends PartialType(
  OmitType(CreateShiftDto, ['siteId'] as const),
) {}
