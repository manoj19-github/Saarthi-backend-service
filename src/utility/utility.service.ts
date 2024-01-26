import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, SendMailOptions } from 'nodemailer';

import * as bcrypt from 'bcrypt';
import { UsersDocument } from 'src/users/schemas/user.schema';
@Injectable()
export class UtilityService {
  constructor(private configService: ConfigService) {}
  async sendMailMethod(mailOptions: SendMailOptions): Promise<boolean> {
    const transporter = createTransport({
      host: 'smtp.gmail.com',
      secureConnection: false, // TLS requires secureConnection to be false
      port: 465,
      secure: true,
      auth: {
        user: this.configService.get('EMAIL_USERNAME'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
      tls: {
        rejectUnAuthorized: true,
      },
    });
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, _) => {
        console.log('error: ', error);
        if (error) return reject(false);
        return resolve(true);
      });
    });
  }
  async checkPassword(
    userDetails: UsersDocument,
    password: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, userDetails.password);
  }
}
