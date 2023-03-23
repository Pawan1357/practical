import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/schemas/products.schema';
import {
  CreateProductDto,
  UpdateProductDto,
} from './../../dto/create-product.dto';
import * as crypto from 'crypto';
import { Supplier, SupplierDocument } from 'src/schemas/suppliers.schema';
import { ERR_MSGS } from 'src/utils/consts';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private prodModel: Model<ProductDocument>,
    @InjectModel(Supplier.name) private suppModel: Model<SupplierDocument>,
  ) {}

  async create(createProductDto: CreateProductDto, user: SupplierDocument) {
    try {
      console.log('createProductDto', createProductDto);

      const existingSupplier = await this.suppModel.findOne({ _id: user?.id });
      if (!existingSupplier) {
        throw new BadRequestException(ERR_MSGS.SUPPLIER_NOT_FOUND);
      }
      console.log('existingSupplier', existingSupplier);
      const prodName = createProductDto.name;
      const suppName = existingSupplier.name;
      const catName = createProductDto.category;
      const sku = (prodName: string, suppName: string, catName: string) => {
        const data = `${prodName}-${suppName}-${catName}`;
        const hash = crypto.createHash('sha256').update(data).digest('hex');
        const prefix = hash.substring(0, 8);
        const suffix = hash.substring(hash.length - 8);
        return `${prefix}-${suffix}`;
      };
      const newSKU = sku(prodName, suppName, catName);
      console.log(newSKU);
    } catch (err) {
      return err;
    }
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
