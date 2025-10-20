/**
 * Base entity interface
 */

export interface IBaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITimestamps {
  createdAt: Date;
  updatedAt: Date;
}

export abstract class BaseEntity implements IBaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(id: string, createdAt: Date, updatedAt: Date) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
