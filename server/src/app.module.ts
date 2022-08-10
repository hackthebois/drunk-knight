import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { CardModule } from './card/card.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { UserInterceptor } from './user/interceptor/user.interceptor';
import { AuthGuard } from './gaurds/auth.gaurd';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [UserModule, PrismaModule, CardModule, AdminModule],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_INTERCEPTOR,
    useClass: UserInterceptor
  },
  {
    provide: APP_GUARD,
    useClass: AuthGuard
  }]
})
export class AppModule {}
