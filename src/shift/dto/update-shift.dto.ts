import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateShiftDto } from './create-shift.dto';
import { IsIn, IsInt, ValidateIf } from 'class-validator';
import {
  ADD_SECURITY_GUARDS_ACTION,
  REMOVE_SECURITY_GUARDS_ACTION,
} from '../shift.constants';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateShiftDto extends OmitType(PartialType(CreateShiftDto), [
  'siteId',
] as const) {
  @ApiProperty()
  @ValidateIf((object) => object.securityGuardIds !== undefined)
  @IsIn([ADD_SECURITY_GUARDS_ACTION, REMOVE_SECURITY_GUARDS_ACTION])
  securityGuardAction: string;

  @ApiProperty()
  @ValidateIf((object) => object.securityGuardAction !== undefined)
  @IsInt({ each: true })
  securityGuardIds: number[];
}
