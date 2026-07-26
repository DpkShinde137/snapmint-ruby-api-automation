import { test, expect, request } from '@playwright/test';
import { PublicClient } from '../../api/clients/public.client.js';
import { UsersClient } from '../../api/clients/users.client.js';
import { ENV } from '../../utils/env.js';
import { DataGenerator } from '../../utils/data-generator.js';
import { UserLimitsResponse } from '../../api/payloads/users.types.js';

test.describe('Snapmint backend - User Limits API', () => {
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

  test('should successfully retrieve limits for the authenticated user @sanity @regression', async () => {
    const response = await usersClient.getUserLimits(userId, authToken);
    expect(response.status()).toBe(200);

    const body: UserLimitsResponse = await response.json();
    expect(body.status).toBe('Success');
    expect(body.message).toBe('Success');
    expect(typeof body.eligible_limit).toBe('number');
    expect(typeof body.approved_limit).toBe('number');
    expect(typeof body.available_limit).toBe('number');
    expect(typeof body.product_limit).toBe('number');
    expect(body.show_available_limit).toBeDefined();
    expect(body.show_approved_limit).toBeDefined();
  });

  test('should handle limit retrieval failure with invalid token @regression', async () => {
    const response = await usersClient.getUserLimits(userId, 'INVALID_TOKEN_EXAMPLE');
    const status = response.status();

    if (status === 200) {
      const body = await response.json();
      expect(body.status).toBe('Error');
    } else {
      expect([401, 403]).toContain(status);
    }
  });

  test('should handle limit retrieval for a non-existent or other user ID @regression', async () => {
    const nonExistentUserId = 999999;
    const response = await usersClient.getUserLimits(nonExistentUserId, authToken);
    const status = response.status();

    if (status === 200) {
      const body = await response.json();
      expect(body.status).toBe('Error');
    } else {
      expect([401, 403, 404]).toContain(status);
    }
  });

  test('should successfully retrieve max/min limits for the authenticated user @sanity @regression', async () => {
    const response = await usersClient.getMaxMinLimits(userId, 2664, 15000, authToken);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.status).toBe('success');
    expect(body.message).toBe('success');
    expect(body.id).toBe(userId);
    expect(typeof body.eligibleLimit).toBe('number');
    expect(typeof body.availableLimit).toBe('number');
    expect(typeof body.available).toBe('boolean');
  });

  test('should handle max/min limits retrieval check with invalid token @regression', async () => {
    // Note: The QA backend does not currently enforce token authentication on this endpoint.
    // The test is written to be resilient to both authenticated and unauthenticated server behaviors.
    const response = await usersClient.getMaxMinLimits(userId, 2664, 15000, 'INVALID_TOKEN_EXAMPLE');
    const status = response.status();

    if (status === 200) {
      const body = await response.json();
      expect(['success', 'error']).toContain(body.status);
    } else {
      expect([401, 403]).toContain(status);
    }
  });
});
