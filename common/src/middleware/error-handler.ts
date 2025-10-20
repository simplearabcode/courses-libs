/**
 * Global error handler for Fastify
 */

import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../errors/app-error';
import { IApiResponse } from '../../../shared/src';

export function errorHandler(
  error: Error | FastifyError | AppError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Log error
  request.log.error({
    err: error,
    url: request.url,
    method: request.method,
  });

  // Handle AppError
  if (error instanceof AppError) {
    const response: IApiResponse = {
      success: false,
      message: error.message,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    };
    return reply.status(error.statusCode).send(response);
  }

  // Handle Fastify/AJV validation errors
  if ('validation' in error) {
    const response: IApiResponse = {
      success: false,
      message: 'Validation failed',
      error: {
        code: 'VAL_2001',
        message: error.message,
      },
    };
    return reply.status(400).send(response);
  }

  // Handle rate limit errors
  if ('statusCode' in error && error.statusCode === 429) {
    const response: IApiResponse = {
      success: false,
      message: 'Too many requests. Please try again later.',
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: error.message,
      },
    };
    return reply.status(429).send(response);
  }

  // Handle generic errors
  const response: IApiResponse = {
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message,
    error: {
      code: 'SRV_5001',
      message: error.message,
    },
  };

  return reply.status(500).send(response);
}
