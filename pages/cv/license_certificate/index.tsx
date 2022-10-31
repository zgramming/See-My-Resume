import {
  DeleteOutlined,
  EditOutlined,
  FilePdfOutlined,
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
import { parse } from "path";
import { useEffect, useState } from "react";
import useSWR from "swr";

import useUserLogin from "../../../hooks/use_userlogin";
import { CVLicenseCertificateInterface } from "../../../interface/cv/cvlicensecertificate_interface";
import { baseAPIURL } from "../../../utils/constant";

interface DataSourceInterface {
  no: number;
  name: string;
  publisher: string;
  url?: string;
  credential?: string;
  start_date: string;
  end_date?: string;
  file?: string;
  created_at: string;
  updated_at: string;
  action: CVLicenseCertificateInterface;
}

const licenseCertificateFetcher = async (url: string) => {
  const request = await axios.get(`${url}`);
  const {
    data,
    success,
  }: { data: CVLicenseCertificateInterface[] | undefined; success: boolean } =
    request.data;
  return data;
};

const LicenseCertificatePage = () => {
  const userLogin = useUserLogin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [row, setRow] = useState<CVLicenseCertificateInterface | undefined>(
    undefined
  );
  const [queryParam, setQueryParam] = useState<{
    limit?: number;
    offset?: number;
  }>();

  const {
    data: dataLicenseCertificate,
    mutate: reloadLicenseCertificate,
    isValidating,
  } = useSWR(
    [`${baseAPIURL}/cv/license_certificate/${userLogin?.id}`],
    licenseCertificateFetcher
  );

  const deleteHandler = async (id: string) => {
    Modal.confirm({
      title: "Are you sure delete this row ?",
      maskClosable: false,
      onOk: async () => {
        const request = await axios.delete(
          `${baseAPIURL}/cv/license_certificate/${id}`
        );
        const { success, message, data } = request.data;
        notification.success({
          message: "Success",
          description: message,
        });
        reloadLicenseCertificate();
      },
      onCancel: async () => {},
    });
  };

  const dataSource: DataSourceInterface[] =
    dataLicenseCertificate?.map((val, index) => {
      return {
        no: index + 1,
        name: val.name,
        publisher: val.publisher,
        url: val.url,
        credential: val.credential,
        start_date: new Date(val.start_date).toDateString(),
        end_date: val.end_date && new Date(val.end_date).toDateString(),
        file: val.file,
        created_at: new Date(val.created_at).toDateString(),
        updated_at: new Date(val.updated_at).toDateString(),
        action: val,
      };
    }) ?? [];

  const columns: TableColumnsType<DataSourceInterface> = [
    { key: "no", dataIndex: "no", title: "No" },
    { key: "name", dataIndex: "name", title: "Nama" },
    { key: "publisher", dataIndex: "publisher", title: "Penerbit" },
    { key: "url", dataIndex: "url", title: "URL" },
    { key: "credential", dataIndex: "credential", title: "Kredential" },
    { key: "start_date", dataIndex: "start_date", title: "Mulai" },
    { key: "end_date", dataIndex: "end_date", title: "Selesai" },
    {
      key: "file",
      dataIndex: "file",
      title: "File",
      render(value, record, index) {
        const { ext } = parse(record.file ?? "");
        if (ext == ".pdf")
          return <Button type="link" icon={<FilePdfOutlined />} danger />;
        if ([".png", ".jpeg", ".jpg"].includes(ext))
          return (
            <Image
              src={record.file ?? ""}
              alt="image"
              width={100}
              height={100}
              className="rounded-lg"
            />
          );
        if (ext == "") return <div>Tidak ada file</div>;
        return <Button type="link">Lihat file</Button>;
      },
    },

    { key: "created_at", dataIndex: "created_at", title: "Created At" },
    { key: "updated_at", dataIndex: "updated_at", title: "UpdatedA At" },
    {
      key: "action",
      dataIndex: "action",
      title: "Aksi",
      width: 100,
      render: (val: CVLicenseCertificateInterface) => {
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
              Lisensi & Sertifikat
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
          <Search
            placeholder="Cari sesuatu..."
            onSearch={(e) => ""}
            className="w-48"
            allowClear
          />
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
                if (needReload) reloadLicenseCertificate();
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
  row?: CVLicenseCertificateInterface;
  onCloseModal: (needReload?: boolean) => void;
}) => {
  const userLogin = useUserLogin();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState<{
    is_expired: boolean;
  }>({ is_expired: props.row?.is_expired ?? false });

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
      formData.append("is_expired", formState.is_expired ? "1" : "0");
      if (values.file) formData.append("file", values.file.file);

      const response = await axios.post(
        `${baseAPIURL}/cv/license_certificate`,
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
      name: props.row?.name,
      publisher: props.row?.publisher,
      credential: props.row?.credential,
      url: props.row?.url,
      start_date:
        props.row?.start_date && moment(new Date(props.row.start_date)),
      end_date: props.row?.end_date && moment(new Date(props.row.end_date)),
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
          <Form.Item
            name="name"
            label="Nama"
            rules={[{ required: true, message: "Nama tidak boleh kosong" }]}
          >
            <Input placeholder="Menjadi Flutter Developer Expert, Javascript Basic" />
          </Form.Item>
          <Form.Item
            name="publisher"
            label="Penerbit"
            rules={[{ required: true, message: "Penerbit tidak boleh kosong" }]}
          >
            <Input placeholder="Dicoding" />
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
                /// Unchecked [is_expired] when [end_date] is filled
                if (datestring != "") {
                  setFormState((prevState) => {
                    return { ...prevState, is_expired: false };
                  });
                }
              }}
            />
          </Form.Item>
          <Form.Item>
            <Checkbox
              name="is_expired"
              checked={formState.is_expired}
              onChange={(e) => {
                ///  set undefined [end_date] when checked
                if (e.target.checked) {
                  form.setFieldValue("end_date", undefined);
                }
                setFormState((prevstate) => {
                  return { ...prevstate, is_expired: e.target.checked };
                });
              }}
            >
              Tidak ada kadaluarsa
            </Checkbox>
          </Form.Item>
          <Form.Item name="url" label="URL" rules={[{ type: "url" }]}>
            <Input placeholder="https://google.com" />
          </Form.Item>
          <Form.Item name="credential" label="Kredensial">
            <Input placeholder="Masukkan Kredensial" />
          </Form.Item>
          <Form.Item label="File" name="file">
            <Upload
              accept=".pdf, .jpg, .png, .jpeg"
              maxCount={1}
              beforeUpload={async (file, listfile) => false}
            >
              <Button icon={<UploadOutlined />}>Upload File</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default LicenseCertificatePage;
