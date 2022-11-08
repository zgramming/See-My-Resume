import { CVSkillInterface } from "../../../interface/cv/cvskill_interface";

export const CVSkill = (props: { skill?: CVSkillInterface[] }) => {
  return (
    <div className="flex flex-col">
      <div className="text-lg font-semibold border-solid border-0 border-b-4 border-primary mb-5">
        SKILLS
      </div>
      <div className="flex flex-wrap mb-5">
        {props.skill?.map((val) => (
          <div
            key={val.id}
            className="rounded text-white text-sm font-medium  p-1 m-1"
            style={{
              backgroundColor: `${val.level.parameter1_value}`,
            }}
          >
            {val.name}
          </div>
        ))}
      </div>
    </div>
  );
};
