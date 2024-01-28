
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class LoginUserInput {
    username: string;
    email: string;
    password: string;
}

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

export class AddCountryInput {
    country_name: string;
}

export class EditCountryInput {
    country_id: string;
    country_name: string;
}

export class CreateStateInput {
    state_name: string;
    country_id: string;
}

export class EditStateInput {
    state_name: string;
    country_id: string;
    state_id: string;
}

export class CreateCityInput {
    city_name: string;
    state_id: string;
    country: string;
}

export class EditCityInput {
    city_id: string;
    city_name: string;
    state_id: string;
    country_id: string;
}

export class UsersDocument {
    _id: string;
    userType: string;
    enabled: boolean;
    email_enabled: boolean;
    email: string;
    password: string;
    is_registered: boolean;
    lowercaseUsername: string;
    username: string;
    passwordReset: JSONObject;
    emailReset: JSONObject;
    validateEmail: JSONObject;
    permission: string[];
}

export class LoginResult {
    user: UsersDocument;
    token: string;
}

export class CountryDocument {
    _id: string;
    Country_name: string;
}

export class StateDocument {
    _id: string;
    State_name: string;
    country: CountryDocument;
}

export class CityDocument {
    _id: string;
    city_name: string;
    state?: Nullable<StateDocument>;
    country: CountryDocument;
}

export class LocationDocument {
    _id: string;
    latitude: string;
    longitude: string;
    location_name: string;
    address_line_1: string;
    address_line_2: string;
    pin_code: number;
    city: CityDocument;
}

export class CourseDocument {
    _id: string;
    course_name: string;
    other_name: string;
}

export class EducationDocument {
    _id: string;
    grade: string;
    marks: string;
    marksUnit: string;
    course: CourseDocument;
    additional_qualification: string[];
    start_period: DateTime;
    end_period: DateTime;
}

export class LanguageDocument {
    _id: string;
    name: string;
}

export class ImageDocument {
    _id: string;
    user: UsersDocument;
    image_url: string;
}

export class JobCategoryDocument {
    _id: string;
    category_name: string;
    category_image: ImageDocument;
}

export class CandidateProfileDocument {
    _id: string;
    candidate: CandidateDocument;
    website_link: string;
    educations: EducationDocument[];
    languages: LanguageDocument[];
    description: string;
    total_year_of_experience: string;
    career_objective: string;
    profile_image: ImageDocument;
    social_network_urls: JSONObject[];
    current_job_category: JobCategoryDocument;
}

export class CandidateDocument {
    _id: string;
    first_name: string;
    last_name: string;
    candidate_profile: CandidateProfileDocument;
    location: LocationDocument;
    user: UsersDocument;
    secondary_email: string;
    primary_contact_no: string;
    secondary_contact_no: string;
}

export class CompanyDocument {
    _id: string;
    company_name: string;
    other_name: string;
    social_network_urls: JSONObject[];
}

export class ExperienceMasterDocument {
    _id: string;
    lower_limit: string;
    upper_limit: string;
}

export abstract class IQuery {
    abstract users(): UsersDocument[] | Promise<UsersDocument[]>;

    abstract user(username: string, email: string): UsersDocument | Promise<UsersDocument>;

    abstract forgotPassword(email: string): boolean | Promise<boolean>;

    abstract changeEmailAddress(email: string): boolean | Promise<boolean>;

    abstract login(user: LoginUserInput): LoginResult | Promise<LoginResult>;

    abstract refreshToken(): LoginResult | Promise<LoginResult>;

    abstract countries(): CountryDocument[] | Promise<CountryDocument[]>;

    abstract country(country_id: string): CountryDocument | Promise<CountryDocument>;

    abstract state(state_id: string): StateDocument | Promise<StateDocument>;

    abstract states(): StateDocument[] | Promise<StateDocument[]>;

    abstract cities(): CityDocument[] | Promise<CityDocument[]>;

    abstract city(city_id: string): CityDocument | Promise<CityDocument>;
}

export abstract class IMutation {
    abstract createUser(createUserInput: CreateUserInput): UsersDocument | Promise<UsersDocument>;

    abstract resetPassword(resetPasswordInput: ResetPasswordInput): UsersDocument | Promise<UsersDocument>;

    abstract resetEmailAddress(resetEmailInput: ResetEmailInput): UsersDocument | Promise<UsersDocument>;

    abstract createCountry(addNewCountry: AddCountryInput): CountryDocument | Promise<CountryDocument>;

    abstract editCountry(editCountry: EditCountryInput): CountryDocument | Promise<CountryDocument>;

    abstract deleteCountry(country_id: string): CountryDocument[] | Promise<CountryDocument[]>;

    abstract addNewState(addNewState: CreateStateInput): StateDocument | Promise<StateDocument>;

    abstract editNewState(editStatePayload: EditStateInput): StateDocument | Promise<StateDocument>;

    abstract deleteState(State_id: string): StateDocument[] | Promise<StateDocument[]>;

    abstract addNewCity(createCityInput: CreateCityInput): CityDocument | Promise<CityDocument>;

    abstract editCity(editCityInput: EditCityInput): CityDocument | Promise<CityDocument>;

    abstract deleteCity(city_id: string): CityDocument[] | Promise<CityDocument[]>;
}

export type JSONObject = any;
export type DateTime = any;
type Nullable<T> = T | null;
