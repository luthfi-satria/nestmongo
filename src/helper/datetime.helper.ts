import { Injectable } from '@nestjs/common';

@Injectable()
export class DatetimeHelper {
  static CurrentDateTime(type = 'UTC') {
    let date = '';
    switch (type) {
      case 'ISO':
        date = new Date().toISOString(); // return 2019-11-14T00:55:31.820Z
        break;
      default:
        date = new Date().toUTCString(); // return Thu, 14 Nov 2019 00:55:16 GMT
        break;
    }
    return date;
  }
}
