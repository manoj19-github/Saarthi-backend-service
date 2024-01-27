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
import { UtilityModule } from './utility/utility.module';
import { CandidateModule } from './candidate/candidate.module';
import { ImagesModule } from './images/images.module';
import { EducationModule } from './education/education.module';
import { LanguagesModule } from './languages/languages.module';
import { CompanyModule } from './company/company.module';
import { LocationModule } from './location/location.module';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.graphql'),
      definitions: {
        path: join(process.cwd(), 'src/schema.ts'),
        outputAs: 'class',
      },
    }),

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('DATABASE_URL'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    UtilityModule,
    CandidateModule,
    ImagesModule,
    EducationModule,
    LanguagesModule,
    CompanyModule,
    LocationModule,
    JobsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
