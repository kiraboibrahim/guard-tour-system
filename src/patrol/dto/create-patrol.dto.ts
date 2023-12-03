import { IsISO8601, IsMilitaryTime, IsString } from 'class-validator';
import { LoadEntityIfExists } from '../../core/core.validators';
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
  @LoadEntityIfExists<SecurityGuard>(
    SecurityGuard,
    'securityGuard',
    'uniqueId',
    {
      user: true,
      shift: true,
      deployedSite: true,
    },
  )
  @IsString()
  securityGuardUniqueId: string;
}
