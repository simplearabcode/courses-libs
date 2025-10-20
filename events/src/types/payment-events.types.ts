/**
 * Payment and transaction event types
 */

export const PaymentEventTypes = {
  // Payment lifecycle
  PAYMENT_INITIATED: 'payment.initiated',
  PAYMENT_PROCESSING: 'payment.processing',
  PAYMENT_COMPLETED: 'payment.completed',
  PAYMENT_FAILED: 'payment.failed',
  PAYMENT_CANCELLED: 'payment.cancelled',

  // Refunds
  REFUND_INITIATED: 'payment.refund.initiated',
  REFUND_PROCESSING: 'payment.refund.processing',
  REFUND_COMPLETED: 'payment.refund.completed',
  REFUND_FAILED: 'payment.refund.failed',

  // Webhooks
  PAYMENT_WEBHOOK_RECEIVED: 'payment.webhook.received',
} as const;

export type PaymentEventType = (typeof PaymentEventTypes)[keyof typeof PaymentEventTypes];

// Payment event payloads
export interface IPaymentInitiatedPayload {
  paymentId: string;
  studentId: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  currency: string;
  provider: string;
  paymentIntentId?: string;
  timestamp: Date;
}

export interface IPaymentProcessingPayload {
  paymentId: string;
  studentId: string;
  courseId: string;
  amount: number;
  provider: string;
  timestamp: Date;
}

export interface IPaymentCompletedPayload {
  paymentId: string;
  studentId: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  currency: string;
  provider: string;
  method: string;
  providerFee?: number;
  netAmount?: number;
  transactionId?: string;
  processedAt: Date;
  timestamp: Date;
}

export interface IPaymentFailedPayload {
  paymentId: string;
  studentId: string;
  courseId: string;
  amount: number;
  currency: string;
  provider: string;
  failureReason: string;
  errorCode?: string;
  timestamp: Date;
}

export interface IPaymentCancelledPayload {
  paymentId: string;
  studentId: string;
  courseId: string;
  amount: number;
  reason?: string;
  timestamp: Date;
}

export interface IRefundInitiatedPayload {
  refundId: string;
  paymentId: string;
  studentId: string;
  courseId: string;
  amount: number;
  currency: string;
  reason: string;
  initiatedBy: string;
  timestamp: Date;
}

export interface IRefundProcessingPayload {
  refundId: string;
  paymentId: string;
  amount: number;
  provider: string;
  timestamp: Date;
}

export interface IRefundCompletedPayload {
  refundId: string;
  paymentId: string;
  studentId: string;
  courseId: string;
  amount: number;
  currency: string;
  provider: string;
  processedAt: Date;
  timestamp: Date;
}

export interface IRefundFailedPayload {
  refundId: string;
  paymentId: string;
  studentId: string;
  amount: number;
  failureReason: string;
  timestamp: Date;
}

export interface IPaymentWebhookReceivedPayload {
  provider: string;
  eventType: string;
  webhookId: string;
  paymentIntentId?: string;
  data: Record<string, unknown>;
  timestamp: Date;
}
