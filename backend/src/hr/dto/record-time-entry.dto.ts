import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RecordTimeEntryDto {
  @IsString()
  @IsNotEmpty()
  employeeId!: string;

  @IsDateString()
  clockIn!: string;

  @IsOptional()
  @IsDateString()
  clockOut?: string;
}

