import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  UpdateProductDto,
} from './../../dto/create-product.dto';
import { Users } from 'src/decorators/user.decorator';
import { SupplierDocument } from 'src/schemas/suppliers.schema';
import RoleGuard from 'src/guards/roleGuard.guard';
import Role from 'src/utils/consts';
import { ValidateObjectId } from 'src/utils/utils';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('create')
  @UsePipes(ValidationPipe)
  @UseGuards(RoleGuard(Role.Supplier))
  async create(
    @Body() createProductDto: CreateProductDto,
    @Users() user: SupplierDocument,
  ) {
    return this.productsService.create(createProductDto, user);
  }

  @Get('findAll')
  @UseGuards(RoleGuard(Role.Supplier))
  async findAll() {
    return this.productsService.findAll();
  }

  @Get('findOne/:id')
  @UseGuards(RoleGuard(Role.Supplier))
  async findOne(@Param('id', new ValidateObjectId()) id: string) {
    return this.productsService.findOne(id);
  }

  @Patch('update/:id')
  @UsePipes(ValidationPipe)
  @UseGuards(RoleGuard(Role.Supplier))
  async update(
    @Param('id', new ValidateObjectId()) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Users() user: SupplierDocument,
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @UseGuards(RoleGuard(Role.Supplier))
  async remove(
    @Param('id', new ValidateObjectId()) id: string,
    @Users() user: SupplierDocument,
  ) {
    return this.productsService.remove(id, user);
  }
}
