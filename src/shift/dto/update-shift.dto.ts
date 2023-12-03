import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateShiftDto } from './create-shift.dto';
import { IsIn, IsInt, ValidateIf } from 'class-validator';
import {
  ADD_SECURITY_GUARDS,
  REMOVE_SECURITY_GUARDS,
} from '../shift.constants';
import { ApiProperty } from '@nestjs/swagger';
import { LoadEntitiesIfExist } from '../../core/core.validators';
import { SecurityGuard } from '../../user/entities/security-guard.entity';

export class UpdateShiftDto extends OmitType(PartialType(CreateShiftDto), [
  'siteId',
] as const) {
  @ApiProperty()
  @ValidateIf((object) => object.securityGuardIds !== undefined)
  @IsIn([ADD_SECURITY_GUARDS, REMOVE_SECURITY_GUARDS])
  action: string;

  @ApiProperty()
  @ValidateIf((object) => object.action !== undefined)
  @LoadEntitiesIfExist<SecurityGuard>(SecurityGuard, 'securityGuards', 'userId')
  @IsInt({ each: true })
  securityGuardIds: number[];
}
