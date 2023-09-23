import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { SiteModule } from './site/site.module';
import { DeviceModule } from './device/device.module';
import { CompanyModule } from './company/company.module';
import { PatrolModule } from './patrol/patrol.module';
import { CoreModule } from './core/core.module';
import { getTypeOrmModule } from './core/module-loading.utils';

@Module({
  imports: [
    UserModule,
    RouterModule.register([{ path: 'users', module: UserModule }]),
    SiteModule,
    DeviceModule,
    CompanyModule,
    PatrolModule,
    CoreModule,
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    getTypeOrmModule(),
  ],
  controllers: [AppController],
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
  ],
})
export class AppModule {}
