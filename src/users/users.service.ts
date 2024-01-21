import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserTypeEnum, UsersDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateUserInput } from './args/UpdateUserInput.args';
import { MongoError } from 'mongodb';
import { CreateUserInput } from './args/CreateUserInput.args';
import { randomBytes } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { createTransport, SendMailOptions } from 'nodemailer';
@Injectable()
class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UsersDocument>,
    private configService: ConfigService,
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
  /**
   *  Send an email with a password reset code and sets the reset token and expiration on the user.
   * Email_Enabled must be true for this to run
   *
   * @param {string} email address associated with an account to reset
   * @returns {Promise<boolean>} if an email was sent or not
   * @memberof UsersService
   *
   **/
  async forgotPassword(email: string): Promise<boolean> {
    const user = await this.findOneByEmail(email);
    if (!user) return false;
    if (!user.enabled) return false;
    const token = randomBytes(64).toString('hex');
    // one day for expiration of reset token
    const expiration = new Date(Date().valueOf() + 24 * 60 * 60 * 1000);
    const transporter = createTransport({
      host: 'smtp.forwardemail.net',
      port: 465,
      secure: true,
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
    });
    const mailOptions: SendMailOptions = {
      from: this.configService.get('EMAIL_USER'),
      to: email,
      subject: `Reset Password`,
      text: `${user.username}, Replace your password with this : ${token}`,
    };
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, _) => {
        if (error) return resolve(false);
        user.passwordReset = { token, expiration };
        user.save().then(
          () => resolve(true),
          () => reject(false),
        );
      });
    });
  }

  /**
   * Creates a user
   *
   * @param {CreateUserInput} createUserInput username,email and password. Username and email must be unique, will throw an email with a description if either are
   * duplicates
   * @returns {Promise<UsersDocument>} or throws an error
   * @memberof UsersService
   *
   **/
  async createUser(createUserInput: CreateUserInput): Promise<UsersDocument> {
    let newUser: UsersDocument | undefined;
    try {
      newUser = await this.userModel.create(createUserInput);
    } catch (error) {
      throw this.evaluateMongoError(error, createUserInput);
    }
    return newUser;
  }
  /***
   *  Resets a password after the user forgot their passwordand requested a reset
   *
   * @param {string} username
   * @param {string} code the token set when the password reset email was sent out
   * @param {string} password the new password the user wants
   * @returns {(Promise<UserDocument| undefined>)} Returns undefined if the code or the username is wrong
   * @memberof UsersService
   *
   **/
  async resetPassword(
    username: string,
    code: string,
    password: string,
  ): Promise<UsersDocument | undefined> {
    const user = await this.findOneByUsername(username);
    if (!!user && user.passwordReset && user.enabled !== false) {
      if (user.passwordReset.token === code) {
        user.password = password;
        user.passwordReset = undefined;
        await user.save();
        return user;
      }
    }
    return undefined;
  }
}

export default UsersService;
