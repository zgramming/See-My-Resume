import { notification } from "antd";
import jwt, { JwtPayload } from "jsonwebtoken";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";

import { Users } from "../interface/main_interface";
import { keyCookieAuth } from "../utils/constant";

const useUserLogin = () => {
  const { replace } = useRouter();
  const [user, setUser] = useState<Users | undefined>();
  useEffect(() => {
    try {
      const cookies = parseCookies();
      const { payload } = jwt.decode(cookies[keyCookieAuth]) as JwtPayload;
      const { user } = payload;
      setUser(user);
    } catch (error) {
      notification.error({
        message: "Unauthorized",
      });

      replace("/login");
    }
    return () => {};
  }, [replace]);

  return user;
};

export default useUserLogin;
