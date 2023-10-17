import { IsInt, IsISO8601, IsMilitaryTime, Validate } from 'class-validator';
import { IsExistsAndLoadEntity } from '../../core/core.validators';
import { SecurityGuard } from '../../user/entities/security-guard.entity';
import { Site } from '../../site/entities/site.entity';
import { Shift } from '../../shift/entities/shift.entity';

export class CreatePatrolDto {
  @IsISO8601()
  date: string;

  @IsMilitaryTime()
  startTime: string;

  @IsMilitaryTime()
  endTime: string;

  @IsInt()
  @Validate(IsExistsAndLoadEntity, [Site, 'site'])
  siteId: number;

  @IsInt()
  @Validate(IsExistsAndLoadEntity, [Shift, 'shift'])
  shiftId: number;

  @IsInt()
  @Validate(IsExistsAndLoadEntity, [SecurityGuard, 'securityGuard', 'userId'])
  securityGuardId: number;
}
