import React, {Component} from 'react';
import {Platform, Text} from 'react-native';
import {ActionSheetCustom} from 'react-native-custom-actionsheet';
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet'

const wrapper = (props, ref) => {
    if (Platform.OS === 'android') {
        return (
            <ActionSheetCustom {...props} ref={ref}/>
        );
    }
    else {
        const {options} = props;
        const optionsSimple = options.map((item) => {
            let value = '';
            if (typeof item === 'string') value = item;
            else if (typeof item === 'object' && 'component' in item) {
                value = item.component;
            }
            return value;
        });
        return (
            <ActionSheet {...props} options={optionsSimple} ref={ref}/>
        );
    }
};

export default React.forwardRef(wrapper);
