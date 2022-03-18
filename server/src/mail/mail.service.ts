import { Inject, Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import * as FormData from 'form-data';
import { CONFIG_OPTIONS } from '../common/common.constants';
import { EmailVars, MailModuleOptions } from './mail.interfaces';

// const fetch = (url: RequestInfo, init?: RequestInit) =>
//   import('node-fetch').then(({ default: fetch }) => fetch(url, init));

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {}

  async sendEmail(
    subject: string,
    template: string,
    emailVars: EmailVars[],
  ): Promise<boolean> {
    const form = new FormData();
    form.append(
      'from',
      `Yuriy from Nuber Eats <mailgun@${this.options.domain}>`,
    );
    form.append('to', `yurikbv@yandex.com`);
    form.append('subject', subject);
    form.append('template', template);
    emailVars.forEach((eVar) => form.append(`v:${eVar.key}`, eVar.value));
    try {
      await fetch(
        `https://api.mailgun.net/v3/${this.options.domain}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(
              `api:${this.options.apiKey}`,
            ).toString('base64')}`,
          },
          body: form,
        },
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  async sendVerificationEmail(email: string, code: string) {
    await this.sendEmail('Verify Your Email', 'confirm-email', [
      { key: 'code', value: code },
      { key: 'username', value: email },
    ]);
  }
}
