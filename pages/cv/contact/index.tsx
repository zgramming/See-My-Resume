import { Card, Space, Spin, Table, TableColumnsType } from "antd";
import Search from "antd/lib/input/Search";
import axios from "axios";
import { useState } from "react";
import useSWR from "swr";
import useUserLogin from "../../../hooks/use_userlogin";
import { CVContactInterface } from "../../../interface/cv/cvcontact_interface";
import { baseAPIURL } from "../../../utils/constant";
interface DataSourceInterface {
  no: number;
  email: string;
  subject: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const contactFetcher = async (url: string) => {
  const request = await axios.get(`${url}`);
  const {
    data,
    success,
  }: { data: CVContactInterface[] | undefined; success: boolean } =
    request.data;
  return data;
};

const ContactPage = () => {
  const userLogin = useUserLogin();

  const [queryParam, setQueryParam] = useState<{
    limit?: number;
    offset?: number;
  }>();

  const {
    data: dataContact,
    mutate: reloadContact,
    isValidating,
  } = useSWR([`${baseAPIURL}/cv/contact/user_id/${userLogin?.id}`], contactFetcher);

  const dataSource: DataSourceInterface[] =
    dataContact?.map((val, index) => {
      return {
        no: index + 1,
        email: val.email_sender,
        subject: val.subject_sender,
        content: val.content_sender,
        created_at: new Date(val.created_at).toDateString(),
        updated_at: new Date(val.updated_at).toDateString(),
      };
    }) ?? [];

  const columns: TableColumnsType<DataSourceInterface> = [
    { key: "no", dataIndex: "no", title: "No" },
    { key: "email", dataIndex: "email", title: "Email" },
    { key: "subject", dataIndex: "subject", title: "Subjek" },
    { key: "content", dataIndex: "content", title: "Kontent" },
    { key: "created_at", dataIndex: "created_at", title: "Created At" },
    { key: "updated_at", dataIndex: "updated_at", title: "UpdatedA At" },
  ];

  return (
    <Spin spinning={isValidating}>
      <Card>
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-5">
            <h1 className="font-medium text-base mr-5 md:text-xl">Kontak</h1>
            <Space wrap></Space>
          </div>
          <div className="flex flex-wrap items-center space-x-2 mb-5">
            <Search
              placeholder="Cari sesuatu..."
              onSearch={(e) => ""}
              className="w-48"
              allowClear
            />
          </div>
          <Table
            columns={columns}
            dataSource={dataSource}
            scroll={{ x: 2000 }}
            pagination={{
              total: dataSource.length,
              pageSize: queryParam?.limit,
              showSizeChanger: true,
              onShowSizeChange: (current, size) => {
                setQueryParam((val) => {
                  return { ...val, limit: size };
                });
              },
            }}
          />
        </div>
      </Card>
    </Spin>
  );
};

export default ContactPage;
