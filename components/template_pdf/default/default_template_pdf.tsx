import { ReactNode } from "react";

import {
  GlobalOutlined,
  MailFilled,
  PhoneFilled,
  StarFilled,
} from "@ant-design/icons";

import { CVEducationInterface } from "../../../interface/cv/cveducation_interface";
import { CVExperienceInterface } from "../../../interface/cv/cvexperience_interface";
import { CVLicenseCertificateInterface } from "../../../interface/cv/cvlicensecertificate_interface";
import { CVProfileInterface } from "../../../interface/cv/cvprofile_interface";
import { CVSkillInterface } from "../../../interface/cv/cvskill_interface";
import { Users } from "../../../interface/main_interface";

const CVSkill = (props: { skill?: CVSkillInterface[] }) => {
  return (
    <div className="flex flex-col">
      <div className="text-lg font-semibold border-solid border-0 border-b-4 border-primary mb-5">
        SKILLS
      </div>
      <div className="flex flex-wrap mb-5">
        {props.skill?.map((val) => (
          <div
            key={val.id}
            className="rounded text-white text-sm font-medium  p-1 m-1"
            style={{
              backgroundColor: `${val.level.parameter1_value}`,
            }}
          >
            {val.name}
          </div>
        ))}
      </div>
    </div>
  );
};

const CVLicenseAndCertificate = (props: {
  value?: CVLicenseCertificateInterface[];
}) => {
  return (
    <div className="flex flex-col">
      <div className="text-lg font-semibold border-solid border-0 border-b-4 border-primary mb-5">
        LICENSE & CERTIFICATE
      </div>
      {props.value?.map((val, index) => {
        const startDate = new Date(val.start_date);
        const endDate = val.end_date && new Date(val.end_date);
        const readableStartDate = startDate.toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
        const readableEndDate = endDate
          ? "Expire at " +
            endDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })
          : "No Expire";
        return (
          <div className="flex items-start space-x-2" key={val.id}>
            <div className="text-base">{index + 1}.</div>
            <div className="flex flex-col space-y-1">
              <div className="text-base font-bold">{val.name}</div>
              <div className="text-sm font-semibold">{val.publisher}</div>
              <div className="text-sm font-thin">
                Publish at {readableStartDate} {readableEndDate}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const CVEducation = (props: { education?: CVEducationInterface[] }) => {
  return (
    <div className="flex flex-col ">
      <div className="text-lg font-semibold border-solid border-0 border-b-4 border-primary mb-5">
        EDUCATION
      </div>
      {props.education?.map((val, index) => {
        const startDate = new Date(val.start_date);
        const endDate = val.end_date && new Date(val.end_date);

        const readableStartDate = startDate.getFullYear().toString();
        const readableEndDate = endDate?.getFullYear()?.toString() ?? "Present";

        return (
          <div key={val.id} className="flex flex-row space-x-2">
            <div>{index + 1}.</div>
            <div className="w-full flex flex-row items-center justify-between ">
              <div className="flex flex-col">
                <div className="font-bold text-base">{val.major}</div>
                <div className="font-semibold text-sm text-gray-500">
                  {val.name} - {val.field_of_study}
                </div>
              </div>
              <div className="text-xs font-bold">
                {readableStartDate} - {readableEndDate}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const CVExperience = (props: { experience?: CVExperienceInterface[] }) => {
  return (
    <div className="flex flex-col">
      <div className="text-lg font-semibold border-solid border-0 border-b-4 border-primary mb-5 ">
        EXPERIENCE
      </div>
      {props.experience?.map((val, index) => {
        const startDate = new Date(val.start_date);
        const monthStart = startDate.getMonth();
        const yearStart = startDate.getFullYear();

        const endDate = val.end_date ? new Date(val.end_date) : undefined;
        const monthEnd = endDate && endDate.getMonth();
        const yearEnd = endDate && endDate.getFullYear();

        const readableStartDate = `${
          monthStart.toString().length == 1 ? `0${monthStart}` : monthStart
        }/${yearStart}`;

        const readableEndDate = val.end_date
          ? `${
              monthEnd!.toString().length == 1 ? `0${monthEnd}` : monthEnd
            }/${yearEnd}`
          : "Present";

        return (
          <div key={val.id} className="flex flex-row space-x-2">
            <div>{index + 1}.</div>
            <div className="flex flex-col w-full">
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-col">
                  <div className="font-bold text-base">{val.job}</div>
                  <div className="font-semibold text-sm text-gray-500">
                    {val.company}
                  </div>
                </div>
                <div className="text-xs font-bold">
                  {readableStartDate} - {readableEndDate}
                </div>
              </div>
              <div
                className="text-sm font-thin"
                dangerouslySetInnerHTML={{ __html: val.description }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const CVProfile = (props: {
  name?: string;
  email?: string;
  profile?: CVProfileInterface;
}) => {
  const InfoCV = (props: { icon: ReactNode; title: string }) => {
    return (
      <div className="flex flex-row items-center space-x-2 pb-2">
        {props.icon && props.icon}
        <div className="text-xs">{props.title}</div>
      </div>
    );
  };
  return (
    <div className="flex flex-col space-y-2 pr-10">
      <div className="font-bold text-2xl">{props.name}</div>
      <div className="font-semibold text-lg">{props.profile?.motto}</div>
      <div className="font-thin text-xs text-gray-500 text-justify">
        {props.profile?.description}
      </div>
      <div className="flex flex-row flex-wrap space-x-3 pb-2">
        {props.profile?.phone && (
          <InfoCV icon={<PhoneFilled />} title={props.profile.phone} />
        )}
        {props.email && <InfoCV icon={<MailFilled />} title={props.email} />}
        {props.profile?.web && (
          <InfoCV icon={<GlobalOutlined />} title={props.profile.web} />
        )}
        {props.profile?.address && (
          <InfoCV icon={<StarFilled />} title={props.profile.address} />
        )}
      </div>
    </div>
  );
};

const DefaultTemplatePDF = ({
  user,
  isUseShadow = false,
}: {
  user?: Users;
  isUseShadow?: boolean;
}) => {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-full min-h-[297mm] flex flex-col ${
          isUseShadow && "shadow border-solid border-[1px] border-gray-200"
        } rounded p-5 lg:w-paper-A4`}
      >
        {/* Header */}
        <CVProfile
          profile={user?.CVProfile}
          email={user?.email}
          name={user?.name}
        />
        {/* Body -> Experience */}
        <div className="flex flex-col space-y-5 my-5">
          <CVExperience experience={user?.CVExperience} />
          <CVEducation education={user?.CVEducation} />
          <CVLicenseAndCertificate value={user?.CVLicenseCertificate} />
          <CVSkill skill={user?.CVSkill} />
        </div>
      </div>
    </div>
  );
};

export default DefaultTemplatePDF;
