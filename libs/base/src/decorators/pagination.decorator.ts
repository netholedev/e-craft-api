import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const DEFAULT_LIMIT = 15;
const DEFAULT_PAGE = 0;

export const Pagination = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  const query = {
    limit: parseInt(request.query.limit) || DEFAULT_LIMIT,
    skip: DEFAULT_PAGE,
    page: 1,
  };

  if (request.query.page && request.query.page !== '') {
    const page = parseInt(request.query.page) - 1;
    query.skip = page > 0 ? page * query.limit : 0;
    query.page = parseInt(request.query.page);
  }

  return query;
});
