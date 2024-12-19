import { Alert } from "react-native";

export const ShowAreYouSureAlert = () => {
    return new Promise((resolve) => {
      Alert.alert(
        "Are you sure?",
        "",
        [
          {
            text: "No",
            onPress: () => resolve(false), 
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => resolve(true), 
          },
        ],
        { cancelable: false }
      );
    });
  };