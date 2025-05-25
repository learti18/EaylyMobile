import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BaseToastProps } from "react-native-toast-message";

interface CustomToastProps extends BaseToastProps {
  text1?: string;
  text2?: string;
  bgColor: string;
  borderColor: string;
  textColor1: string;
  textColor2: string;
}

const ToastComponent = ({
  text1,
  text2,
  bgColor,
  borderColor,
  textColor1,
  textColor2,
}: CustomToastProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        marginTop: insets.top,
        backgroundColor: bgColor,
        borderColor: borderColor,
      }}
      className="flex-col items-start justify-center w-[90%] min-h-[52px] border p-3 rounded-lg self-center"
    >
      {text1 ? (
        <Text
          className="text-[14px] font-semibold mb-1"
          style={{ color: textColor1 }}
        >
          {text1}
        </Text>
      ) : null}
      {text2 ? (
        <Text className="text-[12px]" style={{ color: textColor2 }}>
          {text2}
        </Text>
      ) : null}
    </View>
  );
};

const toastConfig = {
  error: (props: CustomToastProps) => (
    <ToastComponent
      {...props}
      bgColor="#FEF3F2"
      borderColor="#D92D20"
      textColor1="#D92D20"
      textColor2="#B42318"
    />
  ),
  success: (props: CustomToastProps) => (
    <ToastComponent
      {...props}
      bgColor="#ECFDF3"
      borderColor="#ABEFC6"
      textColor1="#067647"
      textColor2="#05603A"
    />
  ),
  delete: (props: CustomToastProps) => (
    <ToastComponent
      {...props}
      bgColor="#FEF3F2"
      borderColor="#D92D20"
      textColor1="#D92D20"
      textColor2="#B42318"
    />
  ),
  info: (props: CustomToastProps) => (
    <ToastComponent
      {...props}
      bgColor="#F0F7FF"
      borderColor="#A0C4E2"
      textColor1="#0F52BA"
      textColor2="#0A3977"
    />
  ),
};

export default toastConfig;
