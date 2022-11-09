import {
  Button,
  Card,
  Form,
  Input,
  Menu,
  Modal,
  notification,
  Spin,
} from "antd";
import { ItemType } from "antd/lib/menu/hooks/useItems";
import axios from "axios";
import { useRouter } from "next/router";
import { destroyCookie, setCookie } from "nookies";
import { useEffect, useState } from "react";
import useSWR from "swr";

import {
  EditOutlined,
  LogoutOutlined,
  PieChartOutlined,
} from "@ant-design/icons";

import useUserLogin from "../../hooks/use_userlogin";
import { getItem } from "../../interface/layout/menu_items_interface";
import { AppAccessMenu, Users } from "../../interface/main_interface";
import { baseAPIURL, keyLocalStorageLogin } from "../../utils/constant";
import { HandleErrorForm } from "../../utils/error_form";

const accessibleMenuFetcher = async (url: string, route?: any) => {
  const request = await axios.get(`${url}`, { params: { route } });
  const { data, success }: { data: AppAccessMenu[]; success: boolean } =
    request.data;

  return data;
};

const currentPathHandler = (path: string): string => {
  const [first, second, third] = path
    .split("/")
    .filter((route) => route.length !== 0);

  /// We assume when `third` is undefined, this is sub menu
  return !third ? `/${first}/${second}` : `/${first}/${second}/${third}`;
};

const ProfileLogin = (props: { user?: Users }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      name: props.user?.name,
    });
    return () => {};
  }, [form, props.user]);

  const onFinish = async (val: any) => {
    try {
      const { name } = await form.validateFields();
      const { data, status } = await axios.put(
        `${process.env.NEXT_PUBLIC_BASEAPIURL}/setting/user/update_name/${props.user?.id}`,
        { name }
      );
      const {
        data: dataResponse,
        message,
        success,
      }: { data: Users; message: string; success: true } = data;
      setCookie(null, keyLocalStorageLogin, JSON.stringify(dataResponse));
      notification.success({
        message: "Success Update",
        description: message,
      });

      setIsModalOpen(false);
    } catch (error: any) {
      HandleErrorForm(error);
    }
  };
  return (
    <>
      <Card
        style={{ margin: 0, padding: 0 }}
        bodyStyle={{
          margin: 0,
          padding: 0,
        }}
      >
        <div className="flex flex-col items-center justify-center p-2 font-bold">
          <div className="">{props.user?.name}</div>
          <div className="font-thin">{props.user?.email}</div>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={(e) => setIsModalOpen(true)}
          />
        </div>
      </Card>
      {isModalOpen && (
        <Modal
          title="Update User"
          open={isModalOpen}
          maskClosable={false}
          keyboard={false}
          closable={false}
          onCancel={(e) => setIsModalOpen(false)}
          footer={
            <Spin spinning={false}>
              <Button onClick={(e) => setIsModalOpen(false)}>Batal</Button>
              <Button
                htmlType="submit"
                form="form_update_name"
                className="bg-success text-white"
              >
                Simpan
              </Button>
            </Spin>
          }
        >
          <Form
            form={form}
            name="form_update_name"
            id="form_update_name"
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item label="Name" name="name" rules={[{ required: false }]}>
              <Input type="text" placeholder="Name" />
            </Form.Item>
          </Form>
        </Modal>
      )}
    </>
  );
};

const SiderMenu = (props: {}) => {
  const user = useUserLogin();
  const { pathname, push, replace, route } = useRouter();
  const [currentPath, setCurrentPath] = useState(currentPathHandler(pathname));
  const [items, setItems] = useState<ItemType[]>([]);

  const { data: dataAccessibleMenu, error: errorAccessibleMenu } = useSWR(
    [
      `${baseAPIURL}/setting/access_menu/by_user_group/${
        user?.app_group_user_id ?? 0
      }`,
      route,
    ],
    accessibleMenuFetcher
  );

  useEffect(() => {
    if (dataAccessibleMenu) {
      const mapping = dataAccessibleMenu.map((menu, index) => {
        /// Kondisi ketika menu punya parent
        if (menu.app_menu.route.startsWith("?")) {
          const children = menu.app_menu.menu_childrens.map((child) =>
            getItem(child.route, child.name, <PieChartOutlined />)
          );

          const result = getItem(
            menu.app_menu.route,
            menu.app_menu.name,
            <PieChartOutlined />,
            children
          );
          return result;
        } else {
          /// Kondisi ketika menu tidak punya parent

          /// Check apakah dalam kondisi ini, terdapat menu yang punya parent
          /// Jika ada return null, karena asumsi kita menu ini hanya satu tingkat
          if (menu.app_menu.app_menu_id_parent) return null;
          return getItem(
            menu.app_menu.route,
            menu.app_menu.name,
            <PieChartOutlined />
          );
        }
      });
      setItems(mapping);
    }
    return () => {};
  }, [dataAccessibleMenu]);

  /// Listen every change route path name
  useEffect(() => {
    const path = currentPathHandler(pathname);
    setCurrentPath(path);
    return () => {};
  }, [pathname]);

  return (
    <div className="flex flex-col ">
      <Menu
        theme="light"
        mode="inline"
        items={items}
        selectedKeys={[currentPath]}
        onClick={(e) => {
          /// Jangan lakukan push jika character pertama === "?"
          /// Ini dilakukan untuk meng-akomodir sub menu
          if (e.key[0] === "?") return false;

          const path = currentPathHandler(e.key);
          setCurrentPath(path);
          push(path);
        }}
      />
      <ProfileLogin user={user} />
      <Button
        type="primary"
        htmlType="button"
        className="m-5"
        icon={<LogoutOutlined />}
        danger
        onClick={async (e) => {
          destroyCookie(null, keyLocalStorageLogin);
          replace("/login");
        }}
      >
        Logout
      </Button>
    </div>
  );
};

export default SiderMenu;

//   const sideItems = [
//     getItem(
//       "/setting/user_group",
//       "Management Group User",
//       <PieChartOutlined />
//     ),
//     getItem("/setting/user", "Management User", <PieChartOutlined />),
//     getItem("/setting/modul", "Modul", <PieChartOutlined />),
//     getItem("/setting/menu", "Menu", <PieChartOutlined />),
//     getItem("/setting/access_modul", "Access Modul", <PieChartOutlined />),
//     getItem("/setting/access_menu", "Access Menu", <PieChartOutlined />),
//     getItem(
//       "/setting/master_category",
//       "Master Kategori",
//       <PieChartOutlined />
//     ),
//     getItem("/setting/documentation", "Dokumentasi", <PieChartOutlined />),
//     getItem("/setting/parameter", "Parameter", <PieChartOutlined />),
//     getItem("?/setting/parent", "Parent Menu", <PieChartOutlined />, [
//       getItem("/setting/parent/child_first", "Child 1"),
//       getItem("/setting/parent/child_second", "Child 2"),
//     ]),
//   ];
