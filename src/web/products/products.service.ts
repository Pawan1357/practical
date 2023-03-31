import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/schemas/products.schema';
import {
  CreateProductDto,
  UpdateProductDto,
} from './../../dto/create-product.dto';
import * as crypto from 'crypto';
import { Supplier, SupplierDocument } from 'src/schemas/suppliers.schema';
import { ERR_MSGS, SUCCESS_MSGS } from 'src/utils/consts';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private prodModel: Model<ProductDocument>,
    @InjectModel(Supplier.name) private suppModel: Model<SupplierDocument>,
  ) {}

  async create(createProductDto: CreateProductDto, user: SupplierDocument) {
    try {
      const existingSupplier = await this.suppModel.findOne({
        $and: [{ _id: user?.id }, { deleted: false }],
      });
      if (!existingSupplier) {
        throw new BadRequestException(ERR_MSGS.SUPPLIER_NOT_FOUND);
      }
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
      const existingSku = await this.prodModel.findOne({
        $and: [{ sku: newSKU }, { deleted: false }],
      });
      const newProduct = new this.prodModel(createProductDto);
      if (existingSku) {
        newProduct.sku = existingSku.sku;
        newProduct.supplier = user.id;
        newProduct.createdAt = new Date();
      } else {
        newProduct.sku = newSKU;
        newProduct.supplier = user.id;
        newProduct.createdAt = new Date();
      }
      await newProduct.save();
      return { newProduct, message: SUCCESS_MSGS.PRODUCT_CREATED };
    } catch (err) {
      return err;
    }
  }

  async findAll() {
    try {
      // const products = await this.prodModel.aggregate([
      //   { $match: { deleted: false } },
      //   {
      //     $lookup: {
      //       from: 'suppliers',
      //       localField: 'supplier',
      //       foreignField: '_id',
      //       as: 'supplier',
      //     },
      //   },
      //   {
      //     $project: {
      //       'supplier.password': 0,
      //       'supplier.role': 0,
      //       'supplier.forgetPwdToken': 0,
      //       'supplier.forgetPwdExpires': 0,
      //       'supplier.deleted': 0,
      //       'supplier.createdAt': 0,
      //       'supplier.__v': 0,
      //       deleted: 0,
      //       __v: 0,
      //       createdAt: 0,
      //       updatedAt: 0,
      //     },
      //   },
      // ]);
      const products = await this.prodModel
        .find(
          { deleted: false },
          { deleted: 0, __v: 0, createdAt: 0, updatedAt: 0 },
        )
        .populate({
          path: 'supplier',
          select:
            '-password -role -forgetPwdToken -forgetPwdExpires -deleted -createdAt -__v',
        });
      return { products, message: SUCCESS_MSGS.FIND_ALL_PRODUCTS };
    } catch (err) {
      return err;
    }
  }

  async findOne(id: string) {
    try {
      const existingProduct = await this.prodModel
        .findOne(
          {
            $and: [{ deleted: false }, { _id: id }],
          },
          { deleted: 0, __v: 0, createdAt: 0, updatedAt: 0 },
        )
        .populate({
          path: 'supplier',
          select:
            '-password -role -forgetPwdToken -forgetPwdExpires -deleted -createdAt -__v',
        });
      return { existingProduct, message: SUCCESS_MSGS.FOUND_ONE_PRODUCT };
    } catch (err) {
      return err;
    }
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    user: SupplierDocument,
  ) {
    try {
      const existingProduct = await this.prodModel.findOne({
        $and: [{ _id: id }, { supplier: user.id }, { deleted: false }],
      });
      if (!existingProduct) {
        throw new BadRequestException(ERR_MSGS.PRODUCT_NOT_FOUND);
      }
      const updatedProduct = await this.prodModel.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            name: updateProductDto?.name,
            description: updateProductDto?.description,
            category: updateProductDto?.category,
            price: updateProductDto?.price,
            updatedAt: new Date(),
          },
        },
        { new: true, projection: { deleted: 0, __v: 0, updatedAt: 0 } },
      );
      return { updatedProduct, message: SUCCESS_MSGS.UPDATED_PRODUCT };
    } catch (err) {
      return err;
    }
  }

  async remove(id: string, user: SupplierDocument) {
    try {
      const existingProduct = await this.prodModel.findOne({
        $and: [
          { deleted: false },
          { _id: new mongoose.Types.ObjectId(id) },
          { supplier: new mongoose.Types.ObjectId(user.id) },
        ],
      });
      if (!existingProduct) {
        throw new BadRequestException(ERR_MSGS.PRODUCT_NOT_FOUND);
      }
      await this.prodModel.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(id),
        },
        { $set: { deleted: true } },
      );
      return SUCCESS_MSGS.PRODUCT_DELETED;
    } catch (err) {
      return err;
    }
  }
}
