import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { QueryApplicationDto } from './dto/query-application.dto';
import {
  ApplicationEntity,
  PaginatedResponse,
} from './entities/application.entity';

@ApiTags('applications')
@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new job application' })
  create(
    @Body() createApplicationDto: CreateApplicationDto,
  ): Promise<ApplicationEntity> {
    return this.applicationService.create(createApplicationDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all job applications' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED'],
  })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query() query: QueryApplicationDto,
  ): Promise<PaginatedResponse<ApplicationEntity>> {
    return this.applicationService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single job application' })
  findOne(@Param('id') id: string): Promise<ApplicationEntity> {
    return this.applicationService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a job application' })
  update(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ): Promise<ApplicationEntity> {
    return this.applicationService.update(id, updateApplicationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a job application' })
  remove(@Param('id') id: string): Promise<ApplicationEntity> {
    return this.applicationService.remove(id);
  }
}
