import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'process';
import { config } from 'dotenv';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => {
        config();
        return {
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: process.env.JWT_EXPIRES,
          },
        };
      },
    }),
  ],
  exports: [JwtModule],
})
export class JwtGlobal {}
