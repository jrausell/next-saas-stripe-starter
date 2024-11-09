// lib/types/x-users.ts
export type XUser = {
  id: bigint;
  x_id?: string | null;
  rest_id?: string | null;
  screen_name?: string | null;
  name?: string | null;
  description?: string | null;
  location?: string | null;
  created_at: Date;
  is_blue_verified: boolean;
  profile_image_shape?: string | null;
  profile_image_url?: string | null;
  profile_banner_url?: string | null;
  is_professional: boolean;
  professional_rest_id?: string | null;
  professional_type?: string | null;
  updated_at: Date;
  stats?: {
    followers_count?: number;
    following_count?: number;
    tweets_count?: number;
  }[];
};

export type XUserFilters = {
  search?: string;
  isVerified?: boolean;
  isProfessional?: boolean;
  minFollowers?: number;
  orderBy?: "followers" | "tweets" | "updated";
  orderDir?: "asc" | "desc";
  limit?: number;
  cursor?: bigint;
};
