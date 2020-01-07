import React, { Component } from 'react';
import {
    StyleSheet, View, StatusBar, Image,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import {
    Colors,
    Fonts,
    Images
} from '../themes';

export default class Splash extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        try {
            setTimeout(() => {
                // const resetAction = NavigationActions.reset({
                //     index: 0,
                //     actions: [
                //         NavigationActions.navigate({ routeName: 'Login'})
                //     ],
                // });
                // this.props.navigation.dispatch(resetAction);
                this.props.navigation.navigate('Login');
            }, 500);
        } catch (error) {
        }
    }

    render() {
        return (
            <View style={styles.container} >
               	<StatusBar backgroundColor={Colors.mainColor} barStyle="light-content" />
                <Image style={{ width: "100%", height: "100%", }}
                    source={Images.splash} />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgb(130, 157, 181)'
    }
})