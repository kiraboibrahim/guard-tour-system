import { IsISO8601, IsMilitaryTime, IsString } from 'class-validator';
import {
  LoadEntitiesIfExist,
  LoadEntityIfExists,
} from '../../core/core.validators';
import { SecurityGuard } from '../../security-guard/entities/security-guard.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Site } from '../../site/entities/site.entity';

export class CreatePatrolDto {
  @ApiProperty()
  @IsISO8601()
  date: string;

  @ApiProperty()
  @IsMilitaryTime()
  startTime: string;

  @ApiProperty()
  @LoadEntitiesIfExist<SecurityGuard>(
    SecurityGuard,
    'securityGuards',
    'uniqueId',
    {
      user: true,
    },
    true,
  )
  @IsString({ each: true })
  securityGuardsUniqueIds: string[];

  @ApiProperty()
  @LoadEntityIfExists<Site>(Site, 'site', 'tagId')
  @IsString()
  siteTagId: string;
}
