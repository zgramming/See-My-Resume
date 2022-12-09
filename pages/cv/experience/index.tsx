import "react-quill/dist/quill.snow.css";

import {
  Button,
  Card,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Modal,
  notification,
  Space,
  Spin,
  Table,
  TableColumnsType,
  Tag,
} from "antd";
import Search from "antd/lib/input/Search";
import Upload from "antd/lib/upload";
import axios from "axios";
import moment from "moment";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import useSWR from "swr";

import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import useUserLogin from "../../../hooks/use_userlogin";
import { CVExperienceInterface } from "../../../interface/cv/cvexperience_interface";
import { baseAPIURL } from "../../../utils/constant";
import Image from "next/image";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface DataSourceInterface {
  no: number;
  job: string;
  company: string;
  start_date: string;
  end_date: string;
  image_company?: string;
  tags?: string;
  created_at: string;
  updated_at: string;
  action: CVExperienceInterface;
}

const experienceFetcher = async (url: string) => {
  const request = await axios.get(`${url}`);
  const {
    data,
    success,
  }: { data: CVExperienceInterface[] | undefined; success: boolean } =
    request.data;
  return data;
};

const ExperiencePage = () => {
  const userLogin = useUserLogin();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [row, setRow] = useState<CVExperienceInterface | undefined>(undefined);
  const [queryParam, setQueryParam] = useState<{
    limit?: number;
    offset?: number;
  }>();

  const { data: dataExperience, mutate: reloadExperience } = useSWR(
    [`${baseAPIURL}/cv/experience/user_id/${userLogin?.id}`],
    experienceFetcher
  );

  const deleteHandler = async (id: string) => {
    Modal.confirm({
      title: "Are you sure delete this row ?",
      maskClosable: false,
      onOk: async () => {
        const request = await axios.delete(`${baseAPIURL}/cv/experience/${id}`);
        const { success, message, data } = request.data;
        notification.success({
          message: "Success",
          description: message,
        });
        reloadExperience();
      },
      onCancel: async () => {},
    });
  };

  const dataSource: DataSourceInterface[] =
    dataExperience?.map((val, index) => {
      return {
        no: index + 1,
        job: val.job,
        company: val.company,
        start_date: new Date(val.start_date).toDateString(),
        end_date: new Date(val.end_date).toDateString(),
        image_company: val.image_company,
        tags: val.tags,
        created_at: new Date(val.created_at).toDateString(),
        updated_at: new Date(val.updated_at).toDateString(),
        action: val,
      };
    }) ?? [];

  const columns: TableColumnsType<DataSourceInterface> = [
    { key: "no", dataIndex: "no", title: "No" },
    { key: "company", dataIndex: "company", title: "Perusahaan" },
    { key: "job", dataIndex: "job", title: "Pekerjaan" },
    { key: "start_date", dataIndex: "start_date", title: "Mulai" },
    { key: "end_date", dataIndex: "end_date", title: "Selesai" },
    {
      key: "image_company",
      dataIndex: "image_company",
      title: "Gambar",
      render(value, record, index) {
        if (!record.image_company) return <div>-</div>;
        return (
          <Image
            key={record.updated_at}
            src={record.image_company}
            alt="Failed load image"
            width={100}
            height={100}
          />
        );
      },
    },
    {
      key: "tags",
      dataIndex: "tags",
      title: "Tags",
      render(value, record, index) {
        const tags = value ? (JSON.parse(value) as string[]) : [];

        return (
          <div className="flex flex-row flex-wrap">
            {tags.map((val) => (
              <Tag key={val + index} color="green" className="mb-1">
                {val}
              </Tag>
            ))}
          </div>
        );
      },
    },
    { key: "created_at", dataIndex: "created_at", title: "Created At" },
    { key: "updated_at", dataIndex: "updated_at", title: "UpdatedA At" },
    {
      key: "action",
      dataIndex: "action",
      title: "Aksi",
      width: 100,
      render: (val: CVExperienceInterface) => {
        return (
          <Space align="center">
            <Button
              icon={<EditOutlined />}
              className="bg-info text-white"
              onClick={() => {
                setIsModalOpen(true);
                setRow(val);
              }}
            />
            <Button
              icon={<DeleteOutlined />}
              className="bg-error text-white"
              onClick={(e) => deleteHandler(val.id)}
            />
          </Space>
        );
      },
    },
  ];

  return (
    <Spin spinning={!dataExperience}>
      <Card>
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-5">
            <h1 className="font-medium text-base mr-5 md:text-xl">
              Pengalaman
            </h1>
            <Space wrap>
              <Button
                icon={<PlusOutlined />}
                className="bg-success text-white"
                onClick={() => {
                  setIsModalOpen(true);
                  setRow(undefined);
                }}
              >
                Tambah
              </Button>
            </Space>
          </div>
          <div className="flex flex-wrap items-center space-x-2 mb-5">
            <Search
              placeholder="Cari sesuatu..."
              onSearch={(e) => ""}
              className="w-48"
              allowClear
            />
          </div>
          <Table
            columns={columns}
            dataSource={dataSource}
            scroll={{ x: 2000 }}
            pagination={{
              total: dataSource.length,
              pageSize: queryParam?.limit,
              showSizeChanger: true,
              onShowSizeChange: (current, size) => {
                setQueryParam((val) => {
                  return { ...val, limit: size };
                });
              },
            }}
          />
          {isModalOpen && (
            <FormModal
              open={isModalOpen}
              row={row}
              onCloseModal={(needReload) => {
                setIsModalOpen(false);
                if (needReload) reloadExperience();
              }}
            />
          )}
        </div>
      </Card>
    </Spin>
  );
};

