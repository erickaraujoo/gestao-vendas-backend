export class UserNameAlreadyExistsError extends Error {
  public constructor() {
    super('Já existe um usuário com este e-mail');

    Object.setPrototypeOf(this, UserNameAlreadyExistsError.prototype);
  }
}
