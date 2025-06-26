import { message } from "antd";

const success = (mess = "Success", duration = 2) => {
  message.success(mess, duration);
};

const error = (mess = "Error", duration = 2) => {
  message.error(mess, duration);
};

const warning = (mess = "Warning", duration = 2) => {
  message.warning(mess, duration);
};

const info = (mess = "Info", duration = 2) => {
  message.info(mess, duration);
};

const notify = (type = "info", mess = "", duration = 2) => {
  message[type](mess, duration);
};

export { success, error, warning, info, notify };
