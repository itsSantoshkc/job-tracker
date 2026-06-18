import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum JobType {
  INTERNSHIP = 'INTERNSHIP',
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
}

export enum ApplicationStatus {
  APPLIED = 'APPLIED',
  INTERVIEWING = 'INTERVIEWING',
  OFFER = 'OFFER',
  REJECTED = 'REJECTED',
}

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'company_name' })
  companyName!: string;

  @Column({ name: 'job_title' })
  jobTitle!: string;

  @Column({ name: 'job_type', type: 'enum', enum: JobType, default: JobType.FULL_TIME })
  jobType!: JobType;

  @Column({ type: 'enum', enum: ApplicationStatus, default: ApplicationStatus.APPLIED })
  status!: ApplicationStatus;

  @Column({ name: 'applied_date', type: 'timestamp' })
  appliedDate!: Date;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;
}

export interface ApplicationEntity {
  id: string;
  companyName: string;
  jobTitle: string;
  jobType: string;
  status: string;
  appliedDate: Date;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
