import "react-quill/dist/quill.snow.css";

import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Space,
  Spin,
  Table,
  TableColumnsType,
  Tag,
  Upload,
} from "antd";
import Search from "antd/lib/input/Search";
import axios from "axios";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { v4 as uuidv4 } from "uuid";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import useUserLogin from "../../../hooks/use_userlogin";
import { CVPortfolioInterface } from "../../../interface/cv/cvportfolio_interface";
import { baseAPIURL } from "../../../utils/constant";
import { stringToSlug } from "../../../utils/function";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface DataSourceInterface {
  no: number;
  title: string;
  slug: string;
  tags?: string;
  thumbnail?: string;
  created_at: string;
  updated_at: string;
  action: CVPortfolioInterface;
}

const portfolioFetcher = async (url: string) => {
  const request = await axios.get(`${url}`);
  const {
    data,
    success,
  }: { data: CVPortfolioInterface[] | undefined; success: boolean } =
    request.data;
  return data;
};

const PortfolioPage = () => {
  const userLogin = useUserLogin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [row, setRow] = useState<CVPortfolioInterface | undefined>(undefined);
  const [queryParam, setQueryParam] = useState<{
    limit?: number;
    offset?: number;
  }>();

  const {
    data: dataPortfolio,
    mutate: reloadPortfolio,
    isValidating,
  } = useSWR([`${baseAPIURL}/cv/portfolio/${userLogin?.id}`], portfolioFetcher);

  const deleteHandler = async (id: string) => {
    Modal.confirm({
      title: "Are you sure delete this row ?",
      maskClosable: false,
      onOk: async () => {
        const request = await axios.delete(`${baseAPIURL}/cv/portfolio/${id}`);
        const { success, message, data } = request.data;
        notification.success({
          message: "Success",
          description: message,
        });
        reloadPortfolio();
      },
      onCancel: async () => {},
    });
  };

  const dataSource: DataSourceInterface[] =
    dataPortfolio?.map((val, index) => {
      return {
        no: index + 1,
        title: val.title,
        slug: val.slug,
        tags: val.tags,
        thumbnail: val.thumbnail,
        created_at: new Date(val.created_at).toDateString(),
        updated_at: new Date(val.updated_at).toDateString(),
        action: val,
      };
    }) ?? [];

  const columns: TableColumnsType<DataSourceInterface> = [
    { key: "no", dataIndex: "no", title: "No" },
    { key: "title", dataIndex: "title", title: "Judul" },
    { key: "slug", dataIndex: "slug", title: "Slug" },
    {
      key: "tags",
      dataIndex: "tags",
      title: "Tags",
      width: 300,
      render(value, record, index) {
        if (!record.tags) return <></>;
        const parseTags: string[] = JSON.parse(record.tags);
        return parseTags.map((val) => (
          <Tag key={val} color="green" className="my-1">
            {val}
          </Tag>
        ));
      },
    },
    {
      key: "thumbnail",
      dataIndex: "thumbnail",
      title: "Thumbnail",
      render(value, record, index) {
        if (!record.thumbnail) return <div>-</div>;
        return (
          <Image
            src={record.thumbnail}
            alt="Failed load thumbnail"
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
      render: (val: CVPortfolioInterface) => {
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
              Portofolio
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
                if (needReload) reloadPortfolio();
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
  row?: CVPortfolioInterface;
  onCloseModal: (needReload?: boolean) => void;
}) => {
  const userLogin = useUserLogin();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState<{
    tags: string[];
    urls: string[];
  }>({
    tags: props.row?.tags ? JSON.parse(props.row.tags) : [],
    urls: props.row?.urls.map((val) => val.id) ?? [],
  });

  const onFinish = async () => {
    try {
      setIsLoading(true);
      const values = await form.validateFields();

      const formData = new FormData();
      for (const key in values) {
        if (values[key]) formData.append(key, values[key]);
      }

      if (formState.urls.length != 0) {
        const temp: any = [];
        formState.urls.forEach((urlID, index) => {
          const nameurl = values[`nameurl_${urlID}`];
          const contenturl = values[`contenturl_${urlID}`];
          temp.push({ nameurl, contenturl });
        });
        formData.append("urls", JSON.stringify(temp));
      }

      formData.set("users_id", `${userLogin?.id}`);
      if (props.row) formData.set("id", props.row.id);
      if (formState.tags.length != 0) {
        formData.set("tags", JSON.stringify(formState.tags));
      }
      if (values.thumbnail) formData.set("thumbnail", values.thumbnail.file);
      const response = await axios.post(`${baseAPIURL}/cv/portfolio`, formData);

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
      title: props.row?.title,
      slug: props.row?.slug,
      description: props.row?.description,
    });

    return () => {};
  }, [form, props.row]);

  return (
    <Modal
      title="Form Portfolio"
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
            name="title"
            label="Judul"
            rules={[{ required: true, message: "Judul tidak boleh kosong" }]}
          >
            <Input
              placeholder="Masukkan judul"
              onKeyUp={(e) => {
                const val = (e.target as HTMLInputElement).value;
                form.setFieldValue("slug", stringToSlug(val.trim()));
              }}
            />
          </Form.Item>
          <Form.Item
            name="slug"
            label="Slug"
            help={"Slug akan tergenerate ketika judul diketik"}
            rules={[{ required: true, message: "Slug tidak boleh kosong" }]}
          >
            <Input placeholder="zeffry-reynando-so-handsome" readOnly />
          </Form.Item>
          <Form.Item label="Thumbail" name="thumbnail">
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
              label="Deskripsikan tentang portofolio kamu"
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

          <div className="flex flex-col space-y-5">
            <div className="flex flex-row justify-between items-center ">
              <div className="text-lg font-semibold">Sosial Media</div>
              <Button
                type="ghost"
                icon={<PlusOutlined />}
                onClick={(e) => {
                  setFormState((prevState) => {
                    return {
                      ...prevState,
                      urls: [...prevState.urls, uuidv4()],
                    };
                  });
                }}
              >
                Tambah URL
              </Button>
            </div>
            <div>
              {formState.urls.map((val, index: number) => {
                const url = props.row?.urls.find((url) => url.id == val);
                return (
                  <Row key={val} gutter={24}>
                    <Col span={11}>
                      <Form.Item
                        initialValue={url?.name}
                        name={`nameurl_${val}`}
                        label="Nama"
                      >
                        <Input placeholder="Github, Google Playstore, Appstore, Behave, Dribble" />
                      </Form.Item>
                    </Col>
                    <Col span={11}>
                      <Form.Item
                        initialValue={url?.url}
                        name={`contenturl_${val}`}
                        label="URL"
                      >
                        <Input placeholder="https://github.com/zgramming" />
                      </Form.Item>
                    </Col>
                    <Col
                      span={2}
                      className="flex flex-col justify-center items-center"
                    >
                      <Button
                        type="link"
                        icon={<DeleteOutlined />}
                        className="text-red-500"
                        onClick={(e) => {
                          setFormState((prevState) => {
                            return {
                              ...prevState,
                              urls: [
                                ...prevState.urls.filter((url) => url != val),
                              ],
                            };
                          });
                        }}
                      />
                    </Col>
                  </Row>
                );
              })}
            </div>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default PortfolioPage;
