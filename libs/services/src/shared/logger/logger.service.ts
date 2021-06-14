import { appendFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { Injectable, Scope, Logger as NestLogger } from '@nestjs/common';
import * as changeCase from 'change-case';

@Injectable({ scope: Scope.TRANSIENT })
export class Logger extends NestLogger {
  private readonly logsFolderPath: string = '.logs';
  private paramCasedCtx: string;

  constructor(private readonly ctx: string) {
    super(ctx);

    this.paramCasedCtx = ctx ? changeCase.paramCase(ctx) : '';

    if (!existsSync(this.logsFolderPath)) {
      mkdirSync(this.logsFolderPath);
    }
  }

  logAppend(message: string) {
    appendFileSync(`${this.logsFolderPath}/${this.paramCasedCtx}.log`, `${message}\n`);
  }

  logJson(json: any, fileName: string) {
    if (!existsSync(`${this.logsFolderPath}/${this.paramCasedCtx}`)) {
      mkdirSync(`${this.logsFolderPath}/${this.paramCasedCtx}`);
    }

    writeFileSync(`${this.logsFolderPath}/${this.paramCasedCtx}/${fileName}.json`, JSON.stringify(json), 'utf-8');
  }
}
