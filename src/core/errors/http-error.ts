export default class HttpError extends Error {
  public httpStatusCode!: number;
  public detail?: string;

  constructor(httpStatusCode: number, message: string, detail?: string) {
    super(message);
    this.name = 'HttpErrorException';
    this.httpStatusCode = httpStatusCode;
    this.message = message;
    this.detail = detail;
  }
}
