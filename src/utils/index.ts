import * as moment from 'moment';

import 'moment/locale/es';

export const expireTime = 60 * 60 * 24 * 30; // 30 days in seconds

export const expiresIn = () => {
  return Math.floor(Date.now() / 1000) + expireTime;
};

export const stringToDateWithTime = (date: string | Date) =>
  moment(date).format('LLL');

export const durantionToTime = (startDate: Date, endDate: Date) => {
  const duration = moment.duration(moment(endDate).diff(moment(startDate)));
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();
  return `${hours ? hours + 'h' : ''} ${minutes ? minutes + 'm' : ''} ${
    seconds ? seconds + 's' : ''
  }`;
};
