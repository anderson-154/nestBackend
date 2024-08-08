import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService:JwtService,
    private authService:AuthService
  ){}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('There is no berer token');
    }
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        token,
        { secret: process.env.JWT_SEED }
      );
      console.log({payload})

      const user = await this.authService.findUserById(payload.id);
      if(!user) throw new UnauthorizedException('User is no active')
      if(!user.isActive) throw new UnauthorizedException('User is no active')
      request['user'] = user;


    } catch (error) {
      throw new UnauthorizedException();
    }

    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

