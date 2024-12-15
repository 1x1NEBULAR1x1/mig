import {Pressable, Text, TextInput, View} from "react-native";
import {useUIStore} from "../../../../stores/useUIStore";
import {sendVerificationCode} from "../../../../requests/load_data";

const RegisterMenu = () => {
  const uiStore = useUIStore(state => state)

  const handlePhoneInput = (text: string) => {

    text = text.replace(/[^\d+]/g, "");

    if (uiStore.phoneNumber === '') {
      text = "+7 " + text;
    }
    if (text.startsWith("+7")) {
      const digits = text.replace(/[^\d]/g, "");
      text = `+7 ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9, 11)}`.trim();
    }
    uiStore.setPhoneNumber(text);
  };

  const sendCode = () => {
    uiStore.setIsVerifying(true);
    const phoneNumber = uiStore.phoneNumber!.replaceAll(" ", '')
    sendVerificationCode('%2B' + phoneNumber.slice(1))
  }

  return (
    <View className="p-2 py-6 bg-white w-full h-auto flex-col gap-4 rounded-2xl">
      <Text className="text-black text-xl text-center">
        Зарегиструйтесь или войдите в аккаунт
      </Text>
      <TextInput
        className="w-full h-18 text-xl border-gray-300 border rounded-2xl px-2"
        placeholder="Введите ваш номер телефона"
        keyboardType="phone-pad"
        onChangeText={text => handlePhoneInput(text)}
        value={uiStore.phoneNumber}
      />
      <Pressable
        disabled={(uiStore.phoneNumber != undefined) && !(uiStore.phoneNumber.length === 16)}
        className={
          ((uiStore.phoneNumber != undefined) && !(uiStore.phoneNumber.length === 16))
            ? "bg-[#EEEFF3] p-2 px-4 rounded-full w-auto transition-all duration-150"
            : "bg-[#1B9F01] p-2 px-4 rounded-full w-auto transition-all duration-150"
        }
        onPress={sendCode}
      >
        <Text
          className="text-white text-xl text-center w-auto"
        >Войти</Text>
      </Pressable>
    </View>
  )
}

export default RegisterMenu