import { Injectable } from '@nestjs/common';
import { CreatePatrolDto } from './dto/create-patrol.dto';
import { UpdatePatrolDto } from './dto/update-patrol.dto';

@Injectable()
export class PatrolService {
  create(createPatrolDto: CreatePatrolDto) {
    return 'This action adds a new patrol';
  }

  findAll() {
    return `This action returns all patrol`;
  }

  findOne(id: number) {
    return `This action returns a #${id} patrol`;
  }

  update(id: number, updatePatrolDto: UpdatePatrolDto) {
    return `This action updates a #${id} patrol`;
  }

  remove(id: number) {
    return `This action removes a #${id} patrol`;
  }
}
