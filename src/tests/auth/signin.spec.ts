import { test, expect } from '@playwright/test';
import { PublicClient } from '../../api/clients/public.client.js';
import { ENV } from '../../utils/env.js';
import { SigninResponse } from '../../api/payloads/auth.types.js';
import { DataGenerator } from '../../utils/data-generator.js';

test.describe('Snapmint backend - User Signin API', () => {
  let publicClient: PublicClient;

  test.beforeEach(({ request }) => {
    publicClient = new PublicClient(request);
  });

  test('should sign in successfully with valid mobile and OTP @smoke @sanity @regression', async () => {
    const payload = {
      mobile: ENV.TEST_USER_MOBILE,
      otp: ENV.TEST_USER_OTP,
      type: 'user',
      origin: 'web',
      from: 'otp',
    };

    const response = await publicClient.signin(payload);
    expect(response.status()).toBe(200);

    const body: SigninResponse = await response.json();
    expect(body.status).toBe('Success');
    expect(body.message).toBe('Signed In Successfully');
    expect(body.user_id).toBeDefined();
    expect(body.auth_token).toBeDefined();
    expect(typeof body.auth_token).toBe('string');
    expect(body.language_details).toBeDefined();
    expect(body.language_details?.key).toBe('common.signin_success');
  });

  test('should handle sign-in failure with invalid OTP @regression', async () => {
    const payload = {
      mobile: DataGenerator.generateMobile(), // Using random mobile to avoid blocking main test user
      otp: '9999', // Invalid OTP
      type: 'user',
      origin: 'web',
      from: 'otp',
    };

    const response = await publicClient.signin(payload);
    const status = response.status();

    if (status === 200) {
      const body = await response.json();
      expect(body.status).toBe('Error');
      expect(body.message).toBeDefined();
    } else {
      expect([400, 401]).toContain(status);
    }
  });

  test('should handle sign-in failure with malformed mobile number @regression', async () => {
    const payload = {
      mobile: '9999', // Malformed mobile number
      otp: ENV.TEST_USER_OTP,
      type: 'user',
      origin: 'web',
      from: 'otp',
    };

    const response = await publicClient.signin(payload);
    const status = response.status();

    if (status === 200) {
      const body = await response.json();
      expect(body.status).toBe('Error');
    } else {
      expect([400, 422]).toContain(status);
    }
  });
});
