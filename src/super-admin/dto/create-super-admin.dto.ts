import { IsEmail } from 'class-validator';
import { CreateAuthUserDto } from '../../user/dto/create-user.base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsUnique } from '../../core/core.validators';
import { AuthUser } from '../../user/entities/user.base.entity';

export class CreateSuperAdminDto extends CreateAuthUserDto {
  @ApiProperty()
  @IsUnique<AuthUser>(AuthUser, 'username')
  @IsEmail()
  email: string;
}
