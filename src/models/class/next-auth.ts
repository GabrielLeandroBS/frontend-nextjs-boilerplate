import { CredentialsSignin } from "next-auth";

export class AuthCustomError extends CredentialsSignin {
  constructor(code: string) {
    super();
    this.code = code;
    this.message = code;
    this.stack = undefined;
  }
}
