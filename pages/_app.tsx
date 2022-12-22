import "antd/dist/reset.css";
import "../styles/globals.css";

import { ConfigProvider } from "antd";
import { NextComponentType } from "next";
import { AppContext, AppInitialProps, AppLayoutProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import NextNProgress from "nextjs-progressbar";
import React, { ReactNode, useEffect } from "react";

import AdminLayout from "../components/layout/layout";
import { primaryColor } from "../utils/constant";
import { convertRoutePathToArray } from "../utils/function";

const MyApp: NextComponentType<AppContext, AppInitialProps, AppLayoutProps> = ({
  Component,
  pageProps,
}: AppLayoutProps) => {
  const router = useRouter();

  useEffect(() => {
    
    return () => {};
  }, []);

  /// Only get 3 first value from array
  const arrPathname = convertRoutePathToArray(router.asPath)
    .slice(0, 3)
    .map((val) => (val[0]?.toUpperCase() ?? "") + val.slice(1));

  const getLayout =
    Component.getLayout ??
    ((page: ReactNode) => <AdminLayout>{page}</AdminLayout>);

  return getLayout(
    <>
      <Head>
        <title>{`SeeMyCV - ${arrPathname.join(" - ")}`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <NextNProgress />
      <ConfigProvider theme={{ token: { colorPrimary: primaryColor } }}>
        <Component {...pageProps} />
      </ConfigProvider>
    </>
  );
};

export default MyApp;
