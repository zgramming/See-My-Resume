import { parseCookies } from 'nookies';
import { useEffect, useState } from 'react';

import { Users } from '../interface/main_interface';
import { keyLocalStorageLogin } from '../utils/constant';

const useUserLogin = () => {
  const [user, setUser] = useState<Users | undefined>();
  useEffect(() => {
    const cookies = parseCookies();
    const user = JSON.parse(cookies[keyLocalStorageLogin]);
    setUser(user);
    return () => {};
  }, []);

  return user;
};

export default useUserLogin;
