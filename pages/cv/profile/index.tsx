import { Button, Card, Form, Input, notification, Space, Spin, Upload } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import { FilePdfOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons';

import useUserLogin from '../../../hooks/use_userlogin';
import { Users } from '../../../interface/main_interface';
import { baseAPIURL } from '../../../utils/constant';
import { regexPhone } from '../../../utils/regex';

const profileFetcher = async (url: string) => {
  const request = await axios.get(`${url}`);
  const { data, success }: { data: Users; success: boolean } = request.data;
  return data;
};

const ProfilePage = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const userLogin = useUserLogin();

  const {
    data: dataUsers,
    mutate: reloadProfile,
    isValidating,
  } = useSWR(
    [`${baseAPIURL}/cv/profile/user_id/${userLogin?.id ?? 0}`],
    profileFetcher
  );

  useEffect(() => {
    const profile = dataUsers?.CVProfile;
    form.setFieldsValue({
      username: dataUsers?.username,
      email: dataUsers?.email,
      name: dataUsers?.name,
      motto: profile?.motto,
      description: profile?.description,
      phone: profile?.phone,
      web: profile?.web,
      twitter: profile?.twitter,
      instagram: profile?.instagram,
      facebook: profile?.facebook,
      linkedIn: profile?.linkedIn,
      github: profile?.github,
      address: profile?.address,
    });
    return () => {};
  }, [form, dataUsers, userLogin]);

  const onFinish = async () => {
    try {
      setIsLoading(true);
      const values = await form.validateFields();
      const url = baseAPIURL + `/cv/profile`;
      const formData = new FormData();
      for (const key in values) {
        if (values[key]) formData.set(key, values[key]);
      }

      formData.set("users_id", `${userLogin?.id}`);
      if (values.image) formData.set("image", values.image.file);
      if (values.banner_image)
        formData.set("banner_image", values.banner_image.file);
      if (values.latest_resume)
        formData.set("latest_resume", values.latest_resume.file);
      const response = await axios.post(url, formData);
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
            form={form}
            name="form_validation"
            id="form_validation"
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item label="Username" name="username">
              <Input name="username" disabled />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input
                name="email"
                placeholder="Masukkan Email"
                type="email"
                disabled
              />
            </Form.Item>
            <Form.Item label="Name" name="name">
              <Input name="name" placeholder="Masukkan namamu" disabled />
            </Form.Item>
            <Form.Item label="Motto" name="motto" rules={[{ required: true }]}>
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item
              label="Deskripsi"
              name="description"
              rules={[{ required: true }]}
            >
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

            <Form.Item label="Web" name="web" rules={[{ type: "url" }]}>
              <Input name="web" placeholder="Masukkan Web Url" type="url" />
            </Form.Item>
            <Form.Item label="Twitter" name="twitter" rules={[{ type: "url" }]}>
              <Input placeholder="Masukkan link Twitter" />
            </Form.Item>
            <Form.Item
              label="Facebook"
              name="facebook"
              rules={[{ type: "url" }]}
            >
              <Input placeholder="Masukkan Facebook" />
            </Form.Item>
            <Form.Item
              label="Instagram"
              name="instagram"
              rules={[{ type: "url" }]}
            >
              <Input placeholder="Masukkan Instagram" />
            </Form.Item>
            <Form.Item
              label="LinkedIn"
              name="linkedIn"
              rules={[{ type: "url" }]}
            >
              <Input placeholder="Masukkan LinkedIn" />
            </Form.Item>
            <Form.Item label="Github" name="github" rules={[{ type: "url" }]}>
              <Input placeholder="Masukkan Github" />
            </Form.Item>

            <Form.Item label="Alamat" name="address">
              <TextArea rows={4} />
            </Form.Item>
            <div className="flex flex-col mb-5">
              <Form.Item label="Image" name="image">
                <Upload
                  beforeUpload={() => false}
                  maxCount={1}
                  accept=".jpg, .png, .jpeg"
                >
                  <Button icon={<UploadOutlined />}>Upload Gambar</Button>
                </Upload>
              </Form.Item>
              {dataUsers?.CVProfile?.image && (
                <div className="relative">
                  <Image
                    key={new Date(
                      dataUsers.CVProfile.updated_at
                    ).toDateString()}
                    src={dataUsers.CVProfile.image}
                    alt="Image"
                    width={150}
                    height={150}
                    className="rounded-full shadow"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col mb-5">
              <Form.Item label="Banner Image" name="banner_image">
                <Upload
                  beforeUpload={() => false}
                  maxCount={1}
                  accept=".jpg, .png, .jpeg"
                >
                  <Button icon={<UploadOutlined />}>Upload Banner</Button>
                </Upload>
              </Form.Item>
              {dataUsers?.CVProfile?.banner_image && (
                <div className="relative">
                  <Image
                    key={new Date(
                      dataUsers.CVProfile.updated_at
                    ).toDateString()}
                    src={dataUsers.CVProfile.banner_image}
                    alt="Image"
                    width={150}
                    height={150}
                    className="shadow"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-row items-center">
              <Form.Item label="Latest Resume" name="latest_resume">
                <Upload beforeUpload={() => false} maxCount={1} accept=".pdf">
                  <Button icon={<UploadOutlined />}>Upload PDF</Button>
                </Upload>
              </Form.Item>
              {dataUsers?.CVProfile?.latest_resume && (
                <Button
                  type="link"
                  size="large"
                  icon={<FilePdfOutlined />}
                  danger
                  onClick={(e) =>
                    window.open(`${dataUsers.CVProfile?.latest_resume}`)
                  }
                />
              )}
            </div>
          </Form>
        </div>
      </Card>
    </Spin>
  );
};

export default ProfilePage;
