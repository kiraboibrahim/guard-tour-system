import { IsInt, IsMilitaryTime, Validate } from 'class-validator';
import { IsExistsAndLoadEntity } from '../../core/core.validators';
import { Site } from '../../site/entities/site.entity';

export class CreateShiftDto {
  @IsMilitaryTime()
  startTime: string;

  @IsMilitaryTime()
  endTime: string;

  @IsInt()
  patrolFrequency: number;

  @IsInt()
  @Validate(IsExistsAndLoadEntity, [Site, 'site'])
  siteId: number;

  @IsInt({ each: true })
  securityGuardIds: number[];
}
