import { ReactNode } from "react";

import {
  GlobalOutlined,
  MailFilled,
  PhoneFilled,
  StarFilled,
} from "@ant-design/icons";

import { CVProfileInterface } from "../../../interface/cv/cvprofile_interface";

const InfoCV = (props: { icon: ReactNode; title: string }) => {
  return (
    <div className="flex flex-row items-center space-x-2 ">
      {props.icon && props.icon}
      <div className="text-xs">{props.title}</div>
    </div>
  );
};

export const CVProfile = (props: {
  name?: string;
  email?: string;
  profile?: CVProfileInterface;
}) => {
  return (
    <div className="flex flex-col space-y-2 pr-10">
      <div className="font-bold text-2xl">{props.name}</div>
      <div className="font-semibold text-lg">{props.profile?.motto}</div>
      <div className="font-thin text-xs text-gray-500 text-justify">
        {props.profile?.description}
      </div>
      <div className="flex flex-row space-x-3 py-2">
        {props.profile?.phone && (
          <InfoCV icon={<PhoneFilled />} title={props.profile.phone} />
        )}
        {props.email && <InfoCV icon={<MailFilled />} title={props.email} />}
        {props.profile?.web && (
          <InfoCV icon={<GlobalOutlined />} title={props.profile.web} />
        )}
        {props.profile?.address && (
          <InfoCV icon={<StarFilled />} title={props.profile.address} />
        )}
      </div>
    </div>
  );
};
