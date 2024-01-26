
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreateUserInput {
    username: string;
    email: string;
    password: string;
}

export class ResetPasswordInput {
    email: string;
    code: string;
    password: string;
}

export class ResetEmailInput {
    oldEmail: string;
    newEmail: string;
    code: string;
}

export class UsersDocument {
    userType: string;
    enabled: boolean;
    email_enabled: boolean;
    is_registered: boolean;
    email: string;
    password: string;
    lowercaseUsername: string;
    username: string;
    passwordReset: JSONObject;
    emailReset: JSONObject;
    validateEmail: JSONObject;
}

export abstract class IQuery {
    abstract users(): UsersDocument[] | Promise<UsersDocument[]>;

    abstract user(username: string, email: string): UsersDocument | Promise<UsersDocument>;

    abstract forgotPassword(email: string): boolean | Promise<boolean>;

    abstract changeEmailAddress(email: string): boolean | Promise<boolean>;
}

export abstract class IMutation {
    abstract createUser(createUserInput: CreateUserInput): UsersDocument | Promise<UsersDocument>;

    abstract resetPassword(resetPasswordInput: ResetPasswordInput): UsersDocument | Promise<UsersDocument>;

    abstract resetEmailAddress(resetEmailInput: ResetEmailInput): UsersDocument | Promise<UsersDocument>;
}

export type JSONObject = any;
type Nullable<T> = T | null;
