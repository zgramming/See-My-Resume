import {
  Button,
  Card,
  Form,
  notification,
  Select,
  Space,
  Spin,
  Tabs,
} from "antd";
import axios from "axios";
import { saveAs } from "file-saver";
import { useEffect, useState } from "react";
import useSWR from "swr";

import { BuildFilled, SaveOutlined } from "@ant-design/icons";

import DefaultTemplatePDF from "../../../components/template_pdf/default/default_template_pdf";
import useUserLogin from "../../../hooks/use_userlogin";
import { CvTemplatePDFInterface } from "../../../interface/cv/cvtemplate_pdf_interface";
import { CvTemplateWebsiteInterface } from "../../../interface/cv/cvtemplate_website_interface";
import { MasterData, Users } from "../../../interface/main_interface";
import { baseAPIURL } from "../../../utils/constant";

const getTemplateWebsiteFetcher = async (url: string) => {
  const request = await axios.get(`${url}`);
  const {
    data,
    success,
  }: { data: CvTemplateWebsiteInterface | undefined; success: boolean } =
    request.data;
  return data;
};

const getTemplatePDFFetcher = async (url: string) => {
  const request = await axios.get(`${url}`);
  const {
    data,
    success,
  }: { data: CvTemplatePDFInterface | undefined; success: boolean } =
    request.data;
  return data;
};

const masterDataCodeTemplateFetcher = async (url: string, code: string) => {
  const request = await axios.get(
    `${url}?master_category_code=${code}&status=active`
  );
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

const PreviewWebsite = () => {
  const [form] = Form.useForm();
  const user = useUserLogin();
  const [isLoading, setIsLoading] = useState(false);
  const [iframeKey, setIframeKey] = useState<string>(
    new Date().toLocaleDateString()
  );

  const { data: dataTemplateWebsite, isValidating: reloadTemplateWebsite } =
    useSWR(
      [`${baseAPIURL}/cv/preview/website/user_id/${user?.id}`],
      getTemplateWebsiteFetcher
    );

  const { data: dataCodeTemplate, isValidating: isLoadingCodeTemplate } =
    useSWR(
      [`${baseAPIURL}/setting/master_data`, "KODE_TEMPLATE_WEB"],
      masterDataCodeTemplateFetcher
    );

  const onFinish = async () => {
    try {
      setIsLoading(true);
      const values = await form.validateFields();
      const { data: dataResponse, status } = await axios.post(
        `${baseAPIURL}/cv/preview/website`,
        {
          user_id: user?.id,
          template_website_id: values.template_website_id,
        }
      );
      const {
        data,
        success,
        message,
      }: {
        data?: CvTemplateWebsiteInterface;
        success: boolean;
        message?: string;
      } = dataResponse;
      setIframeKey((state) => {
        return new Date().toLocaleDateString("id-ID", {
          hour: "numeric",
          second: "2-digit",
        });
      });
      notification.success({
        message: "Success",
        description: message,
      });
    } catch (error: any) {
      notification.error({
        message: "Error occured",
        description: error?.message ?? "Unknown Error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (dataTemplateWebsite) {
      form.setFieldValue(
        "template_website_id",
        dataTemplateWebsite?.template_website_id ?? null
      );
    }
    return () => {};
  }, [dataTemplateWebsite, form]);

  return (
    <Spin spinning={isLoading}>
      <div className="flex flex-col space-y-10">
        <div className="flex flex-row justify-end items-center mt-5">
          <Space>
            <Button
              icon={<SaveOutlined />}
              className="bg-success text-white"
              form="form_validation_website"
              htmlType="submit"
            >
              Simpan
            </Button>
          </Space>
        </div>
        <Form
          form={form}
          name="form_validation_website"
          id="form_validation_website"
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item label="Template" name="template_website_id">
            <Select
              className="w-auto md:min-w-[10rem]"
              defaultValue={{
                value: dataTemplateWebsite?.template_website_id ?? null,
                label: dataTemplateWebsite?.template_website?.name ?? "Default",
              }}
            >
              <Select.Option value={undefined}>Default</Select.Option>
              {dataCodeTemplate?.map((val, index) => {
                return (
                  <Select.Option key={val.id} value={val.id}>
                    {val.name}
                  </Select.Option>
                );
              }) ?? []}
            </Select>
          </Form.Item>
          <Form.Item label="Preview Website">
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
              <iframe
                key={iframeKey}
                name="Template Website"
                src={`${process.env.NEXT_PUBLIC_BASEWEBURL}/${user?.username}`}
                className="w-full h-[50rem] border-none shadow-xl"
              ></iframe>
            </Card>
          </Form.Item>
        </Form>
      </div>
    </Spin>
  );
};

const PreviewPDF = () => {
  const user = useUserLogin();
  const [form] = Form.useForm();

  const [isLoadingGeneratePDF, setIsLoadingGeneratePDF] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data: dataPreview, mutate: reloadPreview } = useSWR(
    [`${baseAPIURL}/cv/preview/pdf/user_id/${user?.id}/detail`],
    previewPDFFetcher
  );

  const { data: dataTemplatePDF, isValidating: reloadTemplatePDF } = useSWR(
    [`${baseAPIURL}/cv/preview/pdf/user_id/${user?.id}`],
    getTemplatePDFFetcher
  );

  const { data: dataCodeTemplate, isValidating: isLoadingCodeTemplate } =
    useSWR(
      [`${baseAPIURL}/setting/master_data`, "KODE_TEMPLATE_PDF"],
      masterDataCodeTemplateFetcher
    );

  const onFinish = async () => {
    try {
      setIsLoading(true);
      const values = await form.validateFields();
      const { data: dataResponse, status } = await axios.post(
        `${baseAPIURL}/cv/preview/pdf`,
        {
          user_id: user?.id,
          template_pdf_id: values.template_pdf_id,
        }
      );
      const {
        data,
        success,
        message,
      }: {
        data?: CvTemplatePDFInterface;
        success: boolean;
        message?: string;
      } = dataResponse;

      notification.success({
        message: "Success",
        description: message,
      });
    } catch (error: any) {
      notification.error({
        message: "Error occured",
        description: error?.message ?? "Unknown Error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = async () => {
    try {
      setIsLoadingGeneratePDF(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASEAPIURL}/cv/preview/generate_pdf/user_id/${user?.id}`
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
        <div className="flex flex-row justify-end items-center mt-5">
          <Space>
            <Button
              icon={<BuildFilled />}
              className="bg-info text-white"
              onClick={generatePDF}
              htmlType="button"
            >
              Generate Template
            </Button>
            <Button
              icon={<SaveOutlined />}
              className="bg-success text-white"
              htmlType="submit"
              form="form_validation_pdf"
            >
              Simpan
            </Button>
          </Space>
        </div>
        <Form
          form={form}
          name="form_validation_pdf"
          id="form_validation_pdf"
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item label="Template" name="template_pdf_id">
            <Select
              className="w-auto md:min-w-[10rem]"
              defaultValue={{
                value: dataTemplatePDF?.template_pdf_id ?? null,
                label: dataTemplatePDF?.template_pdf?.name ?? "Default",
              }}
            >
              <Select.Option value={undefined}>Default</Select.Option>
              {dataCodeTemplate?.map((val, index) => {
                return (
                  <Select.Option key={val.id} value={val.id}>
                    {val.name}
                  </Select.Option>
                );
              }) ?? []}
            </Select>
          </Form.Item>
          <Form.Item label="Preview PDF">
            <DefaultTemplatePDF user={dataPreview} isUseShadow />
          </Form.Item>
        </Form>
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
                children: <PreviewWebsite />,
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
