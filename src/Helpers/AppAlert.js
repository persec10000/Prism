import React from 'react';
import {Alert} from 'react-native';

const AppAlert = (props) => {
    const {title = '', subtitle = '', ok = () => {}, cancel = () => {}} = props;

    return Alert.alert(
        title,
        subtitle,
        [
            {
                text: 'cancel',
                onPress: () => {
                    cancel();
                }
            },
            {
                text: 'OK',
                onPress: () => {
                    ok();
                }
            },
        ],
        { cancelable: false }
    )
};

export default AppAlert;
