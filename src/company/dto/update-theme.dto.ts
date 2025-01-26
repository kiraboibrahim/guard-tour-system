import { PartialType } from '@nestjs/swagger';
import CreateThemeDto from '@company/dto/create-theme.dto';

export default class UpdateThemeDto extends PartialType(CreateThemeDto) {}
