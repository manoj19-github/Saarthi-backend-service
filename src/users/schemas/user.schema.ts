/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-this-alias */
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { GraphQLJSONObject } from 'graphql-type-json';
export enum UserTypeEnum {
  candidate = 'candidate',
  employer = 'employer',
}

const validateEmail = (email: string) => {
  // tslint:disable-next-line:max-line-length
  const expression =
    /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return expression.test(email);
};

@Schema({ timestamps: true })
export class UsersSchama {
  @Prop({ type: String, enum: UserTypeEnum, default: UserTypeEnum.candidate })
  userType: UserTypeEnum;
  @Prop({ type: Boolean, default: false })
  email_enabled: boolean;
  @Prop({ type: Boolean, default: true })
  enabled: boolean;
  @Prop({ unique: true, required: true })
  password: string;
  @Prop({
    required: true,
    unique: true,
    validate: { validator: validateEmail },
  })
  email: string;
  @Prop({ required: true, unique: true })
  username: string;
  @Prop({ unique: true })
  lowercaseUsername: string;
  @Prop({ type: { token: String, expiration: Date } })
  passwordReset?: { token: string; expiration: Date };
  /**
   *  checkes if user password provided matches the users password hashes
   * @param {string} password the password to attempt
   * @returns {Promise<boolean>} result of the match. will thrown an error if one exists from bcrypt
   * **/
  checkPassword!: (password: string) => Promise<boolean>;
}
@ObjectType()
export class PasswordResetDocument {
  @Field()
  token: string;
  @Field()
  expiration: Date;
}

@ObjectType()
export class UsersDocument extends Document {
  @Field()
  userType: string;
  @Field()
  enabled: boolean;
  @Field()
  email_enabled: boolean;
  @Field()
  password: string;
  @Field()
  lowercaseUsername: string;
  @Field()
  username: string;
  @Field(() => GraphQLJSONObject)
  passwordReset?: PasswordResetDocument;
}
const UsersModel = SchemaFactory.createForClass(UsersSchama);

UsersModel.methods.checkPassword = function (
  password: string,
): Promise<boolean> {
  const user = this;
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password, (error, isMatch) => {
      if (error) reject(error);
      resolve(isMatch);
    });
  });
};

UsersModel.statics.validateEmail = function (email: string): boolean {
  return validateEmail(email);
};

export default UsersModel;
