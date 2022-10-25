import { MasterData, Users } from "../main_interface";

export interface CVSkillInterface {
  id: string;
  users_id: number;
  name: string;
  level_id: number;
  created_at: Date;
  updated_at: Date;
  created_by: any;
  updated_by: any;
  user: Users;
  level: MasterData;
}
