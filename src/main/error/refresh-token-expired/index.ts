export class RefreshTokenExpiredError extends Error {
  public constructor() {
    super('Faça o login novamente');

    Object.setPrototypeOf(this, RefreshTokenExpiredError.prototype);
  }
}
