import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthUserDto } from './create-user.base.dto';

export class UpdateUserDto extends PartialType(CreateAuthUserDto) {}
