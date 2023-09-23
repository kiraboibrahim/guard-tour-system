import { PartialType } from '@nestjs/mapped-types';
import { CreatePatrolDto } from './create-patrol.dto';

export class UpdatePatrolDto extends PartialType(CreatePatrolDto) {}
