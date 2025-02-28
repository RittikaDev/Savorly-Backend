import { Response } from 'express';

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  token?: string;
  data?: T;
  paginationMetaData?: {
    limit?: number;
    total?: number;
    page?: number;
    totalPages?: number;
  };
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  return res.status(data?.statusCode).json({
    success: data?.success,
    statusCode: data?.statusCode,
    message: data?.message,
    token: data?.token,
    data: data?.data,
    paginationMetaData: data?.paginationMetaData,
  });
};

export default sendResponse;
