import { BadRequestException, ConflictException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto, SignUpDto } from '../dtos/auth.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';
import * as nodemailer from "nodemailer";
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';


const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});


interface JWTPayload {
  name: string;
  iat: number;
  exp: number;
}

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

      this.sendEmailConfirmation(email);

      return this.generateJWT(user.username, user.id);
    }

    async signin({ username, password }: SignInDto){
      const user = await this.prismaService.user.findUnique({
          where: {
            username,
          },
        });
    
        if (!user) throw new HttpException('Invalid credentials', 400);

        if(!user.email_confirmation) throw new BadRequestException("Please Confirm Email Before Attemping to Log In");
    
        const hashedPassword = user.password;
    
        const isValidPassword = await bcrypt.compare(password, hashedPassword);
    
        if (!isValidPassword) throw new HttpException('Invalid credentials', 400);
    
        return this.generateJWT(user.username, user.id);
    }

    private async getUserProfile(id: string) {
      return await this.prismaService.user.findUnique({
        where: {
          id
        }
      });
    }

    async verifyEmailConfirmation(token: string){
      try{
        const payload = jwt.verify(token, process.env.JSON_EMAIL_SECRET_KEY) as JWTPayload;

        const user = await this.prismaService.user.findUnique({
          where:{
            email: payload.name
          }
        });

        if(user.email_confirmation) return "Already Confirmed Email";

        await this.prismaService.user.update({
          where: {
            email: payload.name,
          },
          data : {
            email_confirmation: true
          }
        });
      }catch (error) {
        return "Unsuccessfull Confirmation :("
      }

      return "Successfull Confirmation :)"
    }

    private async sendEmailConfirmation(email: string) {

      const url = `http://localhost:8000/auth/confirm/${this.generateEmailJWT(email)}`
      const filePath = path.join(__dirname, '..', '..', '..', 'src/user/html/email.html');
      const source = fs.readFileSync(filePath, 'utf-8').toString();
      const template = handlebars.compile(source);
      const replacements = {
        email: email,
        url: url
      };
      const htmlToSend = template(replacements);

      await transport.sendMail({
      from:'"Drunk Knight" <drunk.knight.official@gmail.com>',
      to: email,
      subject:"Email Confirmation",
      html: htmlToSend,
      });
    }

    private generateEmailJWT(email: string){
      return jwt.sign(
        {
          name: email
        },
        process.env.JSON_EMAIL_SECRET_KEY,
        {
          expiresIn: 900
        }
      );
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
