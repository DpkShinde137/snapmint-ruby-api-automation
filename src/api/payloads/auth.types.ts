export interface SigninRequest {
  mobile: string;
  otp: string;
  type: string;
  origin: string;
  from: string;
}

export interface LanguageDetails {
  key: string;
}

export interface SigninResponse {
  status: string;
  message: string;
  language_details?: LanguageDetails;
  user_id?: number;
  auth_token?: string;
  is_fin_required?: boolean;
  app_config_hours?: string;
}

export interface AuthErrorResponse {
  status: string;
  message: string;
  errors?: Record<string, string[]>;
}
