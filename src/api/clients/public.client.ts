import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseClient } from './base.client.js';
import { SigninRequest } from '../payloads/auth.types.js';
import { ENV } from '../../utils/env.js';

export class PublicClient extends BaseClient {
  constructor(request: APIRequestContext, baseUrl: string = ENV.BASE_URL) {
    super(request, baseUrl);
  }

  /**
   * Performs User Signin.
   * @param payload Request body containing mobile, otp, type, origin, from.
   * @param headers Optional custom headers to override defaults.
   */
  async signin(payload: SigninRequest, headers?: Record<string, string>): Promise<APIResponse> {
    const defaultHeaders = {
      'accept': 'application/json, text/plain, */*',
      'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
      'origin': 'https://qa.snapmint.com',
      'referer': 'https://qa.snapmint.com/',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
      ...headers,
    };

    return this.post('/v2/logins/signin', {
      data: payload,
      headers: defaultHeaders,
    });
  }

  /**
   * Retrieves the public menu list.
   * @param origin The origin platform (e.g. 'web').
   * @param authToken Optional authorization token.
   * @param headers Optional custom headers to override.
   */
  async getMenuList(
    origin: string = 'web',
    authToken?: string,
    headers?: Record<string, string>
  ): Promise<APIResponse> {
    const defaultHeaders = {
      'Accept': 'application/json, text/plain, */*',
      'X-Session-ID': 'c1RAcVio039cTzSgvBnD9',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',
      ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
      ...headers,
    };

    return this.get(`/v2/public/get_menu_list?origin=${origin}`, {
      headers: defaultHeaders,
    });
  }
}
