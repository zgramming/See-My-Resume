import "antd/dist/antd.variable.min.css";
import "../styles/globals.css";

import { ConfigProvider } from "antd";
import { NextComponentType } from "next";
import { AppContext, AppInitialProps, AppLayoutProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import NextNProgress from "nextjs-progressbar";
import React, { ReactNode } from "react";

import AdminLayout from "../components/layout/layout";
import { primaryColor } from "../utils/constant";
import { convertRoutePathToArray } from "../utils/function";

const MyApp: NextComponentType<AppContext, AppInitialProps, AppLayoutProps> = ({
  Component,
  pageProps,
}: AppLayoutProps) => {
  const router = useRouter();
  const getLayout =
    Component.getLayout ||
    ((page: ReactNode) => <AdminLayout>{page}</AdminLayout>);

  /// Only get 3 first value from array
  const arrPathname = convertRoutePathToArray(router.asPath)
    .slice(0, 3)
    .map((val) => (val[0]?.toUpperCase() ?? "") + val.slice(1));

  ConfigProvider.config({
    theme: {
      primaryColor: primaryColor,
    },
  });

  return getLayout(
    <>
      <Head>
        <title>{arrPathname.join(" - ")}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <NextNProgress />
      <ConfigProvider>
        <Component {...pageProps} />
      </ConfigProvider>
    </>
  );
};

export default MyApp;
