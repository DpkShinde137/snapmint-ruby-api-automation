export interface UserLimitsResponse {
  status: string;
  message: string;
  eligible_limit: number;
  approved_limit: number;
  activate_limit: number;
  zero_dp_limit: number;
  available_limit: number;
  pl_max_limit: number;
  voucher_limit: number;
  product_limit: number;
  next_loan_allowed_value: number;
  next_loan_allowed_message: string;
  show_available_limit: boolean;
  show_approved_limit: boolean;
}

export interface UserLimitsErrorResponse {
  status: string;
  message: string;
}

export interface MaxMinLimitsResponse {
  status: string;
  message: string;
  id: number;
  eligibleLimit: number;
  availableLimit: number;
  available: boolean;
  zero_dp_limit: number;
  pay_later: number;
}
