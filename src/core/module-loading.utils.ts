import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../company/entities/company.entity';
import { Device } from '../device/entities/device.entity';
import { Patrol } from '../patrol/entities/patrol.entity';
import { Shift } from '../patrol/entities/shift.entity';
import { Site } from '../site/entities/site.entity';
import { SuperAdmin } from '../user/entities/super-admin.entity';
import { CompanyAdmin } from '../user/entities/company-admin.entity';
import { SiteAdmin } from '../user/entities/site-admin.entity';
import { SecurityGuard } from '../user/entities/security-guard.entity';

export async function getTypeOrmModule() {
  await ConfigModule.envVariablesLoaded;
  const isDebugEnv = process.env.DEBUG === 'true';
  if (isDebugEnv) {
    return TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite3',
      entities: [
        Company,
        Device,
        Patrol,
        Shift,
        Site,
        SuperAdmin,
        CompanyAdmin,
        SiteAdmin,
        SecurityGuard,
      ],
      synchronize: true,
    });
  }
  return TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT as string, 10) || 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
      Company,
      Device,
      Patrol,
      Shift,
      Site,
      SuperAdmin,
      CompanyAdmin,
      SiteAdmin,
      SecurityGuard,
    ],
    synchronize: false,
  });
}
