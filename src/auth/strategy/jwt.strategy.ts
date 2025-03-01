import { PassportStrategy } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AppConfigService } from 'src/app-config/app-config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userService: UserService,
    private readonly appConfigService: AppConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: appConfigService.getJwtSecret() || 'THIS_IS_SUPER_SECRET',
    });
  }

  async validate({ userId }: { userId: string }) {
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
