import { IsInt } from 'class-validator';
import { LoadEntitiesIfExist } from '../../core/core.validators';
import { SecurityGuard } from '../entities/security-guard.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UnDeploySecurityGuardsDto {
  @ApiProperty()
  @LoadEntitiesIfExist<SecurityGuard>(SecurityGuard, 'securityGuards', 'userId')
  @IsInt({ each: true })
  securityGuardIds: number[];
}
