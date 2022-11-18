import { parseCookies } from "nookies";
import { useEffect, useState } from "react";

import { Users } from "../interface/main_interface";
import { keyCookieAuth } from "../utils/constant";

const useUserLogin = () => {
  const [user, setUser] = useState<Users | undefined>();
  useEffect(() => {
    try {
      const cookies = parseCookies();
      const user = JSON.parse(cookies[keyCookieAuth]);
      setUser(user);
    } catch (error) {
      setUser(undefined);
    }
    return () => {};
  }, []);

  return user;
};

export default useUserLogin;
