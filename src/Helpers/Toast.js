import {Platform, AlertIOS, ToastAndroid} from 'react-native';

const Toast = (message) => {
    if (Platform.OS === 'ios') return AlertIOS.alert(message);
    else return ToastAndroid.show(message, ToastAndroid.SHORT);
};

export default Toast;
