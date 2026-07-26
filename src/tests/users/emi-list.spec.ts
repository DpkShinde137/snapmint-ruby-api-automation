import { test, expect, request } from '@playwright/test';
import { PublicClient } from '../../api/clients/public.client.js';
import { UsersClient } from '../../api/clients/users.client.js';
import { ENV } from '../../utils/env.js';
import { EmiListResponse } from '../../api/payloads/emis.types.js';

test.describe('Snapmint backend - EMI List API', () => {
  let publicClient: PublicClient;
  let usersClient: UsersClient;
  let authToken: string;
  let userId: number;

  test.beforeAll(async () => {
    const apiContext = await request.newContext();
    publicClient = new PublicClient(apiContext);
    usersClient = new UsersClient(apiContext);

    // Sign in to retrieve auth token and user ID dynamically
    const signinResponse = await publicClient.signin({
      mobile: ENV.TEST_USER_MOBILE,
      otp: ENV.TEST_USER_OTP,
      type: 'user',
      origin: 'web',
      from: 'otp',
    });

    expect(signinResponse.status()).toBe(200);
    const body = await signinResponse.json();
    expect(body.status).toBe('Success');
    expect(body.auth_token).toBeDefined();
    expect(body.user_id).toBeDefined();

    authToken = body.auth_token;
    userId = body.user_id;
  });

  test('should successfully retrieve paid EMI list for the authenticated user @regression', async () => {
    const response = await usersClient.getEmiList(userId, 'paid_emi', authToken);
    expect(response.status()).toBe(200);

    const body: EmiListResponse = await response.json();
    expect(body.status).toBe('Success');
    expect(body.message).toBe('Success');
    expect(body.emi_list).toBeDefined();
    expect(Array.isArray(body.emi_list)).toBe(true);

    // If there are EMIs in the list, validate their structure
    if (body.emi_list.length > 0) {
      const firstMonth = body.emi_list[0];
      expect(firstMonth.month).toBeDefined();
      expect(typeof firstMonth.total_amount).toBe('number');
      expect(Array.isArray(firstMonth.emis)).toBe(true);

      if (firstMonth.emis.length > 0) {
        const firstEmi = firstMonth.emis[0];
        expect(firstEmi.id).toBeDefined();
        expect(firstEmi.loan_application_id).toBeDefined();
        expect(firstEmi.status).toBeDefined();
        expect(firstEmi.title).toBeDefined();
        expect(typeof firstEmi.emi_amount).toBe('number');
        expect(firstEmi.emi_date).toBeDefined();
      }
    }
  });

  test('should successfully retrieve other EMI tabs (e.g. unpaid_emi) @regression', async () => {
    const response = await usersClient.getEmiList(userId, 'unpaid_emi', authToken);
    expect(response.status()).toBe(200);

    const body: EmiListResponse = await response.json();
    expect(body.status).toBe('Success');
    expect(body.emi_list).toBeDefined();
  });

  test('should handle EMI list retrieval failure with invalid token @regression', async () => {
    const response = await usersClient.getEmiList(userId, 'paid_emi', 'INVALID_TOKEN_EXAMPLE');
    const status = response.status();

    if (status === 200) {
      const body = await response.json();
      expect(body.status).toBe('Error');
    } else {
      expect([401, 403]).toContain(status);
    }
  });

  test('should handle EMI list retrieval for a non-existent or other user ID @regression', async () => {
    const nonExistentUserId = 999999;
    const response = await usersClient.getEmiList(nonExistentUserId, 'paid_emi', authToken);
    const status = response.status();

    if (status === 200) {
      const body = await response.json();
      expect(body.status).toBe('Error');
    } else {
      expect([401, 403, 404]).toContain(status);
    }
  });
});
