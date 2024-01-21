import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserTypeEnum, UsersDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateUserInput } from './args/UpdateUserInput.args';
import { MongoError } from 'mongodb';
import { CreateUserInput } from './args/CreateUserInput.args';
@Injectable()
class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UsersDocument>,
  ) {}

  isEmployer(user: UsersDocument): boolean {
    return user.userType === UserTypeEnum.employer;
  }
  /**
   * Returns a user by their unique username or undefined
   *
   *  @param {string} username of user, not case sensitive
   * @returns {(Promise<UserDocument |undefined)}
   * @memberof UsersService
   *
   **/
  async findOneByUsername(
    username: string,
  ): Promise<UsersDocument | undefined> {
    const user = await this.userModel
      .findOne({ lowercaseUsername: username.toLowerCase() })
      .exec();
    if (user) return user;
    return undefined;
  }
  /**
   * Returns a user by their unique email address or undefined
   * @param {string} email address or user , not case sensitive
   * @returns {(Promise<UsersDocument | undefined>)}
   * @memberof UsersService
   **/
  async findOneByEmail(email: string): Promise<UsersDocument | undefined> {
    const user = await this.userModel
      .findOne({ lowercaseEmail: email.toLowerCase() })
      .exec();
    if (user) return user;
    return undefined;
  }

  /**
   *  Updates a user in the database . If any value is invalid , it will still update the other
   *  fields of the user
   * @param {string} username
   * @param {UpdateUserInput} _fieldsToUpdate
   *
   * @returns {(Promise<UsersDocument | undefined>)}
   * @memberof UsersService
   * **/
  async update(
    username: string,
    fieldsToUpdate: UpdateUserInput,
  ): Promise<UsersDocument | undefined> {
    if (fieldsToUpdate.username) {
      const user = await this.userModel
        .findOne({ lowercaseEmail: username.toLowerCase() })
        .exec();
      if (user) return user;
      return undefined;
    }
  }
  /**
   *  Gets all the users that are registered
   *
   * @returns {Promise<UserDocument[]>}
   * @memberof UsersService
   *
   * **/
  async getAllUsers(): Promise<UsersDocument[]> {
    return await this.userModel.find().exec();
  }
  /**
   * Deletes all the users in the database, user for testing
   *
   * @returns {Promise<void>}
   * @memberof UsersService
   *
   **/
  async deleteAllUsers(): Promise<void> {
    await this.userModel.deleteMany({});
  }

  /**
   * Reads a mongo database error and attempts to provide a better error message. If
   * it is unable to produce a better error message, returns the original error message
   * @private
   * @param {MongoError} error
   * @param {CreateUserInput}
   * @memberof UsersService
   **/
  private evaluateMongoError(
    error: MongoError,
    createUserInput: CreateUserInput,
  ): Error {
    if (error.code === 11000) {
      if (
        error.message
          .toLowerCase()
          .includes(createUserInput.email.toLowerCase())
      ) {
        throw new Error(`email ${createUserInput.email} is already registered`);
      } else if (
        error.message
          .toLowerCase()
          .includes(createUserInput.username.toLowerCase())
      ) {
        throw new Error(
          ` username ${createUserInput.username} is already registered`,
        );
      }
    }
    throw new Error(error.message);
  }
}

export default UsersService;
