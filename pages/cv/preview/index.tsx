import { Button, Card, Select, Space, Spin, Tabs } from "antd";
import axios from "axios";
import { ReactNode, useEffect } from "react";
import useSWR from "swr";

import {
  GlobalOutlined,
  MailFilled,
  PhoneFilled,
  SaveOutlined,
  StarFilled,
} from "@ant-design/icons";

import useUserLogin from "../../../hooks/use_userlogin";
import { CVEducationInterface } from "../../../interface/cv/cveducation_interface";
import { CVExperienceInterface } from "../../../interface/cv/cvexperience_interface";
import { CVLicenseCertificateInterface } from "../../../interface/cv/cvlicensecertificate_interface";
import { CVProfileInterface } from "../../../interface/cv/cvprofile_interface";
import { CVSkillInterface } from "../../../interface/cv/cvskill_interface";
import { MasterData, Users } from "../../../interface/main_interface";
import { baseAPIURL } from "../../../utils/constant";

const codeTemplateWebsiteFetcher = async (url: string, code: string) => {
  const request = await axios.get(`${url}?master_category_code=${code}`);
  const {
    data,
    success,
  }: { data: MasterData[] | undefined; success: boolean } = request.data;
  return data;
};

const previewPDFFetcher = async (url: string) => {
  const request = await axios.get(`${url}`);
  const { data, success }: { data: Users | undefined; success: boolean } =
    request.data;
  return data;
};

const PreviewPage = () => {
  return (
    <Spin spinning={false}>
      <Card>
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-5">
            <h1 className="font-medium text-base mr-5 md:text-xl">Preview</h1>
          </div>
          <Tabs
            defaultActiveKey="1"
            onChange={(e) => {}}
            items={[
              {
                label: `WEBSITE`,
                key: "website",
                children: <PreviewWebPortfolio />,
              },
              {
                label: `PDF CV`,
                key: "pdf",
                children: <PreviewPDF />,
              },
            ]}
          />
        </div>
      </Card>
    </Spin>
  );
};

const PreviewWebPortfolio = () => {
  const { data: dataCodeTemplate, isValidating: isLoadingCodeTemplate } =
    useSWR(
      [`${baseAPIURL}/setting/master_data`, "KODE_TEMPLATE_WEB"],
      codeTemplateWebsiteFetcher
    );

  return (
    <div className="flex flex-col space-y-10">
      <div className="flex flex-row justify-between items-center my-5">
        <div className="flex flex-wrap items-center space-x-2 ">
          <div className="flex items-center space-x-3">
            <div>Pilih Template</div>
            <Select
              className="w-auto md:min-w-[10rem]"
              defaultValue={{
                value: "",
                label: "Pilih",
              }}
              onChange={(value: any) => {}}
            >
              <Select.Option value={""}>Pilih</Select.Option>
              {dataCodeTemplate?.map((val, index) => {
                return (
                  <Select.Option key={val.id} value={val.id}>
                    {val.name}
                  </Select.Option>
                );
              }) ?? []}
            </Select>
          </div>
        </div>

        <Space>
          <Button
            icon={<SaveOutlined />}
            className="bg-success text-white"
            onClick={() => {}}
          >
            Simpan
          </Button>
        </Space>
      </div>

      <Card
        bodyStyle={{
          padding: 0,
          margin: 0,
        }}
        style={{
          padding: 0,
          margin: 0,
        }}
      >
        <div className="h-[50rem] flex flex-col bg-slate-200 overflow-y-auto">
          {Array.from<number>({ length: 100 }).map((val) => (
            <h1 key={val}>Aku ganteng sekali</h1>
          ))}
        </div>
      </Card>
    </div>
  );
};
const PreviewPDF = () => {
  const userLogin = useUserLogin();

  const { data: dataPreview, mutate: reloadPreview } = useSWR(
    [`${baseAPIURL}/cv/preview/pdf/${userLogin?.id}`],
    previewPDFFetcher
  );

  const { data: dataCodeTemplate, isValidating: isLoadingCodeTemplate } =
    useSWR(
      [`${baseAPIURL}/setting/master_data`, "KODE_TEMPLATE_WEB"],
      codeTemplateWebsiteFetcher
    );

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between items-center my-5">
        <div className="flex flex-wrap items-center space-x-2 ">
          <div className="flex items-center space-x-3">
            <div>Pilih Template</div>
            <Select
              className="w-auto md:min-w-[10rem]"
              defaultValue={{
                value: "",
                label: "Pilih",
              }}
              onChange={(value: any) => {}}
            >
              <Select.Option value={""}>Pilih</Select.Option>
              {dataCodeTemplate?.map((val, index) => {
                return (
                  <Select.Option key={val.id} value={val.id}>
                    {val.name}
                  </Select.Option>
                );
              }) ?? []}
            </Select>
          </div>
        </div>

        <Space>
          <Button
            icon={<SaveOutlined />}
            className="bg-success text-white"
            onClick={() => {}}
          >
            Simpan
          </Button>
        </Space>
      </div>
      <div className="w-[50rem] flex flex-col justify-center rounded mx-auto p-5 bg-slate-200">
        {/* Header */}
        <CVProfile
          profile={dataPreview?.CVProfile}
          email={dataPreview?.email}
          name={dataPreview?.name}
        />
        {/* Body -> Experience */}
        <div className="flex flex-col space-y-5 my-5">
          <CVExperience experience={dataPreview?.CVExperience} />
          <CVEducation education={dataPreview?.CVEducation} />
          <CVLicenseAndCertificate value={dataPreview?.CVLicenseCertificate} />
          <CVSkill skill={dataPreview?.CVSkill} />
        </div>
      </div>
    </div>
  );
};

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
      {props.value?.map((val) => {
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
            <div className="text-base">1.</div>
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

const CVProfile = (props: {
  name?: string;
  email?: string;
  profile?: CVProfileInterface;
}) => {
  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex flex-col space-y-2 pr-10">
        <div className="font-bold text-2xl">{props.name}</div>
        <div className="font-semibold text-lg">{props.profile?.motto}</div>
        <div className="font-thin text-xs text-gray-500 text-justify">
          {props.profile?.description}
        </div>
      </div>
      <div className="flex flex-col space-y-2">
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
            <div className="flex flex-col">
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
const InfoCV = (props: { icon: ReactNode; title: string }) => {
  return (
    <div className="flex flex-row items-center space-x-2 ">
      {props.icon && props.icon}
      <div className="text-xs">{props.title}</div>
    </div>
  );
};

export default PreviewPage;
