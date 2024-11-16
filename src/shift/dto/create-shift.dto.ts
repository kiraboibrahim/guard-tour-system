import { SHIFT_TYPE } from '../shift.constants';
import { IsIn, IsInt } from 'class-validator';
import { LoadEntitiesIfExist, LoadEntityIfExists } from '@core/core.validators';
import { Site } from '@site/entities/site.entity';
import { ApiProperty } from '@nestjs/swagger';
import { SecurityGuard } from '@security-guard/entities/security-guard.entity';

export class CreateShiftDto {
  @ApiProperty()
  @IsIn([SHIFT_TYPE.DAY, SHIFT_TYPE.NIGHT])
  type: SHIFT_TYPE;

  @ApiProperty()
  @LoadEntityIfExists<Site>(Site, 'site')
  @IsInt()
  siteId: number;

  @ApiProperty()
  @LoadEntitiesIfExist(SecurityGuard, 'securityGuards', 'userId')
  @IsInt({ each: true })
  securityGuardIds: number[];
}
