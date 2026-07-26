import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseClient } from './base.client.js';
import { ENV } from '../../utils/env.js';

export class UsersClient extends BaseClient {
  constructor(request: APIRequestContext, baseUrl: string = ENV.BASE_URL) {
    super(request, baseUrl);
  }

  /**
   * Retrieves limits for a specific user.
   * @param userId The ID of the user.
   * @param authToken The authorization token (without 'Bearer ' prefix).
   * @param headers Optional custom headers.
   */
  async getUserLimits(
    userId: number | string,
    authToken: string,
    headers?: Record<string, string>
  ): Promise<APIResponse> {
    const requestHeaders = {
      'Authorization': `Bearer ${authToken}`,
      ...headers,
    };

    return this.get(`/v2/users/${userId}/user_limits`, {
      headers: requestHeaders,
    });
  }

  /**
   * Retrieves the EMI list for a specific user.
   * @param userId The ID of the user.
   * @param tab The EMI tab (e.g. 'paid_emi', 'unpaid_emi').
   * @param authToken The authorization token (without 'Bearer ' prefix).
   * @param headers Optional custom headers.
   */
  async getEmiList(
    userId: number | string,
    tab: string,
    authToken: string,
    headers?: Record<string, string>
  ): Promise<APIResponse> {
    const defaultHeaders = {
      'accept': 'application/json, text/plain, */*',
      'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
      'authorization': `Bearer ${authToken}`,
      'origin': this.baseUrl,
      'referer': `${this.baseUrl}/`,
      'x-session-id': 'jlz6_CNBPGunuqOhb56FZ',
      ...headers,
    };

    return this.get(`/v3/users/${userId}/get_emi_list_v2?tab=${tab}`, {
      headers: defaultHeaders,
    });
  }

  /**
   * Retrieves min/max limits for a specific user.
   * @param userId The ID of the user.
   * @param merchantId The merchant ID.
   * @param orderValue The value of the order.
   * @param authToken The authorization token (without 'Bearer ' prefix).
   * @param headers Optional custom headers.
   */
  async getMaxMinLimits(
    userId: number | string,
    merchantId: number | string,
    orderValue: number | string,
    authToken: string,
    headers?: Record<string, string>
  ): Promise<APIResponse> {
    const requestHeaders = {
      'Authorization': `Bearer ${authToken}`,
      'Accept': 'application/json, text/plain, */*',
      ...headers,
    };

    return this.get(`/gateway/v1/users/get_max_min_limits?merchant_id=${merchantId}&order_value=${orderValue}&id=${userId}`, {
      headers: requestHeaders,
    });
  }
}
