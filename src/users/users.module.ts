import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import UsersModel, { UsersSchama } from './schemas/user.schema';
import { ConfigModule } from '@nestjs/config';
import UsersService from './users.service';
import UserResolver from './users.resolver';
import { UtilityModule } from 'src/utility/utility.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UsersModel }]),
    ConfigModule,
    UtilityModule,
  ],
  exports: [UsersService],
  controllers: [],
  providers: [UserResolver, UsersService],
})
export class UsersModule {}
