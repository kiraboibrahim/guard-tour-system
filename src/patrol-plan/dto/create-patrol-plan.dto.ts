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
  @IsExistsAndLoadEntity(Shift, 'shift')
  @IsInt()
  shiftId: number;

  @ApiPropertyOptional({
    description: 'Required if shiftId is omitted',
  })
  @ValidateIf((object) => object.shiftId === undefined)
  @IsExistsAndLoadEntity(SecurityGuard, 'securityGuard', 'userId')
  @IsInt()
  securityGuardId: number;

  @ApiProperty({ description: 'Devices that will be patrolled on the site' })
  @IsInt({ each: true })
  deviceIds: number[];
}
