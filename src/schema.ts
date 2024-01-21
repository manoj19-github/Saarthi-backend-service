
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
    password: string;
    lowercaseUsername: string;
    lowercaseEmail: string;
    username: string;
    passwordReset: JSONObject;
}

export abstract class IQuery {
    abstract users(): UsersDocument[] | Promise<UsersDocument[]>;
}

export type JSONObject = any;
type Nullable<T> = T | null;
