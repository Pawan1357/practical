import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { Supplier, SupplierSchema } from 'src/schemas/suppliers.schema';
import { JwtService } from '@nestjs/jwt';
import { JwtHelper } from 'src/utils/utils';
import { BlackList, BlackListSchema } from 'src/schemas/blacklist.schema';

@Module({
  imports: [
    PassportModule,
    MongooseModule.forFeature([
      { name: Supplier.name, schema: SupplierSchema },
      { name: BlackList.name, schema: BlackListSchema },
    ]),
  ],
  controllers: [SuppliersController],
  providers: [SuppliersService, JwtService, JwtHelper],
  exports: [SuppliersService],
})
export class SuppliersModule {}
