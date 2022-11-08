import axios from "axios";
import { useRouter } from "next/router";
import useSWR from "swr";

import { CVEducation } from "../../../../../components/cv/preview/preview_cv_education";
import { CVExperience } from "../../../../../components/cv/preview/preview_cv_experience";
import { CVLicenseAndCertificate } from "../../../../../components/cv/preview/preview_cv_license_certificate";
import { CVProfile } from "../../../../../components/cv/preview/preview_cv_profile";
import { CVSkill } from "../../../../../components/cv/preview/preview_cv_skill";
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
    [`${baseAPIURL}/cv/preview/pdf/${user_id}`],
    previewPDFFetcher
  );

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="w-full min-h-[297mm] flex flex-col rounded p-5 lg:w-paper-A4">
          {/* Header */}
          <CVProfile
            profile={dataPreview?.CVProfile}
            email={dataPreview?.email}
            name={dataPreview?.name}
          />
          {/* Body -> Experience */}
          <div className="flex flex-col space-y-5 my-5">
            <CVExperience experience={dataPreview?.CVExperience} />
            <CVEducation education={dataPreview?.CVEducation} />
            <CVLicenseAndCertificate
              value={dataPreview?.CVLicenseCertificate}
            />
            <CVSkill skill={dataPreview?.CVSkill} />
          </div>
        </div>
      </div>
    </>
  );
};

Page.getLayout = (page: any) => page;

export default Page;
