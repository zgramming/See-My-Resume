import {
  Button,
  Card,
  Form,
  Input,
  notification,
  Space,
  Spin,
  Upload,
  UploadProps,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import axios from "axios";
import { useEffect, useState } from "react";
import useSWR from "swr";

import { SaveOutlined, UploadOutlined } from "@ant-design/icons";

import useUserLogin from "../../../hooks/use_userlogin";
import { CVProfileInterface } from "../../../interface/cv/cvprofile_interface";
import { baseAPIURL } from "../../../utils/constant";
import { regexPhone } from "../../../utils/regex";

const profileFetcher = async (url: string) => {
  const request = await axios.get(`${url}`);
  const {
    data,
    success,
  }: { data: CVProfileInterface | undefined; success: boolean } = request.data;
  return data;
};

const ProfilePage = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const userLogin = useUserLogin();

  const {
    data: dataProfile,
    mutate: reloadProfile,
    isValidating,
  } = useSWR(
    [`${baseAPIURL}/cv/profile/${userLogin?.id ?? 0}`],
    profileFetcher
  );

  useEffect(() => {
    form.setFieldsValue({
      name: dataProfile?.name,
      motto: dataProfile?.motto,
      description: dataProfile?.description,
      phone: dataProfile?.phone,
      email: dataProfile?.email,
      web: dataProfile?.web,
      address: dataProfile?.address,
    });
    return () => {};
  }, [form, dataProfile]);

  const onFinish = async () => {
    try {
      setIsLoading(true);
      const values = await form.validateFields();
      const url = baseAPIURL + `/cv/profile`;

      const formData = new FormData();

      for (const key in values) {
        formData.append(key, values[key]);
      }
      formData.append("users_id", `${userLogin?.id}`);
      if (files.length !== 0) {
        formData.delete("image");
        formData.append("image", files[0]);
      }

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const { data, success, message } = response.data;
      notification.success({
        message: "Success",
        description: message,
      });

      await reloadProfile();
    } catch (e: any) {
      console.log({ error: e });
      const { message, status, type } = e?.response?.data || {};
      const errorNotification = {
        duration: 0,
        message: "Error",
        description: "Unknown Error Message",
      };
      if (type === "VALIDATION_ERROR") {
        const errors = (message as Array<any>).map(
          (val, index) => `${val.message}`
        );
        notification.error({
          ...errorNotification,
          description: (
            <ul className="list-decimal">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          ),
        });
        return;
      }

      notification.error({ ...errorNotification, description: message });
    } finally {
      setIsLoading(false);
    }
  };

  const propsUploadImage: UploadProps = {
    maxCount: 1,
    accept: ".jpg, .png, .jpeg",
    headers: {
      "Content-Type": "multipart/form-data",
    },

    async beforeUpload(file, FileList) {
      if (FileList.length !== 0) {
        try {
          const buffer = await FileList[0].arrayBuffer();
          const blob = new Blob([buffer]);
          const file = new File([blob], "image");
          // alert(file);
          setFiles([file]);
        } catch (error) {
          console.log({
            error_upload_image: error,
          });
        }
      }
      // const reader = new FileReader();
      // reader.onload = (e) => {
      //   const buffer = e.target?.result as ArrayBuffer;
      //   const blob = new Blob([buffer]);
      //   const file = new File([blob], "image");
      //   console.log(e.target?.result)
      //   // setFile(e.target?.result);
      //   // setFile(`${e.target?.result}`);
      // };
      // reader.readAsArrayBuffer(file);

      // Prevent upload
      return false;
    },
  };

  return (
    <Spin spinning={isValidating || isLoading}>
      <Card>
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-5">
            <h1 className="font-medium text-base mr-5 md:text-xl">Profile</h1>
            <Space wrap>
              <Button
                icon={<SaveOutlined />}
                htmlType="submit"
                form="form_validation"
                className="bg-success text-white"
              >
                Simpan
              </Button>
            </Space>
          </div>
          <Form
            encType="multipart/form-data"
            form={form}
            name="form_validation"
            id="form_validation"
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item label="Name" name="name">
              <Input name="name" placeholder="Masukkan namamu" />
            </Form.Item>
            <Form.Item label="Motto" name="motto">
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item label="Deskripsi" name="description">
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item
              label="Nomor Telepon"
              name="phone"
              rules={[
                {
                  validator(rule, value, callback) {
                    if (value && !regexPhone.test(value)) {
                      return Promise.reject(
                        `${value} bukan nomor telepon yang valid`
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input
                name="phone"
                placeholder="Masukkan Nomor"
                className="w-full"
              />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={[{ type: "email" }]}>
              <Input name="email" placeholder="Masukkan Email" type="email" />
            </Form.Item>
            <Form.Item label="Web" name="web" rules={[{ type: "url" }]}>
              <Input name="web" placeholder="Masukkan Web Url" type="url" />
            </Form.Item>
            <Form.Item label="Alamat" name="address">
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item label="Image" name="image">
              <Upload {...propsUploadImage}>
                <Button icon={<UploadOutlined />}>Upload Gambar</Button>
              </Upload>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </Spin>
  );
};

export default ProfilePage;
