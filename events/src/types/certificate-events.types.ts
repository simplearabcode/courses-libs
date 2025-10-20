/**
 * Certificate event types
 */

export const CertificateEventTypes = {
  CERTIFICATE_GENERATED: 'certificate.generated',
  CERTIFICATE_ISSUED: 'certificate.issued',
  CERTIFICATE_VIEWED: 'certificate.viewed',
  CERTIFICATE_DOWNLOADED: 'certificate.downloaded',
  CERTIFICATE_SHARED: 'certificate.shared',
  CERTIFICATE_VERIFIED: 'certificate.verified',
  CERTIFICATE_REVOKED: 'certificate.revoked',
} as const;

export type CertificateEventType = (typeof CertificateEventTypes)[keyof typeof CertificateEventTypes];

// Certificate event payloads
export interface ICertificateGeneratedPayload {
  certificateId: string;
  studentId: string;
  courseId: string;
  courseTitle: string;
  instructorId: string;
  certificateNumber: string;
  generatedAt: Date;
  timestamp: Date;
}

export interface ICertificateIssuedPayload {
  certificateId: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  instructorId: string;
  instructorName: string;
  certificateNumber: string;
  issuedAt: Date;
  pdfUrl?: string;
  timestamp: Date;
}

export interface ICertificateViewedPayload {
  certificateId: string;
  studentId: string;
  courseId: string;
  viewedAt: Date;
  timestamp: Date;
}

export interface ICertificateDownloadedPayload {
  certificateId: string;
  studentId: string;
  courseId: string;
  downloadedAt: Date;
  ipAddress?: string;
  timestamp: Date;
}

export interface ICertificateSharedPayload {
  certificateId: string;
  studentId: string;
  courseId: string;
  platform: string; // LinkedIn, Twitter, Facebook, etc.
  sharedAt: Date;
  timestamp: Date;
}

export interface ICertificateVerifiedPayload {
  certificateId: string;
  certificateNumber: string;
  verifiedBy?: string;
  ipAddress?: string;
  verifiedAt: Date;
  timestamp: Date;
}

export interface ICertificateRevokedPayload {
  certificateId: string;
  studentId: string;
  courseId: string;
  reason: string;
  revokedBy: string;
  revokedAt: Date;
  timestamp: Date;
}
