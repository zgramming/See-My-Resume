import { Users } from "../main_interface";
import { CVPortfolioUrlInterface } from "./cvportfolio_url_interface";

export interface CVPortfolioInterface {
  id: string;
  users_id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail?: string;
  tags?: string;
  created_at: Date;
  updated_at: Date;
  created_by: any;
  updated_by: any;
  user: Users;
  urls: CVPortfolioUrlInterface[];
}
