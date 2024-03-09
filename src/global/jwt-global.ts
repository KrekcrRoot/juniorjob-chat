import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: 'a',
          signOptions: {
            expiresIn: '3d',
          },
        };
      },
    }),
  ],
  exports: [JwtModule],
})
export class JwtGlobal {}
