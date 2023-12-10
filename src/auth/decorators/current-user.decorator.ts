import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserDectorator = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user[data];
  },
);
