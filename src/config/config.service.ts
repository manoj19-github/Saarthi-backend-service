import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as dotEnv from 'dotenv';
export interface EnvConfig {
  [key: string]: string;
}

@Injectable()
export class Config {
  constructor(filePath: string) {
    let file: Buffer | undefined;
    try {
      file = fs.readFileSync(filePath);
    } catch (error) {
      file = fs.readFileSync('development.env');
    }

    // const config = do
  }
}
