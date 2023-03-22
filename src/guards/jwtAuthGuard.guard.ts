import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { ERR_MSGS } from 'src/utils/consts';
import { SuppliersService } from 'src/web/suppliers/suppliers.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private supplierService: SuppliersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    const gettingAssignedToken = req.rawHeaders[1].split(' ');
    const assignedToken = gettingAssignedToken[1];

    const decoded = this.jwtService.decode(assignedToken);

    req.user = decoded;

    const bbToken = await this.supplierService.getToken(req?.user?.id);

    if (decoded && bbToken && assignedToken === bbToken.token) {
      throw new UnauthorizedException(ERR_MSGS.SESSION_EXPIRED);
    }
    return true;
  }
}
