import React, {Component} from 'react';
import {View, PanResponder} from 'react-native';
import VendorUserInactivity from 'react-native-user-inactivity';

const defaultTimeout = 180000;

class UserInactivity extends Component {
    /*state = {
        inactive: false
    };
    panResponder = {};
    timer = 0;

    componentWillMount() {
        const {onInactivity = () => {}} = this.props;

        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (e, gestureState) => {
                this.resetTimer();
                return true;
            },
            onMoveShouldSetPanResponder: () => true,
            onStartShouldSetPanResponderCapture: (e, gestureState) => {
                this.resetTimer();
                return false;
            },
            onMoveShouldSetPanResponderCapture: () => false,
            onPanResponderTerminationRequest: () => true,
            onShouldBlockNativeResponder: () => false,
        });
        this.resetTimer();
    }

    resetTimer() {
        const {timeForInactivity = defaultTimeout, onInactivity = () => {}} = this.props;
        clearTimeout(this.timer);
        if (this.state.inactive) this.setState({inactive:false});
        this.timer = setTimeout(() => {
            this.setState({inactive:true});
            onInactivity();
        }, timeForInactivity);
    }*/

    render2() {
        const {style = {}, children} = this.props;
        return (
            <View
                style={[{width: '100%', height: '100%'}, style]}
                collapsable={false}
                {...this.panResponder.panHandlers}
            >
                {children}
            </View>
        );
    }

    render() {
        const {style = {}, timeForInactivity = defaultTimeout, onInactivity, children} = this.props;
        return (
            <VendorUserInactivity
                style={[{width: '100%', height: '100%'}, style]}
                timeForInactivity={timeForInactivity}
                // checkInterval={1000}
                onAction={onInactivity}
            >
                {children}
            </VendorUserInactivity>
        );
    }
}

export default UserInactivity;
