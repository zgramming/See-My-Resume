import { Menu, notification } from "antd";
import { Header } from "antd/lib/layout/layout";
import { ItemType } from "antd/lib/menu/hooks/useItems";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

import { PieChartOutlined } from "@ant-design/icons";

import useUserLogin from "../../hooks/use_userlogin";
import { getItem } from "../../interface/layout/menu_items_interface";
import { headerMenuFetcher } from "../../utils/fetcher_axios";

const currentPathHeaderHandler = (path: string): string => {
  const [first, second, third] = path
    .split("/")
    .filter((route) => route.length !== 0);

  return `/${first}`;
};

const HeaderMenu = () => {
  const user = useUserLogin();
  const { push, pathname } = useRouter();

  const [items, setItems] = useState<ItemType[]>([]);
  const [currentPath, setCurrentPath] = useState(
    currentPathHeaderHandler(pathname)
  );

  const { data: accessibleModul } = useSWR(
    [
      `${
        process.env.NEXT_PUBLIC_BASEAPIURL
      }/setting/access_modul/by_user_group/${user?.app_group_user_id ?? 0}`,
    ],
    headerMenuFetcher,
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

  return (
    <Header className="!bg-white ">
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
