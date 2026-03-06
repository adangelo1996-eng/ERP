import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class JournalLineDto {
  @IsString()
  @IsNotEmpty()
  accountId!: string;

  @IsString()
  debit!: string;

  @IsString()
  credit!: string;

  @IsString()
  description?: string;
}

export class PostJournalEntryDto {
  @IsString()
  @IsNotEmpty()
  ledgerId!: string;

  @IsDateString()
  postingDate!: string;

  @IsString()
  @IsNotEmpty()
  reference!: string;

  @IsString()
  @IsIn(['MANUAL', 'SALES', 'PURCHASES', 'PAYROLL', 'INVENTORY', 'INVESTMENT'])
  source!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => JournalLineDto)
  lines!: JournalLineDto[];
}

