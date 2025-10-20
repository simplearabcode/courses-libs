/**
 * Request logging middleware for Fastify
 */

import { FastifyRequest, FastifyReply } from 'fastify';

export async function requestLogger(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const startTime = Date.now();

  reply.raw.on('finish', () => {
    const responseTime = Date.now() - startTime;
    
    request.log.info({
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: request.headers['user-agent'],
      ip: request.ip,
    });
  });
}
