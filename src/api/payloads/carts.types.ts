export interface CreateCartRequest {
  merchant_confirmation_url: string;
  merchant_failure_url: string;
  udf2: string;
  full_name: string;
  email: string;
  mobile: string;
  origin: string;
  merchant_id: number;
  order_value: number;
  product_master_id: number;
  promo_ids: string[];
}

export interface CreateCartResponse {
  message: string;
  status: string;
  cart_id?: number;
  cart_auth_token?: string;
  email?: string;
  is_editable?: boolean;
}

export interface CartErrorResponse {
  status: string;
  message: string;
  errors?: Record<string, string[]>;
}
