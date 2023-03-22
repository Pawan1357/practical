import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Req,
  Query,
  UseGuards,
  Get,
} from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import {
  CreateSupplierDto,
  ForgetPassDto,
  LoginSupplierDto,
  ResetPassDto,
} from '../../dto/create-supplier.dto';
import { JwtAuthGuard } from 'src/guards/jwtAuthGuard.guard';
import { Users } from 'src/decorators/user.decorator';
import { SupplierDocument } from 'src/schemas/suppliers.schema';
import { Jwt } from 'src/decorators/jwt.decorator';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post('create')
  @UsePipes(ValidationPipe)
  async create(@Body() createSupplierDto: CreateSupplierDto) {
    return this.suppliersService.create(createSupplierDto);
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  async login(@Body() loginDetails: LoginSupplierDto) {
    return await this.suppliersService.login(loginDetails);
  }

  @Post('forget')
  @UsePipes(ValidationPipe)
  async forget(@Body() forgetPassDetails: ForgetPassDto, @Req() req) {
    return await this.suppliersService.forget(forgetPassDetails, req);
  }

  @Post('reset')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  async reset(
    @Body() resetPassDetails: ResetPassDto,
    @Users() user: SupplierDocument,
    @Query('token') token: string,
  ) {
    return await this.suppliersService.reset(resetPassDetails, user, token);
  }

  @Get('logOut')
  @UseGuards(JwtAuthGuard)
  async logout(@Users() user, @Jwt() jwt) {
    return await this.suppliersService.logout(user, jwt);
  }
}
