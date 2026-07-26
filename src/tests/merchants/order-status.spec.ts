import { test, expect } from '@playwright/test';
import { MerchantsClient } from '../../api/clients/merchants.client.js';

test.describe('Snapmint backend - Merchant Order Status API', () => {
  let merchantsClient: MerchantsClient;

  test.beforeEach(({ request }) => {
    merchantsClient = new MerchantsClient(request);
  });

  test('should handle order status retrieval failure with invalid token @regression', async () => {
    const response = await merchantsClient.getOrderStatus('nlladdsdfdfbdd_nddoddde7', 'INVALID_TOKEN_EXAMPLE');
    const status = response.status();

    if (status === 200) {
      const body = await response.json();
      expect(body.status).toBe('Error');
    } else {
      expect(status).toBe(401);
      const body = await response.json();
      expect(body.status).toBe('Error');
      expect(body.message).toBe('Unauthorized request');
      expect(body.code).toBe('SNM0001');
    }
  });

  test('should return unauthorized for order status check without token @regression', async () => {
    const response = await merchantsClient.getOrderStatus('nlladdsdfdfbdd_nddoddde7');
    expect(response.status()).toBe(401);
    
    const body = await response.json();
    expect(body.status).toBe('Error');
    expect(body.message).toBe('Unauthorized request');
  });
});
