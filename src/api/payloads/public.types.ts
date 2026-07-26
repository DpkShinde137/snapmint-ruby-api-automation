export interface MenuItem {
  keyword: string;
  name: string;
  url: string;
  web_view_url: string;
  menu_key: string;
  login_required: boolean;
  is_webview: boolean;
  device_login_required: boolean;
  is_new: boolean;
  original_image: string | null;
  small_menu_image: string | null;
  show_on_homepage: boolean;
  show_on_hamburger: boolean;
  homepage_popularity: number;
  sub_categories?: any[];
}

export interface MenuListResponse {
  status: string;
  message: string;
  show_on_hamburger?: boolean;
  menu_item_list: MenuItem[];
  refresh_time?: number;
}
