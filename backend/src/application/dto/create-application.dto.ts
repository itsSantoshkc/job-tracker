import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

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

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Company name must be at least 2 characters' })
  companyName!: string;

  @IsString()
  @IsNotEmpty()
  jobTitle!: string;

  @IsEnum(JobType, {
    message: 'Job type must be internship, full_time, or part_time',
  })
  jobType!: JobType;

  @IsEnum(ApplicationStatus, {
    message: 'Status must be applied, interviewing, offer, or rejected',
  })
  status!: ApplicationStatus;

  @IsString()
  @IsNotEmpty()
  appliedDate!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
