export interface JWTPayload {
  email: string;
  username: string;
  expiration?: Date;
}
