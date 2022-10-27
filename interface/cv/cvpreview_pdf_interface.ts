import { MasterData } from "../main_interface";
import { CVEducationInterface } from "./cveducation_interface";
import { CVExperienceInterface } from "./cvexperience_interface";
import { CVLicenseCertificateInterface } from "./cvlicensecertificate_interface";
import { CVPortfolioInterface } from "./cvportfolio_interface";
import { CVProfileInterface } from "./cvprofile_interface";
import { CVSkillInterface } from "./cvskill_interface";

export interface CVPreviewPDF {
  profile: CVProfileInterface;
  education: CVEducationInterface[];
  experience: CVExperienceInterface[];
  skill: CVSkillInterface[];
  licenseAndCertificate: CVLicenseCertificateInterface[];
  portfolio: CVPortfolioInterface[];
  master_level: MasterData[];
}
