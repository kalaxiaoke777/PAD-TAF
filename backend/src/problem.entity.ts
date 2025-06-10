import { Entity, Column } from 'typeorm';

export enum ProblemStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

@Entity()
export class Problem {
  // ...existing columns...

  @Column({ type: 'enum', enum: ProblemStatus, default: ProblemStatus.PENDING })
  status: ProblemStatus;

  // ...existing columns...
}
