import axios from "axios";
import { useRouter } from "next/router";
import useSWR from "swr";

import DefaultTemplatePDF from "../../../../../components/template_pdf/default/default_template_pdf";
import { Users } from "../../../../../interface/main_interface";
import { baseAPIURL } from "../../../../../utils/constant";

const previewPDFFetcher = async (url: string) => {
  const request = await axios.get(`${url}`);
  const { data, success }: { data: Users | undefined; success: boolean } =
    request.data;
  return data;
};

const Page = () => {
  const { query } = useRouter();
  const { user_id } = query;
  const { data: dataPreview, mutate: reloadPreview } = useSWR(
    [`${baseAPIURL}/cv/preview/pdf/user_id/${user_id}`],
    previewPDFFetcher
  );

  return <DefaultTemplatePDF user={dataPreview} />;
};

Page.getLayout = (page: any) => page;

export default Page;
