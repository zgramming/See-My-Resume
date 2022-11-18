import { Spin } from "antd";
import Image from "next/image";
import { useState } from "react";
import { GoogleLoginButton } from "react-social-login-buttons";

import BG from "../public/images/logo_color.png";
import { baseAPIURL } from "../utils/constant";

const LoginPage = () => {
  const [isLoading] = useState(false);

  return (
    <Spin spinning={isLoading}>
      <section className="min-h-screen flex flex-col justify-center bg-gray-200">
        <div className="flex flex-col lg:flex-row px-10">
          <div className="bg-white px-10 py-10 lg:basis-1/2">
            <div className="text-center">
              <div className="relative w-52 h-52 mx-auto">
                <Image
                  src={BG}
                  alt="Background Image"
                  className="rounded"
                  fill
                />
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <GoogleLoginButton
                onClick={() => {
                  window.open(`${baseAPIURL}/v1/google/callback`, "_self");
                }}
              />
            </div>
          </div>
          <div className="hidden lg:flex flex-col justify-center items-center rounded-tr-lg rounded-br-lg bg-primary lg:basis-1/2"></div>
        </div>
      </section>
    </Spin>
  );
};

LoginPage.getLayout = (page: any) => page;

export default LoginPage;
