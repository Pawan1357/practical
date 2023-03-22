import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Supplier } from './suppliers.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Price {
  @Prop({
    type: Number,
    get: (v: number) => (v / 100).toFixed(2),
    set: (v: number) => v * 100,
  })
  inr: number;

  @Prop({
    type: Number,
    get: (v: number) => (v / 100).toFixed(2),
    set: (v: number) => v * 100,
  })
  euro: number;

  @Prop({
    type: Number,
    get: (v: number) => (v / 100).toFixed(2),
    set: (v: number) => v * 100,
  })
  usd: number;
}

export const PriceSchema = SchemaFactory.createForClass(Price);
PriceSchema.set('toJSON', { getters: true });

@Schema()
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ type: Price, required: true })
  price: Price;

  @Prop({ default: false })
  deleted: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ unique: true })
  sku: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' })
  supplier: Supplier;
}

const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ name: 'text' });
export { ProductSchema };
