import { Controller, Get } from '@nestjs/common';
import { Auth } from '@auth/auth.decorators';
import { Role } from '@roles/roles.constants';
import { StatsService } from './stats.service';
import { ApiTags } from '@nestjs/swagger';
import { CanRead } from '@permissions/permissions.decorators';

import { Resource } from '@core/core.constants';

@ApiTags('stats')
@Auth(Role.SUPER_ADMIN)
@Controller('stats')
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get('')
  @CanRead(Resource.STATS)
  async findStats() {
    return this.statsService.getStats();
  }
}
