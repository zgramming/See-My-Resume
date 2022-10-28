import { Users } from "../main_interface";

export interface CVContactInterface {
  id: string;
  users_id: number;
  email_sender: string;
  subject_sender: string;
  content_sender: string;
  created_at: Date;
  updated_at: Date;
  created_by: null;
  updated_by: null;
  user: Users;
}
