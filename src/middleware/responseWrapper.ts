// responseWrapper.ts
import { Request, Response, NextFunction } from 'express';

interface WrappedResponseData {
  result: any;
  isError: boolean;
  detail: any;
}

function responseWrapper(req: Request, res: Response, next: NextFunction) {
  const originalSend = res.send;

console.log("res",res)

  next();
}

export default responseWrapper;
