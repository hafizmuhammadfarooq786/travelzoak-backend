import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserIdDectorator = createParamDecorator(
  (data: undefined, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.user.userId;
  },
);
