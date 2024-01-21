
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class UsersDocument {
    userType: string;
    enabled: boolean;
    email_enabled: boolean;
    password: string;
    lowercaseUsername: string;
    lowercaseEmail: string;
    username: string;
    passwordReset: JSONObject;
}

export abstract class IQuery {
    abstract users(): UsersDocument[] | Promise<UsersDocument[]>;

    abstract user(username: string, email: string): UsersDocument | Promise<UsersDocument>;

    abstract forgotPassword(email: string): boolean | Promise<boolean>;
}

export type JSONObject = any;
type Nullable<T> = T | null;
