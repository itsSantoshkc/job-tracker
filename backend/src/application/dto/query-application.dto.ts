import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApplicationStatus } from './create-application.dto';

export class QueryApplicationDto {
  @IsOptional()
  @IsEnum(ApplicationStatus, {
    message: 'Status filter must be applied, interviewing, offer, or rejected',
  })
  status?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;
}
