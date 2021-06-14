import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data?: T;
  messages?: string[];
  statusCode: number;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // const isEmptyArrayArray = Array.isArray(data) && data.length === 0;
        const res = context.switchToHttp().getResponse();
        const statusCode = res.statusCode;
        return Object.assign(
          // { data: data || (isEmptyArrayArray ? [] : {}) },
          { data: data || {} },
          { statusCode },
        );
      }),
    );
  }
}
