import { IsInt, Validate, ValidateIf } from 'class-validator';
import { IsExistsAndLoadEntity } from '../../core/core.validators';
import { Site } from '../../site/entities/site.entity';

export class CreatePatrolPlanDto {
  @ValidateIf((object) => object.securityGuardId === undefined)
  @IsInt()
  shiftId: number;

  @ValidateIf((object) => object.shiftId === undefined)
  @IsInt()
  securityGuardId: number;

  @IsInt()
  @Validate(IsExistsAndLoadEntity, [Site, 'site'])
  siteId: number;

  @IsInt({ each: true })
  deviceIds: number[];
}
