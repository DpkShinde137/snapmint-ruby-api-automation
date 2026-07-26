import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseClient } from './base.client.js';
import { ENV } from '../../utils/env.js';

export class MerchantsClient extends BaseClient {
  constructor(request: APIRequestContext, baseUrl: string = ENV.BASE_URL) {
    super(request, baseUrl);
  }

  /**
   * Fetches the status of an order.
   * @param orderId The unique identifier of the order.
   * @param authToken Optional bearer authorization token (without 'Bearer ' prefix).
   * @param headers Optional custom headers to override.
   */
  async getOrderStatus(
    orderId: string,
    authToken?: string,
    headers?: Record<string, string>
  ): Promise<APIResponse> {
    const requestHeaders: Record<string, string> = {};
    if (authToken) {
      requestHeaders['Authorization'] = `Bearer ${authToken}`;
    }

    return this.get(`/v1/merchants/orders/order_status?order_id=${orderId}`, {
      headers: {
        ...requestHeaders,
        ...headers,
      },
    });
  }
}
