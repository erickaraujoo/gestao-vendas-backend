export class UserNameOrPasswordIncorrectError extends Error {
  public constructor() {
    super('E-mail e/ou senha incorretos');

    Object.setPrototypeOf(this, UserNameOrPasswordIncorrectError.prototype);
  }
}
