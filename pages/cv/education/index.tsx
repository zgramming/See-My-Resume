import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
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
  Upload,
} from "antd";
import Search from "antd/lib/input/Search";
import axios from "axios";
import moment from "moment";
import Image from "next/image";
import { useEffect, useState } from "react";
import useSWR from "swr";
import useUserLogin from "../../../hooks/use_userlogin";
import { CVEducationInterface } from "../../../interface/cv/cveducation_interface";
import { baseAPIURL } from "../../../utils/constant";

interface DataSourceInterface {
  no: number;
  name: string;
  major: string;
  field_of_study: string;
  start_date: string;
  end_date?: string;
  image?: string;
  created_at: string;
  updated_at: string;
  action: CVEducationInterface;
}

const educationFetcher = async (url: string) => {
  const request = await axios.get(`${url}`);
  const {
    data,
    success,
  }: { data: CVEducationInterface[] | undefined; success: boolean } =
    request.data;
  return data;
};

const EducationPage = () => {
  const userLogin = useUserLogin();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [row, setRow] = useState<CVEducationInterface | undefined>(undefined);
  const [queryParam, setQueryParam] = useState<{
    limit?: number;
    offset?: number;
  }>();

  const {
    data: dataEducation,
    mutate: reloadEducation,
    isValidating,
  } = useSWR([`${baseAPIURL}/cv/education/${userLogin?.id}`], educationFetcher);

  const deleteHandler = async (id: string) => {
    Modal.confirm({
      title: "Are you sure delete this row ?",
      maskClosable: false,
      onOk: async () => {
        const request = await axios.delete(`${baseAPIURL}/cv/education/${id}`);
        const { success, message, data } = request.data;
        notification.success({
          message: "Success",
          description: message,
        });
        reloadEducation();
      },
      onCancel: async () => {},
    });
  };

  const dataSource: DataSourceInterface[] =
    dataEducation?.map((val, index) => {
      return {
        no: index + 1,
        major: val.major,
        name: val.name,
        field_of_study: val.field_of_study,
        start_date: new Date(val.start_date).toDateString(),
        end_date: val.end_date && new Date(val.end_date).toDateString(),
        image: val.image,
        created_at: new Date(val.created_at).toDateString(),
        updated_at: new Date(val.updated_at).toDateString(),
        action: val,
      };
    }) ?? [];

  const columns: TableColumnsType<DataSourceInterface> = [
    { key: "no", dataIndex: "no", title: "No" },
    { key: "name", dataIndex: "name", title: "Nama" },
    { key: "major", dataIndex: "major", title: "Jurusan" },
    {
      key: "field_of_study",
      dataIndex: "field_of_study",
      title: "Bidang Pendidikan",
    },
    { key: "start_date", dataIndex: "start_date", title: "Mulai" },
    { key: "end_date", dataIndex: "end_date", title: "Selesai" },
    {
      key: "image",
      dataIndex: "image",
      title: "Gambar",
      render(value, record, index) {
        if (!record.image) return <div>-</div>;
        return (
          <Image
            src={record.image}
            alt="Failed load image"
            width={100}
            height={100}
          />
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
      render: (val: CVEducationInterface) => {
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
    <Spin spinning={isValidating}>
      <Card>
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-5">
            <h1 className="font-medium text-base mr-5 md:text-xl">
              Pendidikan
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
                if (needReload) reloadEducation();
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
  row?: CVEducationInterface;
  onCloseModal: (needReload?: boolean) => void;
}) => {
  const userLogin = useUserLogin();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const [formState, setFormState] = useState<{
    is_graduated: boolean;
  }>({ is_graduated: props.row?.is_graduated ?? false });

  const onFinish = async () => {
    try {
      setIsLoading(true);
      const values = await form.validateFields();
      const formData = new FormData();
      for (const key in values) {
        if (values[key]) formData.append(key, values[key]);
      }
      if (props.row) formData.append("id", props.row.id);
      formData.append("users_id", `${userLogin?.id}`);
      formData.append("is_graduated", formState.is_graduated ? "1" : "0");
      if (values.image) formData.append("image", values.image.file);
      const response = await axios.post(`${baseAPIURL}/cv/education`, formData);

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
      name: props.row?.name,
      major: props.row?.major,
      field_of_study: props.row?.field_of_study,
      start_date:
        props.row?.start_date && moment(new Date(props.row?.start_date)),
      end_date: props.row?.end_date && moment(new Date(props.row?.end_date)),
    });
    return () => {};
  }, [form, props.row]);

  return (
    <Modal
      title="Form Pendidikan"
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
          <Form.Item name="name" label="Nama" rules={[{ required: true }]}>
            <Input placeholder="Universitas Bina Sarana Informatika" />
          </Form.Item>
          <Form.Item name="major" label="Jurusan" rules={[{ required: true }]}>
            <Input placeholder="Sistem Informasi, Rekayasa Perangkat Lunak" />
          </Form.Item>
          <Form.Item
            name="field_of_study"
            label="Bidang Pendidikan"
            rules={[{ required: true }]}
          >
            <Input placeholder="SMA/SMK Sederajat, D3, S1" />
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
                    return { ...prevState, is_graduated: true };
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
                if (!e.target.checked) {
                  form.setFieldValue("end_date", undefined);
                }
                setFormState((prevstate) => {
                  return { ...prevstate, is_graduated: e.target.checked };
                });
              }}
            >
              Sudah Lulus
            </Checkbox>
          </Form.Item>
          <Form.Item label="Image" name="image">
            <Upload
              accept=".jpg, .png, .jpeg"
              maxCount={1}
              beforeUpload={async (file, listfile) => false}
            >
              <Button icon={<UploadOutlined />}>Upload Gambar</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default EducationPage;
