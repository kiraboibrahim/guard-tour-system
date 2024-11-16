import { ApiPropertyOptional } from '@nestjs/swagger';

export class UploadCompanyLogoDto {
  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  logo: any;
}
