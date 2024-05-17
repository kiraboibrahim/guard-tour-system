import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
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
import { SuperAdmin } from './user/entities/super-admin.entity';
import { CompanyAdmin } from './user/entities/company-admin.entity';
import { SiteAdmin } from './user/entities/site-admin.entity';
import { SecurityGuard } from './user/entities/security-guard.entity';
import { PatrolDelayNotification } from './site/entities/patrol-delay-notification.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { StatsController } from './stats/stats.controller';
import { StatsService } from './stats/stats.service';
import { StatsModule } from './stats/stats.module';

const entities = [
  Company,
  Tag,
  Patrol,
  Site,
  User,
  AuthUser,
  SuperAdmin,
  CompanyAdmin,
  SiteAdmin,
  SecurityGuard,
  PatrolDelayNotification,
];
@Module({
  imports: [
    UserModule,
    RouterModule.register([{ path: 'users', module: UserModule }]),
    SiteModule,
    TagModule,
    CompanyModule,
    PatrolModule,
    CoreModule,
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'sqlite',
          host: configService.get<string>('DB_HOST'),
          port: +configService.get('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          entities: [...entities],
          synchronize: configService.get<boolean>('DB_SYNC'),
          cache: true,
        };
      },
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    StatsModule,
  ],
  controllers: [AppController, StatsController],
  providers: [
    AppService,
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
    StatsService,
  ],
})
export class AppModule {}