const FormModal = (props: {
  open: boolean;
  row?: CVExperienceInterface;
  onCloseModal: (needReload?: boolean) => void;
}) => {
  const userLogin = useUserLogin();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const [formState, setFormState] = useState<{
    is_graduated?: boolean;
    tags: string[];
  }>({
    is_graduated: props.row?.is_graduated ?? false,
    tags: props.row?.tags ? JSON.parse(props.row.tags) : [],
  });

  const onFinish = async () => {
    try {
      setIsLoading(true);
      const values = await form.validateFields();
      const formData = new FormData();
      for (const key in values) {
        if (values[key]) formData.append(key, values[key]);
      }

      if (props.row) formData.set("id", props.row.id);
      formData.append("users_id", `${userLogin?.id}`);
      formData.append("is_graduated", formState.is_graduated ? "1" : "0");
      formData.append("tags", JSON.stringify(formState.tags ?? []));
      if (values.image_company)
        formData.append("image_company", values.image_company.file);

      const response = await axios.post(
        `${baseAPIURL}/cv/experience`,
        formData
      );

      const { data, message, success } = response.data;
      notification.success({
        message: "Success",
        description: message,
      });
      props.onCloseModal(true);
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

  useEffect(() => {
    form.setFieldsValue({
      company: props.row?.company,
      job: props.row?.job,
      start_date:
        props.row?.start_date && moment(new Date(props.row.start_date)),
      end_date: props.row?.end_date && moment(new Date(props.row.end_date)),
      location: props.row?.location,
      description: props.row?.description,
      is_graduated: props.row?.is_graduated ?? false,
    });
    return () => {};
  }, [form, props.row]);

  return (
    <Modal
      title="Form Pengalaman"
      open={props.open}
      maskClosable={false}
      keyboard={false}
      closable={false}
      width="1000px"
      onCancel={(e) => props.onCloseModal()}
      footer={
        <Spin spinning={isLoading}>
          <Button onClick={(e) => props.onCloseModal()}>Batal</Button>
          <Button
            htmlType="submit"
            form="form_validation"
            className="bg-success text-white"
          >
            Simpan
          </Button>
        </Spin>
      }
    >
      <Spin spinning={isLoading}>
        <Form
          form={form}
          name="form_validation"
          id="form_validation"
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="company"
            label="Perusahaan"
            rules={[{ required: true }]}
          >
            <Input placeholder="Masukkan Perusahaan" />
          </Form.Item>
          <Form.Item label="Pekerjaan" name="job" rules={[{ required: true }]}>
            <Input placeholder="Masukkan Pekerjaan" />
          </Form.Item>
          <Form.Item label="Lokasi" name="location">
            <Input placeholder="Masukkan Lokasi Pekerjaan" />
          </Form.Item>
          <Form.Item
            label="Mulai"
            name="start_date"
            rules={[{ required: true }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item label="Selesai" name="end_date">
            <DatePicker
              className="w-full"
              onChange={(val, datestring) => {
                /// Unchecked [is_Graduated] when [end_date] is filled
                if (datestring != "") {
                  setFormState((prevState) => {
                    return { ...prevState, is_graduated: false };
                  });
                }
              }}
            />
          </Form.Item>
          <Form.Item>
            <Checkbox
              name="is_graduated"
              checked={formState.is_graduated}
              onChange={(e) => {
                ///  set undefined [end_date] when checked
                if (e.target.checked) {
                  form.setFieldValue("end_date", undefined);
                }
                setFormState((prevstate) => {
                  return { ...prevstate, is_graduated: e.target.checked };
                });
              }}
            >
              Masih bekerja
            </Checkbox>
          </Form.Item>

          <Form.Item label="Image" name="image_company">
            <Upload
              accept=".jpg, .png, .jpeg"
              maxCount={1}
              beforeUpload={async (file, listfile) => {
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Upload Gambar</Button>
            </Upload>
          </Form.Item>
          {document && (
            <Form.Item
              label="Deskripsikan pekerjaan kamu"
              name="description"
              rules={[{ required: true }]}
            >
              <ReactQuill theme="snow" />
            </Form.Item>
          )}

          <div className="flex flex-col">
            <Form.Item
              name={"tags"}
              label="Tags"
              help="Comma untuk membuat tag"
            >
              <Input
                placeholder="Masukkan tags"
                onKeyUp={(e) => {
                  /// 9 Tab, 188 comma, 32 space
                  const triggerTagsKeyboard = ["Comma"];
                  const val = (e.target as HTMLInputElement).value;
                  if (
                    triggerTagsKeyboard.includes(e.code) &&
                    val.trim().length !== 0
                  ) {
                    e.preventDefault();
                    form.setFieldValue("tags", undefined);
                    setFormState((prevState) => {
                      return {
                        ...prevState,
                        tags: [...(prevState?.tags ?? []), val.slice(0, -1)],
                      };
                    });
                  }
                }}
              />
            </Form.Item>
            <div className="flex flex-row flex-wrap my-2">
              {formState.tags.length != 0 &&
                formState.tags.map((tag, index) => (
                  <Tag
                    key={tag + index}
                    color="green"
                    className="mb-1 text-base"
                    onClose={(e) =>
                      setFormState((prevState) => {
                        const tags = [
                          ...(prevState?.tags?.filter((val) => val !== tag) ??
                            []),
                        ];
                        return { ...prevState, tags };
                      })
                    }
                    closable
                  >
                    {tag}
                  </Tag>
                ))}
            </div>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default ExperiencePage;
