import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';

import { LoginResponse } from './interfaces/login-response';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) 
      private userModel: Model<User>,
      private jwtService: JwtService,
    ) {}


  async create(createUserDto: CreateUserDto): Promise<User>{    
    try{
      //desestructurar el createUserDto
      const {password, ...userData} = createUserDto;
      //encriptar contraseña
      const newUser = new this.userModel({
        password: bcryptjs.hashSync(password, 10),
        ...userData
      });
      await newUser.save();

      //quitamos el password para que no se envie y dejamos en el userentity como =password?
      const {password:_, ...user} = newUser.toJSON();

      return user;
    }catch (error){
      if(error.code === 11000){
        throw new BadRequestException(`${createUserDto.email} already exist `);
      }
      console.error('Error in create method:', error); // Agrega este registro de error
      throw new InternalServerErrorException('something terrible happen')
    }
  }

  async register(registerDto:RegisterDto): Promise<LoginResponse>{
      
    const user = await this.create(registerDto);
    console.log(user)
      return{
        user: user,
        token: this.getJWT({id: user._id})
      }
      
  }

  async login(loginDto:LoginDto): Promise<LoginResponse>{
    const {email,password} = loginDto;

    const user = await this.userModel.findOne({email})
      if(!user){
        throw new UnauthorizedException('Not valid credentials');
      }

      if(!bcryptjs.compareSync(password, user.password)){
        throw new UnauthorizedException('Not valid credentials');
      }

      const {password:_,...rest} = user.toJSON()
      return {
        user: rest,
        token: this.getJWT({id: user.id})
      }
  }

  findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, createUserDto: CreateUserDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  getJWT(payload:JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;
  }
}
