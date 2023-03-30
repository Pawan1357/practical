import {
  IsNotEmpty,
  IsString,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

class CreatePriceDto {
  @IsNumber()
  inr: number;

  @IsNumber()
  euro: number;

  @IsNumber()
  usd: number;
}

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreatePriceDto)
  price: CreatePriceDto;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
