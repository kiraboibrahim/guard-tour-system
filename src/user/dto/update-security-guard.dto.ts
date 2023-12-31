import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateSecurityGuardDto } from './create-security-guard.dto';

export class UpdateSecurityGuardDto extends PartialType(
  OmitType(CreateSecurityGuardDto, ['companyId'] as const),
) {}
