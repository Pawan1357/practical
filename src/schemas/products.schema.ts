import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Supplier } from './suppliers.schema';
import { priceOptions } from 'src/utils/consts';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ _id: false })
export class Price {
  @Prop(priceOptions)
  inr: number;

  @Prop(priceOptions)
  euro: number;

  @Prop(priceOptions)
  usd: number;
}

export const PriceSchema = SchemaFactory.createForClass(Price);
PriceSchema.set('toObject', { getters: true });
PriceSchema.set('toJSON', { getters: true });

@Schema()
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ type: PriceSchema, required: true, index: false })
  price: Price;

  @Prop({ default: false })
  deleted: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  sku: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' })
  supplier: Supplier;
}

const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ name: 'text' });
PriceSchema.set('toObject', { getters: true });
PriceSchema.set('toJSON', { getters: true });
export { ProductSchema };
// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import mongoose, { HydratedDocument } from 'mongoose';
// import { priceOptions } from 'src/utils/consts';
// import { Supplier } from './suppliers.schema';

// @Schema({ _id: false })
// export class Price {
//   @Prop(priceOptions)
//   inr: number;

//   @Prop(priceOptions)
//   euro: number;

//   @Prop(priceOptions)
//   usd: number;
// }

// export const PriceSchema = SchemaFactory.createForClass(Price);
// PriceSchema.set('toObject', { getters: true });
// PriceSchema.set('toJSON', { getters: true });

// // export type ProductDocument = HydratedDocument<Product>;

// @Schema()
// export class Product {
//   @Prop({ required: true })
//   name: string;

//   @Prop({ required: true })
//   description: string;

//   @Prop({ required: true })
//   category: string;

//   @Prop({ type: PriceSchema, required: true, index: false })
//   price: Price;

//   @Prop({ default: false })
//   deleted: boolean;

//   @Prop()
//   createdAt: Date;

//   @Prop()
//   updatedAt: Date;

//   @Prop()
//   sku: string;

//   @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' })
//   supplier: Supplier;
// }

// export const ProductSchema = SchemaFactory.createForClass(Product);
// ProductSchema.index({ name: 'text' });
// // ProductSchema.set('toObject', { getters: true });
// // ProductSchema.set('toJSON', { getters: true });
// // export { ProductSchema };
