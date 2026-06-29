export interface Business {
  id: string;
  slug: string;
  name: string;
  cuisine?: string;
  location?: string;
  owner_email?: string;
  health_score?: number;
}

export interface Review {
  id: string;
  source: string;
  author_name: string;
  content: string;
  rating: number;
  owner_approved_reply?: boolean;
  final_reply_content?: string;
  created_at?: string;
  [key: string]: any;
}

export interface Insight {
  id: string;
  content: string;
  category?: string;
  [key: string]: any;
}

export interface Campaign {
  id: string;
  name: string;
  status: string;
  [key: string]: any;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  [key: string]: any;
}

export interface Competitor {
  id: string;
  name: string;
  [key: string]: any;
}
