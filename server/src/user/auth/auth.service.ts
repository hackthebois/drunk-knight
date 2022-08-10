import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto, SignUpDto } from '../dtos/auth.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';

@Injectable()
export class AuthService {

    constructor(private readonly prismaService: PrismaService){}

    async signup({email, password, username}: SignUpDto){
      const userExists = await this.prismaService.user.findUnique({
          where: {
              email
          }
      });

      if(userExists) throw new ConflictException();

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.prismaService.user.create({
          data: {
              email: email,
              username: username,
              password: hashedPassword,
              user_type: UserType.DEFAULT
          }
      });

      return this.generateJWT(user.username, user.id);
    }

    async signin({ username, password }: SignInDto){
      const user = await this.prismaService.user.findUnique({
          where: {
            username,
          },
        });
    
        if (!user) throw new HttpException('Invalid credentials', 400);
    
        const hashedPassword = user.password;
    
        const isValidPassword = await bcrypt.compare(password, hashedPassword);
    
        if (!isValidPassword) throw new HttpException('Invalid credentials', 400);
    
        return this.generateJWT(user.username, user.id);
    }

    async getUserProfile(id: string) {
      return await this.prismaService.user.findUnique({
        where: {
          id
        }
      });
    }


    private generateJWT(name: string, id: string) {
      return jwt.sign(
        {
          name,
          id,
        },
        process.env.JSON_SECRET_KEY,
        {
          expiresIn: 3600000,
        },
      );
    }
}
