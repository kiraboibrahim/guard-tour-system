import { IsInt, IsISO8601, IsMilitaryTime } from 'class-validator';
import { IsExistsAndLoadEntity } from '../../core/core.validators';
import { SecurityGuard } from '../../user/entities/security-guard.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePatrolDto {
  @ApiProperty()
  @IsISO8601()
  date: string;

  @ApiProperty()
  @IsMilitaryTime()
  startTime: string;

  @ApiProperty()
  @IsMilitaryTime()
  endTime: string;

  @ApiProperty()
  @IsInt()
  @IsExistsAndLoadEntity(SecurityGuard, 'securityGuard', 'userId', {
    deployedSite: true,
    shift: true,
  })
  securityGuardId: number;
}
