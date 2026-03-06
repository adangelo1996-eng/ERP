import { IsDateString, IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class CreateManufacturingOrderDto {
  @IsString()
  @IsNotEmpty()
  itemId!: string;

  @IsNumberString()
  quantity!: string;

  @IsDateString()
  dueDate!: string;
}

