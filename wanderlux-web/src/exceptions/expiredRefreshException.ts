export class ExpiredRefreshException extends Error {
  constructor() {
    super("Refresh token has expired");
  }
}
