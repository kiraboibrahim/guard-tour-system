import { IsInt, ValidateIf } from 'class-validator';
import { IsExistsAndLoadEntity } from '../../core/core.validators';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SecurityGuard } from '../../user/entities/security-guard.entity';
import { Shift } from '../../shift/entities/shift.entity';

export class CreatePatrolPlanDto {
  @ApiPropertyOptional({
    description: 'Required if securityGuardId is omitted',
  })
  @ValidateIf((object) => object.securityGuardId === undefined)
  @IsExistsAndLoadEntity(Shift, 'shift', undefined, { site: { tags: true } })
  @IsInt()
  shiftId: number;

  @ApiPropertyOptional({
    description: 'Required if shiftId is omitted',
  })
  @ValidateIf((object) => object.shiftId === undefined)
  @IsExistsAndLoadEntity(SecurityGuard, 'securityGuard', 'userId', {
    deployedSite: { tags: true },
  })
  @IsInt()
  securityGuardId: number;

  @ApiProperty()
  @IsInt({ each: true })
  tagIds: number[];
}
