import { notification } from "antd";

export const HandleErrorForm = (e: any) => {
  console.log({ error: e });
  const { message, status, type } = e?.response?.data || {};
  const errorNotification = {
    duration: 0,
    message: "Error",
    description: "Unknown Error Message",
  };
  if (type === "VALIDATION_ERROR") {
    const errors = (message as Array<any>).map(
      (val, index) => `${val.message}`
    );
    notification.error({
      ...errorNotification,
      description: (
        <ul className="list-decimal">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      ),
    });
    return;
  }

  notification.error({ ...errorNotification, description: message });
};
