import { CVExperienceInterface } from "../../../interface/cv/cvexperience_interface";

export const CVExperience = (props: {
  experience?: CVExperienceInterface[];
}) => {
  return (
    <div className="flex flex-col">
      <div className="text-lg font-semibold border-solid border-0 border-b-4 border-primary mb-5 ">
        EXPERIENCE
      </div>
      {props.experience?.map((val, index) => {
        const startDate = new Date(val.start_date);
        const monthStart = startDate.getMonth();
        const yearStart = startDate.getFullYear();

        const endDate = val.end_date ? new Date(val.end_date) : undefined;
        const monthEnd = endDate && endDate.getMonth();
        const yearEnd = endDate && endDate.getFullYear();

        const readableStartDate = `${
          monthStart.toString().length == 1 ? `0${monthStart}` : monthStart
        }/${yearStart}`;

        const readableEndDate = val.end_date
          ? `${
              monthEnd!.toString().length == 1 ? `0${monthEnd}` : monthEnd
            }/${yearEnd}`
          : "Present";

        return (
          <div key={val.id} className="flex flex-row space-x-2">
            <div>{index + 1}.</div>
            <div className="flex flex-col">
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-col">
                  <div className="font-bold text-base">{val.job}</div>
                  <div className="font-semibold text-sm text-gray-500">
                    {val.company}
                  </div>
                </div>
                <div className="text-xs font-bold">
                  {readableStartDate} - {readableEndDate}
                </div>
              </div>
              <div
                className="text-sm font-thin"
                dangerouslySetInnerHTML={{ __html: val.description }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
