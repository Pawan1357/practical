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
      const prodName = createProductDto.name;
      const suppName = existingSupplier.name;
      const catName = createProductDto.category;
      const sku = (prodName, suppName, catName) => {
        const data = `${prodName}-${suppName}-${catName}`;
        const hash = crypto.createHash('sha256').update(data).digest('hex');
        console.log(typeof hash);
        // const prefix = hash.substr(0, 8);
        // const suffix = hash.substr(-8);
        // return `${prefix}-${suffix}`;
        return hash;
      };
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
