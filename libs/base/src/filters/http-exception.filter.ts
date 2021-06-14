import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    // const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse();

    const responseObj = {
      statusCode: status,
      messages: [],
    };

    if (typeof exceptionResponse !== 'string') {
      const validationMessages = (exceptionResponse as { message: any[] }).message;
      const messages = Array.isArray(validationMessages)
        ? validationMessages
        : [validationMessages];
      responseObj.messages = messages;
    }

    response.status(status).send(responseObj);
  }
}
