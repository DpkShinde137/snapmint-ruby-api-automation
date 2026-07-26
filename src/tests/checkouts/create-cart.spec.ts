import { test, expect, request } from '@playwright/test';
import { PublicClient } from '../../api/clients/public.client.js';
import { CartsClient } from '../../api/clients/carts.client.js';
import { ENV } from '../../utils/env.js';
import { DataGenerator } from '../../utils/data-generator.js';
import { CreateCartRequest, CreateCartResponse } from '../../api/payloads/carts.types.js';

test.describe('Snapmint backend - Create Cart API', () => {
  let publicClient: PublicClient;
  let cartsClient: CartsClient;
  let authToken: string;

  test.beforeAll(async () => {
    // Create an APIRequestContext that spans the entire suite
    const apiContext = await request.newContext();
    publicClient = new PublicClient(apiContext);
    cartsClient = new CartsClient(apiContext);

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

  test('should create a cart successfully with valid parameters @smoke @regression', async () => {
    const payload: CreateCartRequest = {
      merchant_confirmation_url: 'https://qa.snapmint.com/order-success',
      merchant_failure_url: 'https://qa.snapmint.com',
      udf2: 'web',
      full_name: DataGenerator.generateName(),
      email: DataGenerator.generateEmail(),
      mobile: DataGenerator.generateMobile(),
      origin: 'web',
      merchant_id: ENV.TEST_MERCHANT_ID,
      order_value: 1799,
      product_master_id: ENV.TEST_PRODUCT_MASTER_ID,
      promo_ids: [ENV.TEST_PROMO_ID],
    };

    const response = await cartsClient.createCart(payload, authToken);
    expect(response.status()).toBe(200);

    const body: CreateCartResponse = await response.json();
    expect(body.status).toBe('Success');
    expect(body.message).toBe('Cart created successfully');
    expect(body.cart_id).toBeDefined();
    expect(body.cart_auth_token).toBeDefined();
    expect(typeof body.cart_id).toBe('number');
    expect(typeof body.cart_auth_token).toBe('string');
  });

  test('should handle cart creation failure with invalid/expired token @regression', async () => {
    const payload: CreateCartRequest = {
      merchant_confirmation_url: 'https://qa.snapmint.com/order-success',
      merchant_failure_url: 'https://qa.snapmint.com',
      udf2: 'web',
      full_name: DataGenerator.generateName(),
      email: DataGenerator.generateEmail(),
      mobile: DataGenerator.generateMobile(),
      origin: 'web',
      merchant_id: ENV.TEST_MERCHANT_ID,
      order_value: 1799,
      product_master_id: ENV.TEST_PRODUCT_MASTER_ID,
      promo_ids: [ENV.TEST_PROMO_ID],
    };

    const response = await cartsClient.createCart(payload, 'INVALID_TOKEN_EXAMPLE');
    const status = response.status();

    if (status === 200) {
      const body = await response.json();
      expect(body.status).toBe('Error');
    } else {
      expect([401, 403]).toContain(status);
    }
  });

  test('should handle cart creation failure with invalid merchant ID @regression', async () => {
    const payload: CreateCartRequest = {
      merchant_confirmation_url: 'https://qa.snapmint.com/order-success',
      merchant_failure_url: 'https://qa.snapmint.com',
      udf2: 'web',
      full_name: DataGenerator.generateName(),
      email: DataGenerator.generateEmail(),
      mobile: DataGenerator.generateMobile(),
      origin: 'web',
      merchant_id: -1, // Invalid merchant ID
      order_value: 1799,
      product_master_id: ENV.TEST_PRODUCT_MASTER_ID,
      promo_ids: [ENV.TEST_PROMO_ID],
    };

    const response = await cartsClient.createCart(payload, authToken);
    const status = response.status();

    if (status === 200) {
      const body = await response.json();
      expect(body.status).toBe('Error');
    } else {
      expect([400, 422, 404, 500]).toContain(status);
    }
  });
});
