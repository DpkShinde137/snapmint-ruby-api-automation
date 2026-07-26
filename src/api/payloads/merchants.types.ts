export interface OrderStatusResponse {
  status: string;
  message: string;
  order_id?: string;
  transaction_status?: string;
  code?: string;
}
