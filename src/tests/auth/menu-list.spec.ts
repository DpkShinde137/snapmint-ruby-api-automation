import { test, expect, request } from '@playwright/test';
import { PublicClient } from '../../api/clients/public.client.js';
import { ENV } from '../../utils/env.js';
import { MenuListResponse } from '../../api/payloads/public.types.js';

test.describe('Snapmint backend - Public Menu List API', () => {
  let publicClient: PublicClient;
  let authToken: string;

  test.beforeAll(async () => {
    const apiContext = await request.newContext();
    publicClient = new PublicClient(apiContext);

    // Sign in to retrieve auth token
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
    authToken = body.auth_token;
  });

  test('should successfully retrieve menu list @smoke @sanity @regression', async () => {
    const response = await publicClient.getMenuList('web', authToken);
    expect(response.status()).toBe(200);

    const body: MenuListResponse = await response.json();
    expect(body.menu_item_list).toBeDefined();
    expect(Array.isArray(body.menu_item_list)).toBe(true);

    if (body.menu_item_list.length > 0) {
      const firstItem = body.menu_item_list[0];
      expect(firstItem.keyword).toBeDefined();
      expect(firstItem.name).toBeDefined();
      expect(firstItem.url).toBeDefined();
      expect(firstItem.show_on_hamburger).toBeDefined();
    }
  });

  test('should retrieve menu list with other platforms @regression', async () => {
    const response = await publicClient.getMenuList('android', authToken);
    expect(response.status()).toBe(200);

    const body: MenuListResponse = await response.json();
    expect(body.menu_item_list).toBeDefined();
    expect(Array.isArray(body.menu_item_list)).toBe(true);
  });
});
