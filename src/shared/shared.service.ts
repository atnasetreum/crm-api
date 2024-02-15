import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as moment from 'moment';
import * as CryptoJS from 'crypto-js';

import 'moment/locale/es';

@Injectable()
export class SharedService {
  expireTime = 60 * 60 * 24 * 30; // 30 days in seconds

  constructor(private readonly configService: ConfigService) {}

  expiresIn() {
    return Math.floor(Date.now() / 1000) + this.expireTime;
  }

  stringToDateWithTime(date: string | Date) {
    return moment(date).format('LLL');
  }

  durantionToTime(startDate: Date, endDate: Date) {
    const duration = moment.duration(moment(endDate).diff(moment(startDate)));
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();
    return `${hours ? hours + 'h' : ''} ${minutes ? minutes + 'm' : ''} ${
      seconds ? seconds + 's' : ''
    }`;
  }

  decryptPassword(ciphertext: string) {
    const cryptoSecretKey = this.configService.get('crypto.secretKey');
    const bytes = CryptoJS.AES.decrypt(ciphertext, cryptoSecretKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  }
}
