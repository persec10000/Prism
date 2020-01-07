import React from 'react';
import {View, ActivityIndicator, Text} from 'react-native';
import {Dialog} from 'react-native-simple-dialogs';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';

import {Colors, dialogStyle} from '../themes';

const WaitMessage = (props) => {
    const {message = 'Please Wait..', visible = false, onTouchOutside = () => {}} = props;
    return (
        <Dialog
            dialogStyle={dialogStyle}
            visible={visible}
            onTouchOutside={onTouchOutside}
            supportedOrientations={['portrait', 'landscape']}
            {...props}
        >
             <View style={{ marginTop: -10, alignItems: 'center', justifyContent: 'center', }}>
                 <View
                     style={{
                         backgroundColor: 'transparent',
                         marginTop: 20, flexDirection: 'row',
                         justifyContent: 'center',
                         alignItems: 'center'
                     }}>
                     <ActivityIndicator
                         color={Colors.mainColor}
                         size='large'
                     />
                     <Text style={{ marginLeft: 15, fontSize: moderateScale(17), color: Colors.mainColor, fontWeight: "bold" }}>{message}</Text>
                 </View>
             </View>
        </Dialog>
    );
};


export default WaitMessage;
