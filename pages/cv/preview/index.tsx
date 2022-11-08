import { Button, Card, Select, Space, Spin, Tabs } from "antd";
import axios from "axios";
import useSWR from "swr";

import { SaveOutlined } from "@ant-design/icons";

import useUserLogin from "../../../hooks/use_userlogin";
import { MasterData, Users } from "../../../interface/main_interface";
import { baseAPIURL } from "../../../utils/constant";
import { CVProfile } from "../../../components/cv/preview/preview_cv_profile";
import { CVSkill } from "../../../components/cv/preview/preview_cv_skill";
import { CVLicenseAndCertificate } from "../../../components/cv/preview/preview_cv_license_certificate";
import { CVEducation } from "../../../components/cv/preview/preview_cv_education";
import { CVExperience } from "../../../components/cv/preview/preview_cv_experience";

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
      <div className="flex flex-col items-center">
        <div className="w-full min-h-[297mm] flex flex-col bg-blue-100 rounded p-5 lg:w-paper-A4">
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
            <CVLicenseAndCertificate
              value={dataPreview?.CVLicenseCertificate}
            />
            <CVSkill skill={dataPreview?.CVSkill} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;
