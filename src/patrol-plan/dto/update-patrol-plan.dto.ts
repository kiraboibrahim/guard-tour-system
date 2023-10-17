import { CreatePatrolPlanDto } from './create-patrol-plan.dto';
import { IsIn, IsString } from 'class-validator';
import { OmitType } from '@nestjs/mapped-types';

export class UpdatePatrolPlanDto extends OmitType(CreatePatrolPlanDto, [
  'shiftId',
  'securityGuardId',
  'siteId',
] as const) {
  @IsString()
  @IsIn(['ADD_DEVICES', 'REMOVE_DEVICES'])
  action: string;
}
