import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseClient } from './base.client.js';
import { CreateCartRequest } from '../payloads/carts.types.js';
import { ENV } from '../../utils/env.js';

export class CartsClient extends BaseClient {
  constructor(request: APIRequestContext, baseUrl: string = ENV.BASE_URL) {
    super(request, baseUrl);
  }

  /**
   * Creates a cart.
   * @param payload Request body containing merchant urls, customer details, merchant_id, etc.
   * @param authToken Optional Authorization Token (without 'Bearer ' prefix).
   * @param headers Optional custom headers.
   */
  async createCart(
    payload: CreateCartRequest,
    authToken?: string,
    headers?: Record<string, string>
  ): Promise<APIResponse> {
    const defaultHeaders: Record<string, string> = {};
    if (authToken) {
      defaultHeaders['Authorization'] = `Bearer ${authToken}`;
    }

    const finalHeaders = {
      ...defaultHeaders,
      ...headers,
    };

    return this.post('/v1/carts/create_cart', {
      data: payload,
      headers: finalHeaders,
    });
  }
}
