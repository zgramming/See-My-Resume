import { Users } from "../main_interface";

export interface CVEducationInterface {
  id: string;
  users_id: number;
  name: string;
  major: string;
  field_of_study: string;
  start_date: Date;
  end_date?: Date;
  is_graduated: boolean;
  image?: string;
  created_at: Date;
  updated_at: Date;
  created_by: any;
  updated_by: any;
  user: Users;
}
