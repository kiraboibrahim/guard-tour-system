import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '@user/user.module';
import { SiteModule } from '@site/site.module';
import { TagModule } from '@tag/tag.module';
import { CompanyModule } from '@company/company.module';
import { PatrolModule } from '@patrol/patrol.module';
import { CoreModule } from '@core/core.module';
import { ScheduleModule } from '@nestjs/schedule';
import { StatsController } from '@stats/stats.controller';
import { StatsService } from '@stats/stats.service';
import { StatsModule } from '@stats/stats.module';
import { DatabaseModule } from '@database/database.module';
import { ShiftModule } from '@shift/shift.module';
import { CallCenterModule } from './call-center/call-center.module';
import { TasksModule } from '@tasks/tasks.module';

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
    ShiftModule,
    CallCenterModule,
    TasksModule,
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
