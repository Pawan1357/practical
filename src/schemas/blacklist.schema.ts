import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Supplier } from './suppliers.schema';

export type BBDocument = HydratedDocument<BlackList>;

@Schema()
export class BlackList {
  @Prop()
  token: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' })
  supplier: Supplier;
}

const BlackListSchema = SchemaFactory.createForClass(BlackList);
export { BlackListSchema };
