import { Injectable } from '@nestjs/common';
import { hash, compare, genSalt } from 'bcrypt';
import { isString } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import { createCipheriv, createDecipheriv, scrypt } from 'crypto';
import { promisify } from 'util';

@Injectable()
export class HashService {
  constructor(private readonly jwtService: JwtService) {}

  // bcrypt
  async hashPassword(passwordString: string, salt: string): Promise<string> {
    return hash(passwordString, salt);
  }

  async randomSalt(): Promise<string> {
    // Env Variable
    const defaultPasswordSaltLength = Number(process.env.passwordSaltLength);

    return genSalt(defaultPasswordSaltLength);
  }

  async bcryptComparePassword(
    passwordString: string,
    passwordHashed: string,
  ): Promise<boolean> {
    const res: Promise<boolean> = compare(passwordString, passwordHashed);
    return res;
  }

  // Base64
  async encryptBase64(data: string): Promise<string> {
    const buff: Buffer = Buffer.from(data);
    return buff.toString('base64');
  }
  async decryptBase64(data: string): Promise<string> {
    const buff: Buffer = Buffer.from(data, 'base64');
    return buff.toString('utf8');
  }

  // jwt
  async jwtSign(
    payload: Record<string, any>,
    expiredIn: string,
  ): Promise<string> {
    return this.jwtService.sign(payload, {
      expiresIn: expiredIn,
    });
  }

  async jwtVerify(token: string): Promise<boolean> {
    // Env
    const authJwtTokenSecret = process.env.AUTH_JWTSECRETKEY;

    const payload: Record<string, any> = this.jwtService.verify(token, {
      secret: authJwtTokenSecret,
    });

    return payload ? true : false;
  }

  async jwtPayload(
    token: string,
    ignoreExpiration?: boolean,
  ): Promise<Record<string, any>> {
    // Env
    const authJwtTokenSecret = process.env.AUTH_JWTSECRETKEY;
    return this.jwtService.verify(token, {
      secret: authJwtTokenSecret,
      ignoreExpiration,
    });
  }

  // AES 256bit
  async encryptAES256Bit(
    data: string | Record<string, any> | Record<string, any>[],
    key: string,
    iv: string,
  ): Promise<string> {
    let dataParse: string = data as string;
    if (!isString(data)) {
      dataParse = JSON.stringify(data);
    }

    const crp = (await promisify(scrypt)(key, 'salt', 32)) as Buffer;
    const cipher = createCipheriv('aes-256-ctr', crp, iv);

    const encryptedText = Buffer.concat([
      cipher.update(dataParse),
      cipher.final(),
    ]);

    return encryptedText.toString('base64');
  }

  async decryptAES256Bit(
    encrypted: string,
    key: string,
    iv: string,
  ): Promise<string> {
    const data: Buffer = Buffer.from(encrypted, 'base64');
    const crp = (await promisify(scrypt)(key, 'salt', 32)) as Buffer;
    const decipher = createDecipheriv('aes-256-ctr', crp, iv);
    const decryptedText = Buffer.concat([
      decipher.update(data),
      decipher.final(),
    ]);

    return decryptedText.toString('utf8');
  }
}
