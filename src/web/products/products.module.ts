import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/schemas/products.schema';
import { JwtService } from '@nestjs/jwt';
import { JwtHelper } from 'src/utils/utils';
import { Supplier, SupplierSchema } from 'src/schemas/suppliers.schema';
import { SuppliersService } from '../suppliers/suppliers.service';
import { BlackList, BlackListSchema } from 'src/schemas/blacklist.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Supplier.name, schema: SupplierSchema },
      { name: BlackList.name, schema: BlackListSchema },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, JwtService, JwtHelper, SuppliersService],
})
export class ProductsModule {}
