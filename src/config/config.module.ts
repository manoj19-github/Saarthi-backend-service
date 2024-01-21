import { Module } from '@nestjs/common';
import { Config } from './config.service';

@Module({
  providers: [Config],
  exports: [],
})
export class ConfigModule {}
