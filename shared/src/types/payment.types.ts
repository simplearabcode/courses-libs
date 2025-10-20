/**
 * Payment-related types and enums
 */

export enum PaymentProvider {
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL',
  RAZORPAY = 'RAZORPAY',
  PADDLE = 'PADDLE',
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  DIGITAL_WALLET = 'DIGITAL_WALLET',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
}

export interface IPayment {
  id: string;
  studentId: string;
  courseId: string;
  paymentIntentId?: string;
  provider: PaymentProvider;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  currency: string;
  providerFee?: number;
  netAmount?: number;
  metadata?: Record<string, unknown>;
  failureReason?: string;
  processedAt?: Date;
  refundedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
