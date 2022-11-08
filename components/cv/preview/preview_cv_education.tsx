import { CVEducationInterface } from "../../../interface/cv/cveducation_interface";

export const CVEducation = (props: { education?: CVEducationInterface[] }) => {
  return (
    <div className="flex flex-col ">
      <div className="text-lg font-semibold border-solid border-0 border-b-4 border-primary mb-5">
        EDUCATION
      </div>
      {props.education?.map((val, index) => {
        const startDate = new Date(val.start_date);
        const endDate = val.end_date && new Date(val.end_date);

        const readableStartDate = startDate.getFullYear().toString();
        const readableEndDate = endDate?.getFullYear()?.toString() ?? "Present";

        return (
          <div key={val.id} className="flex flex-row space-x-2">
            <div>{index + 1}.</div>
            <div className="w-full flex flex-row items-center justify-between ">
              <div className="flex flex-col">
                <div className="font-bold text-base">{val.major}</div>
                <div className="font-semibold text-sm text-gray-500">
                  {val.name} - {val.field_of_study}
                </div>
              </div>
              <div className="text-xs font-bold">
                {readableStartDate} - {readableEndDate}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
