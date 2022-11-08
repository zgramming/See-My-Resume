import { CVLicenseCertificateInterface } from "../../../interface/cv/cvlicensecertificate_interface";

export const CVLicenseAndCertificate = (props: {
  value?: CVLicenseCertificateInterface[];
}) => {
  return (
    <div className="flex flex-col">
      <div className="text-lg font-semibold border-solid border-0 border-b-4 border-primary mb-5">
        LICENSE & CERTIFICATE
      </div>
      {props.value?.map((val, index) => {
        const startDate = new Date(val.start_date);
        const endDate = val.end_date && new Date(val.end_date);
        const readableStartDate = startDate.toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
        const readableEndDate = endDate
          ? "Expire at " +
            endDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })
          : "No Expire";
        return (
          <div className="flex items-start space-x-2" key={val.id}>
            <div className="text-base">{index + 1}.</div>
            <div className="flex flex-col space-y-1">
              <div className="text-base font-bold">{val.name}</div>
              <div className="text-sm font-semibold">{val.publisher}</div>
              <div className="text-sm font-thin">
                Publish at {readableStartDate} {readableEndDate}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
