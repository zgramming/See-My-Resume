import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  notification,
  Popover,
  Select,
  Space,
  Spin,
} from "antd";
import Search from "antd/lib/input/Search";
import axios from "axios";
import { useEffect, useState } from "react";
import useSWR from "swr";

import {
  DeleteOutlined,
  EditOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import useIsMobile from "../../../hooks/use_ismobile_hooks";
import useUserLogin from "../../../hooks/use_userlogin";
import { CVSkillInterface } from "../../../interface/cv/cvskill_interface";
import { MasterData } from "../../../interface/main_interface";
import { baseAPIURL } from "../../../utils/constant";

const skillFetcher = async (url: string) => {
  const request = await axios.get(`${url}`);
  const {
    data,
    success,
  }: { data: CVSkillInterface[] | undefined; success: boolean } = request.data;
  return data;
};

const masterLevelFetcher = async (url: string, code: string) => {
  const request = await axios.get(`${url}?master_category_code=${code}`);
  const {
    data,
    success,
  }: { data: MasterData[] | undefined; success: boolean } = request.data;
  return data;
};

const SkillPage = () => {
  const userLogin = useUserLogin();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const isMobile = useIsMobile();

  const {
    data: dataSkill,
    mutate: reloadSkill,
    isValidating: isLoadingSkill,
  } = useSWR([`${baseAPIURL}/cv/skill/${userLogin?.id}`], skillFetcher);

  const { data: dataMasterLevel, isValidating: isLoadingMasterLevel } = useSWR(
    [`${baseAPIURL}/setting/master_data`, "LEVEL_SKILL"],
    masterLevelFetcher
  );

  useEffect(() => {
    return () => {};
  }, [userLogin]);

  const onFinish = async () => {
    try {
      const values = await form.validateFields();
      const data = { ...values, users_id: userLogin?.id };
      const response = await axios.post(`${baseAPIURL}/cv/skill`, data);
      const { data: dataResponse, message, success } = response.data;
      notification.success({
        message: "Success",
        description: message,
      });
      reloadSkill();
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
    <Spin spinning={isLoadingSkill || isLoading}>
      <Card>
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-5">
            <h1 className="font-medium text-base mr-5 md:text-xl">Skill</h1>
          </div>
          <div className="flex flex-wrap items-center space-x-2 mb-5">
            <Search
              placeholder="Cari sesuatu..."
              onSearch={(e) => ""}
              className="w-48"
              allowClear
            />
          </div>
          <Form
            form={form}
            name="form_validation"
            id="form_validation"
            layout={isMobile ? "vertical" : "inline"}
            onFinish={onFinish}
          >
            <Form.Item
              name="name"
              label="Nama"
              rules={[{ required: true, message: "Nama tidak boleh kosong" }]}
            >
              <Input
                placeholder="Marketing, Komunikasi, Programming"
                className="w-52"
              />
            </Form.Item>
            <Form.Item
              name="level_id"
              label="Level"
              rules={[{ required: true, message: "Level tidak boleh kosong" }]}
            >
              <Select
                className="w-auto md:min-w-[10rem]"
                defaultValue={{
                  value: "",
                  label: "Pilih",
                }}
                onChange={(value: any) => {}}
              >
                <Select.Option value={""}>Pilih</Select.Option>
                {dataMasterLevel?.map((val, index) => {
                  return (
                    <Select.Option key={val.id} value={val.id}>
                      {val.name}
                    </Select.Option>
                  );
                }) ?? []}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="submit"
                form="form_validation"
                className="bg-success text-white"
              >
                Tambah Skill
              </Button>
            </Form.Item>
          </Form>
          <div className="my-10">
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {dataSkill?.map((val) => {
                return (
                  <ListSkill
                    key={val.id}
                    skill={val}
                    onCloseModal={(needReload) => {
                      if (needReload) reloadSkill();
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </Card>
    </Spin>
  );
};

const ListSkill = (props: {
  skill: CVSkillInterface;
  onCloseModal: (needReload?: boolean) => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const deleteHandler = async (id: string) => {
    Modal.confirm({
      title: "Are you sure delete this row ?",
      maskClosable: false,
      onOk: async () => {
        const request = await axios.delete(`${baseAPIURL}/cv/skill/${id}`);
        const { success, message, data } = request.data;
        notification.success({
          message: "Success",
          description: message,
        });
        props.onCloseModal(true);
      },
      onCancel: async () => {},
    });
  };
  return (
    <>
      {isModalOpen && (
        <FormModal
          open={isModalOpen}
          row={props.skill}
          onCloseModal={(needReload) => {
            setIsModalOpen(false);
            props.onCloseModal(needReload);
          }}
        />
      )}
      <Card
        key={props.skill.id}
        headStyle={{ color: "white" }}
        title={props.skill.level.name}
        extra={
          <Popover
            open={isPopupOpen}
            onOpenChange={(visible) => setIsPopupOpen(visible)}
            content={
              <Space className="">
                <Button
                  type="primary"
                  shape="round"
                  icon={<EditOutlined />}
                  size={"small"}
                  onClick={(e) => {
                    setIsPopupOpen(false);
                    setIsModalOpen(true);
                  }}
                />
                <Button
                  type="primary"
                  shape="round"
                  icon={<DeleteOutlined />}
                  size={"small"}
                  danger
                  onClick={(e) => {
                    setIsPopupOpen(false);
                    deleteHandler(props.skill.id);
                  }}
                />
              </Space>
            }
            title="Operasi"
            trigger="click"
          >
            <Button size="small" type="text" icon={<SettingOutlined />} />
          </Popover>
        }
        style={{
          color: "white",
          backgroundColor: `${props.skill.level.parameter1_value}`,
        }}
      >
        <div className="flex flex-row justify-center items-center">
          <span className="text-xl text-center">{props.skill.name}</span>
        </div>
      </Card>
    </>
  );
};

const FormModal = (props: {
  open: boolean;
  row?: CVSkillInterface;
  onCloseModal: (needReload?: boolean) => void;
}) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { data: dataMasterLevel, isValidating: isLoadingMasterLevel } = useSWR(
    [`${baseAPIURL}/setting/master_data`, "LEVEL_SKILL"],
    masterLevelFetcher
  );
  const onFinish = async () => {
    try {
      setIsLoading(true);
      const values = await form.validateFields();
      const data = {
        ...values,
        users_id: props.row?.users_id,
        id: props.row?.id,
      };
      const response = await axios.post(`${baseAPIURL}/cv/skill`, data);

      const { data: dataResponse, message, success } = response.data;
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
      name: props.row?.name ?? "",
      level_id: props.row?.level_id ?? "",
    });
    return () => {};
  }, [form, props.row]);

  return (
    <Modal
      title="Form Skill"
      open={props.open}
      maskClosable={false}
      keyboard={false}
      closable={false}
      onCancel={(e) => props.onCloseModal()}
      footer={
        <Spin spinning={isLoading}>
          <Button onClick={(e) => props.onCloseModal()}>Batal</Button>
          <Button
            htmlType="submit"
            form="form_validation_modal"
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
          name="form_validation_modal"
          id="form_validation_modal"
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="name"
            label="Nama"
            rules={[{ required: true, message: "Nama tidak boleh kosong" }]}
          >
            <Input
              placeholder="Marketing, Komunikasi, Programming"
              className="w-52"
            />
          </Form.Item>
          <Form.Item
            name="level_id"
            label="Level"
            rules={[{ required: true, message: "Level tidak boleh kosong" }]}
          >
            <Select
              className="w-auto md:min-w-[10rem]"
              defaultValue={{
                value: "",
                label: "Pilih",
              }}
              onChange={(value: any) => {}}
            >
              <Select.Option value={""}>Pilih</Select.Option>
              {dataMasterLevel?.map((val, index) => {
                return (
                  <Select.Option key={val.id} value={val.id}>
                    {val.name}
                  </Select.Option>
                );
              }) ?? []}
            </Select>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default SkillPage;
