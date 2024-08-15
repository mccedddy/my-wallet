import { toast } from "react-toastify";

const toastSuccess = (message = "Success") => {
  return toast.success(message, {
    className: "custom-toast",
  });
};

const toastError = (message = "Error") => {
  return toast.error(message, {
    className: "custom-toast",
  });
};

const toastWarn = (message = "Warning") => {
  return toast.warn(message, {
    className: "custom-toast",
  });
};

const toastInfo = (message = "Info") => {
  return toast.info(message, {
    className: "custom-toast",
  });
};

const toastDefault = (message = "Default") => {
  return toast(message, {
    className: "custom-toast",
  });
};

export { toastSuccess, toastError, toastWarn, toastInfo, toastDefault };
