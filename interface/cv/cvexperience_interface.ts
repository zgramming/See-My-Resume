import { Users } from "../main_interface";

export interface CVExperienceInterface {
  id: string;
  users_id: number;
  company: string;
  job: string;
  start_date: Date;
  end_date: Date;
  description: string;
  image_company?: string;
  is_graduated: boolean;
  tags?: string;
  created_at: Date;
  updated_at: Date;
  created_by: any;
  updated_by: any;
  user: Users;
}
