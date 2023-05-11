import { notification } from "antd";

export const notify = (type, message) => {
  if (type === "error") {
    notification.error({
      message: "Error",
      description: message,
      placement: "topRight",
    });
  }else{
    notification.success({
        message: "Success",
        description: message,
        placement: "topRight",
    })
  }
};
