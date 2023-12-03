import { IsInt, IsMilitaryTime } from 'class-validator';
import {
  LoadEntitiesIfExist,
  LoadEntityIfExists,
} from '../../core/core.validators';
import { Site } from '../../site/entities/site.entity';
import { ApiProperty } from '@nestjs/swagger';
import { SecurityGuard } from '../../user/entities/security-guard.entity';

export class CreateShiftDto {
  @ApiProperty()
  @IsMilitaryTime()
  startTime: string;

  @ApiProperty()
  @IsMilitaryTime()
  endTime: string;

  @ApiProperty()
  @IsInt()
  patrolFrequency: number;

  @ApiProperty()
  @IsInt()
  @LoadEntityIfExists<Site>(Site, 'site')
  siteId: number;

  @ApiProperty()
  @LoadEntitiesIfExist<SecurityGuard>(SecurityGuard, 'securityGuards', 'userId')
  @IsInt({ each: true })
  securityGuardIds: number[];
}
