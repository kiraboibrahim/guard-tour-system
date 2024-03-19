import { IsISO8601, IsMilitaryTime, IsString } from 'class-validator';
import { LoadEntityIfExists } from '../../core/core.validators';
import { SecurityGuard } from '../../user/entities/security-guard.entity';
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
  @LoadEntityIfExists<SecurityGuard>(
    SecurityGuard,
    'securityGuard',
    'uniqueId',
    {
      user: true,
    },
    true,
  )
  @IsString()
  securityGuardUniqueId: string;

  @ApiProperty()
  @LoadEntityIfExists<Site>(Site, 'site', 'tagId')
  @IsString()
  siteTagId: string;
}
