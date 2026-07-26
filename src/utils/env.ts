import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables (fallback if not loaded by Playwright)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  BASE_URL: z.string().url().default('https://api.qa.snmt.link'),
  TEST_USER_MOBILE: z.string().min(10).max(10).default('8435678097'),
  TEST_USER_OTP: z.string().default('1010'),
  TEST_MERCHANT_ID: z.coerce.number().default(1423),
  TEST_PRODUCT_MASTER_ID: z.coerce.number().default(102422),
  TEST_PROMO_ID: z.string().default('019933ee-33c2-7799-b09f-547a07645597'),
  LOG_LEVEL: z.enum(['debug', 'info', 'error']).default('info'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment configuration:', parsed.error.format());
  throw new Error('Environment variable validation failed');
}

export const ENV = parsed.data;
