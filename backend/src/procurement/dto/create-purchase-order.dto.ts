import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumberString,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class PurchaseOrderLineDto {
  @IsString()
  @IsNotEmpty()
  itemId!: string;

  @IsNumberString()
  quantity!: string;

  @IsNumberString()
  unitPrice!: string;
}

export class CreatePurchaseOrderDto {
  @IsString()
  @IsNotEmpty()
  supplierId!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PurchaseOrderLineDto)
  lines!: PurchaseOrderLineDto[];
}

