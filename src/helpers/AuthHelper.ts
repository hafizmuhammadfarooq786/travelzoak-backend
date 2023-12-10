import { Injectable } from '@nestjs/common';
@Injectable()
export class AuthHelper {
  generateAuthCode() {
    // Generate 6 digit random number that will not repeat
    const code = Math.floor(100000 + Math.random() * 900000);
    return code.toString();
  }

  getExpiresAtMillisAfter30Minutes() {
    const AUTH_CODE_EXPIRE_MINS = 30;
    const expiryTimestamp =
      new Date().getTime() + AUTH_CODE_EXPIRE_MINS * 60 * 1000;
    return BigInt(expiryTimestamp);
  }

  isTimestampExpired(expiresAtMillis): boolean {
    const currentMillis = BigInt(Date.now());
    return currentMillis > expiresAtMillis;
  }

  // Get expiry timestamp in milliseconds for given minutes
  getExpiresAtMillisForMinutes(minutes: number) {
    const expiryTimestamp = new Date().getTime() + minutes * 60 * 1000;
    return BigInt(expiryTimestamp);
  }
}
