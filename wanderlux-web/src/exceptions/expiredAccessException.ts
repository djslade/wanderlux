export class ExpiredAccessException extends Error {
  constructor() {
    super("Access token has expired");
  }
}
