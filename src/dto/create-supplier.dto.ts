import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { emailRegex, passRegex } from 'src/utils/consts';

export class CreateSupplierDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @Matches(emailRegex, { message: 'Invalid Email!' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Matches(passRegex, { message: 'Password too weak!' })
  password: string;

  @IsNotEmpty()
  @IsString()
  address: string;
}

export class UpdateSupplierDto extends PartialType(CreateSupplierDto) {}

export class LoginSupplierDto extends PartialType(CreateSupplierDto) {
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class ForgetPassDto {
  @IsEmail()
  @IsNotEmpty()
  @Matches(emailRegex, { message: 'Invalid Email!' })
  email: string;
}

export class ResetPassDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  newPass: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  confirmPass: string;
}
