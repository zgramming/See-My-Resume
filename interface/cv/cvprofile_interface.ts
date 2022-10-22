import { Users } from "../main_interface";

export interface CVProfileInterface {
  id: string;
  users_id: number;
  name: string;
  motto: string;
  description: null;
  phone: null;
  email: null;
  web: null;
  address: null;
  image: null;
  created_at: Date;
  updated_at: Date;
  created_by: null;
  updated_by: null;
  user: Users;
}
