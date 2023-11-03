import { IsInt, IsMilitaryTime } from 'class-validator';
import { IsExistsAndLoadEntity } from '../../core/core.validators';
import { Site } from '../../site/entities/site.entity';
import { ApiProperty } from '@nestjs/swagger';

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
  @IsExistsAndLoadEntity(Site, 'site')
  siteId: number;

  @ApiProperty()
  @IsInt({ each: true })
  securityGuardIds: number[];
}
