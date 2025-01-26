import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Company } from '@company/entities/company.entity';
import { Tag } from '@tag/entities/tag.entity';
import { Patrol } from '@patrol/entities/patrol.entity';
import { Site } from '@site/entities/site.entity';
import { User } from '@user/entities/user.base.entity';
import { SuperAdmin } from '@super-admin/entities/super-admin.entity';
import { CompanyAdmin } from '@company-admin/entities/company-admin.entity';
import { SiteAdmin } from '@site-admin/entities/site-admin.entity';
import { SecurityGuard } from '@security-guard/entities/security-guard.entity';
import { DelayedPatrolNotification } from '@site/entities/delayed-patrol-notification.entity';
import { SiteOwner } from '../site-owner/entities/site-owner.entity';
import { Shift } from '@shift/entities/shift.entity';
import { CallLog } from '../call-center/entities/call-log.entity';

import { AuthUser } from '@user/entities/auth-user.base.entity';
import { Theme } from '@company/entities/theme.entity';

const ENTITIES = [
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
  SiteOwner,
  DelayedPatrolNotification,
  Shift,
  CallLog,
  Theme,
];
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const NODE_ENV = configService.get<string>('NODE_ENV');
        const DB_SYNC = NODE_ENV !== 'production';
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: +configService.get('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          entities: [...ENTITIES],
          synchronize: DB_SYNC,
          cache: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
