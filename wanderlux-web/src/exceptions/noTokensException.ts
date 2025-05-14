export class NoTokensException extends Error {
  constructor() {
    super("One or more tokens are missing");
  }
}
