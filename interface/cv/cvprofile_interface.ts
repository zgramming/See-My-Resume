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
  address?: string;
  image?: string;
  created_at: Date;
  updated_at: Date;
  created_by?: any;
  updated_by?: any;
  user: Users;
}
