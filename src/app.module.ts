import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { SiteModule } from './site/site.module';
import { TagModule } from './tag/tag.module';
import { CompanyModule } from './company/company.module';
import { PatrolModule } from './patrol/patrol.module';
import { CoreModule } from './core/core.module';
import { Company } from './company/entities/company.entity';
import { Tag } from './tag/entities/tag.entity';
import { Patrol } from './patrol/entities/patrol.entity';
import { Site } from './site/entities/site.entity';
import { AuthUser, User } from './user/entities/user.base.entity';
import { SuperAdmin } from './super-admin/entities/super-admin.entity';
import { CompanyAdmin } from './company-admin/entities/company-admin.entity';
import { SiteAdmin } from './site-admin/entities/site-admin.entity';
import { SecurityGuard } from './security-guard/entities/security-guard.entity';
import { DelayedPatrolNotification } from './site/entities/delayed-patrol-notification.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { StatsController } from './stats/stats.controller';
import { StatsService } from './stats/stats.service';
import { StatsModule } from './stats/stats.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    UserModule,
    SiteModule,
    TagModule,
    CompanyModule,
    PatrolModule,
    CoreModule,
    StatsModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    DatabaseModule,
  ],
  controllers: [AppController, StatsController],
  providers: [
    AppService,
    StatsService,

    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
