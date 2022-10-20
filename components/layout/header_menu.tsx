import { Menu, notification } from "antd";
import { Header } from "antd/lib/layout/layout";

import { PieChartOutlined } from "@ant-design/icons";

import { getItem } from "../../interface/layout/menu_items_interface";
import useSWR from "swr";
import axios from "axios";
import { AppAccessModul, Users } from "../../interface/main_interface";
import { useEffect, useState } from "react";
import { ItemType } from "antd/lib/menu/hooks/useItems";
import { useRouter } from "next/router";
import { keyLocalStorageLogin } from "../../utils/constant";

const headerFetcher = async (url: string, params?: any) => {
  const request = await axios.get(`${url}`);
  const { data, success }: { data: AppAccessModul[]; success: boolean } =
    request.data;

  return data;
};

const HeaderMenu = () => {
  const { push, pathname } = useRouter();
  const currentPathHeaderHandler = (path: string): string => {
    const [first, second, third] = path
      .split("/")
      .filter((route) => route.length !== 0);

    return `/${first}`;
  };

  const [user, setUser] = useState<Users | undefined>();
  const [items, setItems] = useState<ItemType[]>([]);
  const [currentPath, setCurrentPath] = useState(
    currentPathHeaderHandler(pathname)
  );

  //TODO: Change from cookies [app_group_user_id]
  const appGroupUserId = user?.app_group_user_id;
  const {
    data: accessibleModul,
    error,
    mutate,
  } = useSWR(
    [
      `${process.env.NEXT_PUBLIC_BASEAPIURL}/setting/access_modul/by_user_group/${appGroupUserId}`,
    ],
    headerFetcher,
    {
      onSuccess: (data, key) => {
        const mapping = data.map((val, index) => {
          return getItem(
            val.app_modul?.pattern ?? "",
            val.app_modul?.name,
            <PieChartOutlined />
          );
        });

        setItems(mapping);
      },
    }
  );

  /// Listen every change route path name
  useEffect(() => {
    const path = currentPathHeaderHandler(pathname);
    setCurrentPath(path);
    return () => {};
  }, [pathname]);

  useEffect(() => {
    if (typeof window !== undefined)
      setUser(JSON.parse(localStorage.getItem(keyLocalStorageLogin) ?? ""));
    return () => {};
  }, []);

  return (
    <Header className="bg-white">
      <Menu
        theme="light"
        mode="horizontal"
        items={items}
        className="flex justify-end"
        selectedKeys={[currentPath]}
        onClick={(info) => {
          const accessModul = accessibleModul?.find(
            (val) => val.app_modul?.pattern == info.key
          );
          const menus = accessModul?.app_modul?.menus;
          if (!menus || menus?.length == 0) {
            notification.error({
              message: `Tidak mempunyai akses menu pada modul ${accessModul?.app_modul?.name}`,
            });
            return false;
          }

          const pathMenu = menus[0].route;
          push(pathMenu);
        }}
      />
    </Header>
  );
};

export default HeaderMenu;
