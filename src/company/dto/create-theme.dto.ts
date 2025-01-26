import { IsHexColor } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateThemeDto {
  @ApiProperty()
  @IsHexColor()
  primaryColor: string;

  @ApiProperty()
  @IsHexColor()
  secondaryColor: string;

  @ApiProperty()
  @IsHexColor()
  accentColor: string;
}
