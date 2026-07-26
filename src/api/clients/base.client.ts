import { APIRequestContext, APIResponse } from '@playwright/test';
import { ENV } from '../../utils/env.js';

export abstract class BaseClient {
  protected request: APIRequestContext;
  protected baseUrl: string;

  constructor(request: APIRequestContext, baseUrl: string) {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  /**
   * Utility to send POST requests with logging.
   */
  protected async post(
    endpoint: string,
    options: {
      data?: any;
      headers?: Record<string, string>;
    } = {}
  ): Promise<APIResponse> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    this.logRequest('POST', url, headers, options.data);

    const startTime = Date.now();
    const response = await this.request.post(url, {
      data: options.data,
      headers,
    });
    const duration = Date.now() - startTime;

    await this.logResponse(response, duration);

    return response;
  }

  /**
   * Utility to send GET requests with logging.
   */
  protected async get(
    endpoint: string,
    options: {
      headers?: Record<string, string>;
    } = {}
  ): Promise<APIResponse> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = options.headers || {};

    this.logRequest('GET', url, headers);

    const startTime = Date.now();
    const response = await this.request.get(url, {
      headers,
    });
    const duration = Date.now() - startTime;

    await this.logResponse(response, duration);

    return response;
  }

  private logRequest(method: string, url: string, headers: Record<string, string>, data?: any) {
    if (ENV.LOG_LEVEL === 'debug' || ENV.LOG_LEVEL === 'info') {
      console.log(`\n🚀 [API REQUEST] ${method} -> ${url}`);
      if (ENV.LOG_LEVEL === 'debug') {
        console.log(`Headers: ${JSON.stringify(headers, null, 2)}`);
      }
      if (data) {
        console.log(`Payload: ${JSON.stringify(data, null, 2)}`);
      }
    }
  }

  private async logResponse(response: APIResponse, durationMs: number) {
    if (ENV.LOG_LEVEL === 'debug' || ENV.LOG_LEVEL === 'info') {
      console.log(`📥 [API RESPONSE] ${response.status()} ${response.statusText()} (${durationMs}ms)`);
      if (ENV.LOG_LEVEL === 'debug') {
        console.log(`Headers: ${JSON.stringify(response.headers(), null, 2)}`);
      }
      try {
        const text = await response.text();
        if (text) {
          console.log(`Body: ${text}`);
        }
      } catch (e) {
        console.log(`[Response body could not be read: ${e}]`);
      }
    }
  }
}
