import { Module } from '@nestjs/common';
import EducationModel from './schemas/education.schema';
import { MongooseModule } from '@nestjs/mongoose';
import CourseModel from './schemas/course.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Educations', schema: EducationModel }]),
    MongooseModule.forFeature([{ name: 'Courses', schema: CourseModel }]),
  ],
})
export class EducationModule {}
