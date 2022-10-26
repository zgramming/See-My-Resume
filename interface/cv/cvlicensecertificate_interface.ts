import { Users } from "../main_interface";

export interface CVLicenseCertificateInterface {
  id: string;
  users_id: number;
  name: string;
  publisher: string;
  start_date: Date;
  end_date: Date;
  is_expired: boolean;
  url?: string;
  file?: string;
  credential?: string;
  created_at: Date;
  updated_at: Date;
  created_by: any;
  updated_by: any;
  user: Users;
}
