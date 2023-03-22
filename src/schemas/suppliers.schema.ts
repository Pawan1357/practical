import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import Role from 'src/utils/consts';

export type SupplierDocument = HydratedDocument<Supplier>;

@Schema()
export class Supplier {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  address: string;

  @Prop({ default: Role.Supplier })
  role: Role;

  @Prop({ default: null })
  forgetPwdToken: string;

  @Prop({ default: null })
  forgetPwdExpires: string;

  @Prop({ default: false })
  deleted: boolean;

  @Prop()
  createdAt: Date;
}

const SupplierSchema = SchemaFactory.createForClass(Supplier);
SupplierSchema.index({ name: 'text' });
export { SupplierSchema };
