import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Filter = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  if (request.query.filter) {
    const filter = JSON.parse(request.query.filter);

    const keys = Object.keys(filter);

    keys.forEach((k: string) => {
      if (filter[k] === '' || filter[k] === null) {
        delete filter[k];
      }
    });

    return filter;
  }

  return {};
});
