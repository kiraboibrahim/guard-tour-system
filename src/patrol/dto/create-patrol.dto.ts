import { IsInt, IsISO8601, IsMilitaryTime } from 'class-validator';
import { IsExistsAndLoadEntity } from '../../core/core.validators';
import { SecurityGuard } from '../../user/entities/security-guard.entity';
import { Site } from '../../site/entities/site.entity';
import { Shift } from '../../shift/entities/shift.entity';
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
  @IsExistsAndLoadEntity(Site, 'site')
  siteId: number;

  @ApiProperty()
  @IsInt()
  @IsExistsAndLoadEntity(Shift, 'shift')
  shiftId: number;

  @ApiProperty()
  @IsInt()
  @IsExistsAndLoadEntity(SecurityGuard, 'securityGuard', 'userId')
  securityGuardId: number;
}
