import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserTypeEnum, UsersDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateUserInput } from './args/UpdateUserInput.args';
import { MongoError } from 'mongodb';
import { CreateUserInput } from './args/CreateUserInput.args';
import { randomBytes } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { SendMailOptions } from 'nodemailer';
import * as bcrypt from 'bcrypt';
import { UtilityService } from 'src/utility/utility.service';
import { HttpQueryError } from 'apollo-server-core';
@Injectable()
class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UsersDocument>,
    private configService: ConfigService,
    private utilityService: UtilityService,
  ) {}

  /**
   * Returns a user by their unique username or undefined
   *
   *  @param {string} username of user, not case sensitive
   * @returns {(Promise<UserDocument |undefined>)}
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
    const user = await this.userModel.findOne({ email }).exec();
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
        throw new HttpQueryError(
          400,
          `email ${createUserInput.email} is already registered`,
        );
      } else if (
        error.message
          .toLowerCase()
          .includes(createUserInput.username.toLowerCase())
      ) {
        throw new HttpQueryError(
          400,
          ` username ${createUserInput.username} is already registered`,
        );
      }
    }
    throw new HttpQueryError(400, error.message);
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
    const token = randomBytes(3).toString('hex');
    // one day for expiration of reset token
    const expiration = new Date(Date().valueOf() + 24 * 60 * 60 * 1000);

    const mailOptions: SendMailOptions = {
      from: this.configService.get('EMAIL_USERNAME'),
      to: email,
      subject: `Reset Password`,
      html: `
      
      
        <h1 style="text-align:center">Saarthi</h1><br/>
        <p style="text-align:center"><small>Your Future, Our Commitment</small></p>
      
      
        <p></p>
        <p style="text-align:center">${user.username}, Replace your password with this : ${token} <br/><small> please note this token is invalid after 24 hours of generate</small> </p>
      
      `,
    };
    return new Promise((resolve, reject) => {
      return this.utilityService.sendMailMethod(mailOptions).then((res) => {
        this.userModel
          .updateOne(
            { email },
            { $set: { passwordReset: { token, expiration } } },
          )
          .then(
            () => resolve(true),
            () => reject(false),
          );
      });
    });
  }
  /**
   *  Change user email  verification
   *  @param {string}
   * @returns {boolean}
   * @memberof UsersService
   *
   *
   **/
  async changeUserEmailVerification(email: string): Promise<boolean> {
    const user = await this.findOneByEmail(email);

    if (!user) return false;
    if (!user.enabled) return false;
    const token = randomBytes(3).toString('hex');
    // one day for expiration of reset token
    const expiration = new Date(Date().valueOf() + 24 * 60 * 60 * 1000);
    const mailOptions: SendMailOptions = {
      from: this.configService.get('EMAIL_USERNAME'),
      to: email,
      subject: `Reset Email Address`,
      html: `
      
        <h1 style="text-align:center">Saarthi</h1><br/>
        <p style="text-align:center"> <small>Your Future, Our Commitment</small></p>
        <p></p>
        <p style="text-align:center">${user.username}, Replace your email address with this : ${token} <br/><small> please note this token is invalid after 24 hours of generate</small> </p>
      `,
    };
    return new Promise((resolve, reject) => {
      return this.utilityService.sendMailMethod(mailOptions).then((res) => {
        this.userModel
          .updateOne({ email }, { $set: { emailReset: { token, expiration } } })
          .then(
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
      const salt = await bcrypt.genSalt(10);
      createUserInput.password = await bcrypt.hash(
        createUserInput.password,
        salt,
      );
      const lowercaseUsername = createUserInput.username.toLowerCase();
      newUser = await this.userModel.create({
        ...createUserInput,
        lowercaseUsername,
      });
    } catch (error: any) {
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
    email: string,
    code: string,
    password: string,
  ): Promise<UsersDocument | undefined> {
    const user = await this.findOneByEmail(email);
    if (!!user && user.passwordReset && user.enabled !== false) {
      if (
        new Date().getTime() > new Date(user.passwordReset.expiration).getTime()
      )
        throw new HttpQueryError(400, 'token expired');
      if (user.passwordReset.token === code) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        user.passwordReset = undefined;
        await user.save();
        return user;
      } else throw new HttpQueryError(400, 'invalid token');
    }
    return undefined;
  }
  /**
   *  Change User Email Address
   * @param {string} the old email address what you want to change
   * @param {string} the reset token to validate
   * @param {string} the new email address what you want
   * @returns {Promise<UsersDocument | undefined>}  returns undefined if the code
   * @memberof UsersService
   **/
  async changeUserEmailAddress(
    oldEmail: string,
    code: string,
    newEmail: string,
  ): Promise<UsersDocument> {
    const user = await this.findOneByEmail(oldEmail);
    if (!!user && user.emailReset && user.enabled !== false) {
      if (
        new Date().getTime() > new Date(user.passwordReset.expiration).getTime()
      )
        throw new HttpQueryError(400, 'token expired');
      if (user.emailReset && user.emailReset.token === code) {
        user.email = newEmail;
        user.email_enabled = false;
        await user.save();
        return user;
      } else throw new HttpQueryError(400, 'invalid token');
    }
    return undefined;
  }
  /**
   *  validate your email address
   * @param{string} email address to validate
   * @param{string} code to verify your email address
   * @returns {Promise<UsersDocument|undefined>}
   * @memberof{UsersService}
   **/
  async verifyEmailAddress(
    email: string,
    code: string,
  ): Promise<UsersDocument> {
    const user = await this.findOneByEmail(email);
    if (!!user && user.validateEmail) {
      if (
        new Date().getTime() > new Date(user.validateEmail.expiration).getTime()
      )
        throw new HttpQueryError(400, 'token expired');
      if (user.validateEmail.token === code) {
        user.email_enabled = true;
        await user.save();
        return user;
      } else throw new HttpQueryError(400, 'invalid token');
    }
    return undefined;
  }
  /**
   *   validate user email address verification
   * @params {string} user email address
   * @returns {Promise<boolean>} return true if email sent otherwise false
   * @memberof {UsersService}
   *
   **/
  async validateEmailVerification(email: string): Promise<boolean> {
    const user = await this.findOneByEmail(email);
    if (!user) throw new HttpQueryError(400, 'email address is not found');
    if (user.enabled === false) return false;
    const token = randomBytes(3).toString('hex');
    // one day for expiration of reset token
    const expiration = new Date(Date().valueOf() + 24 * 60 * 60 * 1000);
    const mailOptions: SendMailOptions = {
      from: this.configService.get('EMAIL_USERNAME'),
      to: email,
      subject: `Validate Email Address`,
      html: `

        <h1 style="text-align:center">Saarthi</h1><br/>
        <p style="text-align:center"> <small>Your Future, Our Commitment</small></p>
        <p></p>
        <p style="text-align:center">${user.username}, Validate  your email address with this : ${token} <br/><small> please note this token is invalid after 24 hours of generate</small></p>
`,
    };
    return new Promise((resolve, reject) => {
      return this.utilityService.sendMailMethod(mailOptions).then((res) => {
        this.userModel
          .updateOne(
            { email },
            { $set: { validateEmail: { token, expiration } } },
          )
          .then(
            () => resolve(true),
            () => reject(false),
          );
      });
    });
  }
  /***
   * Returns if the user is admin or not
   * @param {string} usertype
   * @returns {boolean}
   * @memberof UsersService
   **/
  isEmployer(userType: string): boolean {
    return userType === UserTypeEnum.employer;
  }
}

export default UsersService;
