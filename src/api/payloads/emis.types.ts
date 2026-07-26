export interface EmiDate {
  day: string;
  date: number;
  month: string;
}

export interface EmiCashback {
  amount: string;
  status: string;
}

export interface EmiDetails {
  id: number;
  loan_application_id: number;
  emi_date: EmiDate;
  status: string;
  is_paylater: boolean;
  created_at: string;
  received_date: string | null;
  tag: string | null;
  title: string;
  payment_initiated: boolean | null;
  late_fee: number | null;
  emi_number: number;
  tp_message: string;
  allow_emi_payment: boolean;
  auto_pay: boolean;
  description: string | null;
  paid_emis_count: number;
  total_emi_number: number;
  promo_status_data: any[];
  emi_amount: number;
  total_penalty_fee: number;
  is_latefee_receivable: boolean;
  penalty_tooltip_text: string[];
  cashback?: EmiCashback;
}

export interface EmiMonthGroup {
  month: string;
  total_amount: number;
  emis: EmiDetails[];
}

export interface EmiListResponse {
  status: string;
  message: string;
  emi_list: EmiMonthGroup[];
}

export interface EmiListErrorResponse {
  status: string;
  message: string;
  data?: any;
}
