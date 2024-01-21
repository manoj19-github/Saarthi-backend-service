import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';

import { join } from 'path';
import { ApolloDriver } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      playground: process.env.NODE_ENV === 'development',
      autoSchemaFile: join(process.cwd(), 'src/schema.graphql'),
      definitions: {
        path: join(process.cwd(), 'src/schema.ts'),
        outputAs: 'class',
      },
    }),

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('DATABASE_URL'),
        // useNewUrlParser: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
        // useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
