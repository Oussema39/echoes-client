import { IBase } from "./IBase";

export interface IUser extends Partial<IBase> {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  age?: number;
  emailVerified?: boolean;
  refreshToken?: string;
  picture?: string;
}
