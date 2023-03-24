import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Supplier, SupplierDocument } from 'src/schemas/suppliers.schema';
import { ERR_MSGS, SUCCESS_MSGS } from 'src/utils/consts';
import { hashPassword, JwtHelper, verifyPass } from 'src/utils/utils';
import {
  CreateSupplierDto,
  ForgetPassDto,
  LoginSupplierDto,
  ResetPassDto,
} from '../../dto/create-supplier.dto';
import * as crypto from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';
import { BBDocument, BlackList } from 'src/schemas/blacklist.schema';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectModel(Supplier.name) private suppModel: Model<SupplierDocument>,
    @InjectModel(BlackList.name) private bbModel: Model<BBDocument>,
    private mailerService: MailerService,
    private readonly jwtHelper: JwtHelper,
  ) {}

  @Cron(CronExpression.EVERY_QUARTER)
  async deleteBlackList() {
    await this.bbModel.deleteMany({});
  }

  async create(createSupplierDto: CreateSupplierDto) {
    try {
      const existingSupplier = await this.suppModel.findOne({
        $and: [
          {
            email: createSupplierDto.email,
          },
          {
            deleted: false,
          },
        ],
      });
      if (existingSupplier && existingSupplier.deleted == false) {
        throw new BadRequestException(ERR_MSGS.EMAIL_ALREADY_USED);
      }
      const hashedPassword = await hashPassword(createSupplierDto.password);
      createSupplierDto.password = hashedPassword;
      const newSupplier = new this.suppModel(createSupplierDto);
      newSupplier.createdAt = new Date();
      await newSupplier.save();
      const supplier = newSupplier.toObject();
      delete supplier.password;
      return { supplier, message: SUCCESS_MSGS.SUPPLIER_CREATED };
    } catch (err) {
      return err;
    }
  }

  async login(loginDetails: LoginSupplierDto) {
    try {
      const existingSupplier = await this.suppModel.findOne({
        $and: [
          {
            email: loginDetails.email,
          },
          {
            deleted: false,
          },
        ],
      });
      if (!existingSupplier) {
        throw new BadRequestException(ERR_MSGS.SUPPLIER_NOT_FOUND);
      }
      if (
        !(await verifyPass(loginDetails.password, existingSupplier.password))
      ) {
        throw new UnauthorizedException(ERR_MSGS.BAD_CREDS);
      }
      const payload = {
        id: existingSupplier._id,
        email: existingSupplier.email,
        role: existingSupplier.role,
      };
      const access_token = await this.jwtHelper.sign(payload);
      return {
        access_token,
        existingSupplier,
        message: SUCCESS_MSGS.LOGGED_IN,
      };
    } catch (err) {
      return err;
    }
  }

  async forget(forgetPassDetails: ForgetPassDto, req) {
    try {
      const existingSupplier = await this.suppModel.findOne({
        $and: [
          {
            email: forgetPassDetails.email,
          },
          {
            deleted: false,
          },
        ],
      });
      if (!existingSupplier) {
        throw new BadRequestException(ERR_MSGS.EMAIL_NOT_LINKED);
      }
      const token = crypto.randomBytes(20).toString('hex');
      const link =
        'http://' + req.headers.host + '/suppliers/reset?token=' + token;
      this.mailerService.sendMail({
        to: existingSupplier.email,
        subject: 'Forget Password Request!',
        template: 'resetPwd',
        context: {
          name: existingSupplier.name,
          buttonLink: link,
          buttonText: 'RESET',
        },
      });
      existingSupplier.forgetPwdToken = token;
      existingSupplier.forgetPwdExpires = new Date(
        Date.now() + 600000,
      ).toUTCString();
      await existingSupplier.save();
      return { message: SUCCESS_MSGS.MAIL_SENT };
    } catch (err) {
      return err;
    }
  }

  async reset(
    resetPassDetails: ResetPassDto,
    user: SupplierDocument,
    token: string,
  ) {
    try {
      let existingSupplier: SupplierDocument;
      if (!token) {
        existingSupplier = await this.suppModel.findOne({
          $and: [{ _id: user?.id }, { deleted: false }],
        });
      } else {
        existingSupplier = await this.suppModel.findOne({
          $and: [
            { forgetPwdToken: token },
            { forgetPwdExpires: { $gte: new Date() } },
            { deleted: false },
          ],
        });
      }
      if (!existingSupplier) {
        throw new BadRequestException(ERR_MSGS.LINK_EXPIRED);
      }
      if (resetPassDetails.newPass !== resetPassDetails.confirmPass) {
        throw new BadRequestException(ERR_MSGS.PWD_DONT_MATCH);
      }
      const hashedPwd = await hashPassword(resetPassDetails.newPass);
      existingSupplier.password = hashedPwd;
      existingSupplier.forgetPwdToken = null;
      existingSupplier.forgetPwdExpires = null;
      await existingSupplier.save();
      return { message: SUCCESS_MSGS.PWD_CHANGED };
    } catch (err) {
      return err;
    }
  }

  async logout(user: SupplierDocument, jwt: string) {
    try {
      const bbToken = new this.bbModel({ token: jwt, supplier: user.id });
      bbToken.save();
    } catch (err) {
      return err;
    }
  }

  async getToken(userId: string) {
    try {
      const existingToken = await this.bbModel.aggregate([
        { $match: { supplier: userId } },
        { $sort: { _id: -1 } },
      ]);
      return existingToken;
    } catch (err) {
      return err;
    }
  }

  async findAll() {
    try {
      const existingSuppliers = await this.suppModel.aggregate([
        { $match: { deleted: false } },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: 'supplier',
            as: 'products',
          },
        },
        // { $set:{'products.price.inr':}},
        {
          $project: {
            password: 0,
            role: 0,
            forgetPwdToken: 0,
            forgetPwdExpires: 0,
            deleted: 0,
            createdAt: 0,
            __v: 0,
            'products.deleted': 0,
            'products.__v': 0,
            'products.createdAt': 0,
            'products.updatedAt': 0,
          },
        },
      ]);
      if (!existingSuppliers) {
        throw new BadRequestException(ERR_MSGS.PRODUCT_NOT_FOUND);
      }
      return existingSuppliers;
    } catch (err) {
      return err;
    }
  }
}
