import { MasterData } from "../main_interface";

export interface CvTemplatePDFInterface {
  id: string;
  users_id: number;
  template_website_id?: number;
  created_at: Date;
  updated_at: Date;
  created_by: null;
  updated_by: null;
  template_website?: MasterData;
}
