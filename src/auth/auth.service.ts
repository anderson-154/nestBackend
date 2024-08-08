import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) 
      private userModel: Model<User>,) {}


  async create(createUserDto: CreateUserDto): Promise<User>{    
    try{
      const newUser = new this.userModel(createUserDto);

      //encrptar
      //guardar user
      //generar Json WebToken

      return await newUser.save()
    }catch (error){
      if(error.code === 11000){
        throw new BadRequestException(`${createUserDto.email} already exist `);
      }
      throw new InternalServerErrorException('something terrinle happen')
    }
  }

  findAll() {
    return `This action returns all auth`;
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
}
