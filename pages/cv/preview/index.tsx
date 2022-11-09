import { Button, Card, notification, Select, Space, Spin, Tabs } from "antd";
import axios from "axios";
import { saveAs } from "file-saver";
import { useState } from "react";
import useSWR from "swr";

import { SaveOutlined } from "@ant-design/icons";

import DefaultTemplatePDF from "../../../components/template_pdf/default/default_template_pdf";
import useUserLogin from "../../../hooks/use_userlogin";
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
  const [isLoadingGeneratePDF, setIsLoadingGeneratePDF] = useState(false);

  const { data: dataPreview, mutate: reloadPreview } = useSWR(
    [`${baseAPIURL}/cv/preview/pdf/${userLogin?.id}`],
    previewPDFFetcher
  );

  const { data: dataCodeTemplate, isValidating: isLoadingCodeTemplate } =
    useSWR(
      [`${baseAPIURL}/setting/master_data`, "KODE_TEMPLATE_WEB"],
      codeTemplateWebsiteFetcher
    );

  const generatePDF = async () => {
    try {
      setIsLoadingGeneratePDF(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASEAPIURL}/cv/preview/generate_pdf/${userLogin?.id}`
      );
      const { data: responseData, status } = response;
      const { url_download, filename } = responseData.data;
      saveAs(url_download, filename);
      notification.success({
        message: "Success",
        description: "success generate file pdf",
      });
    } catch (error: any) {
      console.log({ error });
      alert("error generate pdf");
    } finally {
      setIsLoadingGeneratePDF(false);
    }
  };

  return (
    <Spin spinning={isLoadingGeneratePDF}>
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
              onClick={generatePDF}
            >
              Generate Template
            </Button>
          </Space>
        </div>
        <DefaultTemplatePDF user={dataPreview} isUseShadow />
      </div>
    </Spin>
  );
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

export default PreviewPage;
