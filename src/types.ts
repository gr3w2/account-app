import { Request, Response } from 'express';
import { TransactionType } from './enum';

export interface TransactionEntity {
  id: string;
  type: TransactionType;
  amount: number;
  balance: number;
  effectiveDate: Date;
}

export interface ApplicationConfig {
  port: number;
}

// NOTICE: for detailed information about the config visit the page: https://www.npmjs.com/package/body-parser#options
export interface BodyParserConfig {
  inflate?: boolean;
  limit?: string;
  reviver?: any;
  strict?: boolean;
  type?: string | Array<string> | ((...args: Array<any>) => any);
  verify?: (req: Request, res: Response, buf: Buffer, encoding: string) => void;
}
