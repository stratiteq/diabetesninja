import { Toast } from "native-base";

class ToastMessage {
  static showInfoMessage(infoMessage) {
    try {
      if (infoMessage) {
        Toast.show({
          text: infoMessage,
          position: "bottom",
          duration: 1500
        });
      }
    } catch (exception) {
      // TODO: handle navigation root log in error
    }
  }

  static showErrorMessage(errorMessage) {
    try {
      if (errorMessage) {
        Toast.show({
          text: errorMessage,
          position: "bottom",
          buttonText: "OK",
          type: "danger",
          duration: 60000
        });
      }
    } catch (exception) {
      // TODO: handle navigation root log in error
    }
  }
}

export default ToastMessage;
