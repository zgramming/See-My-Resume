import { Users } from "../main_interface";

export interface CVProfileInterface {
  id: string;
  users_id: number;
  name: string;
  motto: string;
  description?: string;
  phone?: string;
  email?: string;
  web?: string;
  twitter?: string;
  facebook?: string;
  linkedIn?: string;
  github?: string;
  instagram?: string;
  address?: string;
  image?: string;
  banner_image?: string;
  latest_resume?: string;
  created_at: Date;
  updated_at: Date;
  created_by?: any;
  updated_by?: any;
  user: Users;
}
