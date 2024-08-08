import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jswService:JwtService){}
  canActivate(context: ExecutionContext): Promise<boolean> {
    return 
  }
}
