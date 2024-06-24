import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class HelpersService {
  hashEmail(email: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(email);
    return hash.digest('hex');
  }

  // Generate UUID
  generateUniqueId(): string {
    return uuidv4(process.env.UUID_NAMESPACE);
  }

  // get current timestamp in milliseconds
  getCurrentTimestampInMilliseconds() {
    return BigInt(Date.now());
  }

  isEmptyObject(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }

  findNonUniqueName(names) {
    const nameCount = {};
    for (const name of names) {
      nameCount[name] = (nameCount[name] || 0) + 1;
    }

    const nonUniqueName = Object.keys(nameCount).find(
      (name) => nameCount[name] > 1,
    );

    return nonUniqueName || null; // Return null if all names are unique
  }

  slugify(str) {
    str = str.replace(/^\s+|\s+$/g, '');
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    const from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;';
    const to = 'aaaaeeeeiiiioooouuuunc------';
    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str
      .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes

    return str;
  }

  convertTimestampToDate(timestamp: number | string | bigint): string {
    const date = new Date(Number(timestamp));
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day <= 9 ? `0${day}` : day}-${
      month <= 9 ? `0${month}` : month
    }-${year}`;
  }
}
