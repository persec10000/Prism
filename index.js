import React, {Component} from 'react';
import {AppRegistry, View, Text, NetInfo, StyleSheet} from 'react-native';
import { Client } from 'bugsnag-react-native';
import VDR from './src/Config';

const bugsnag = new Client();
export {bugsnag};
// bugsnag.notify(new Error("Test error"));
 
export let isConnectedStatus = true;
const isConnected = () => (isConnectedStatus);
export {isConnected};

class RootContainer extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            isConnected: true,
        };

        this.handleConnectionChange = this.handleConnectionChange.bind(this);
    }

    componentDidMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
        this.handleConnectionChange();
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
    }

    handleConnectionChange() {
        NetInfo.isConnected.fetch().done(
            (status) => {
                this.setState({ isConnected: status });
                isConnectedStatus = status;
            }
        );
    }

    render() {
        const {children} = this.props;
        const {isConnected} = this.state;
        return (
            <View style={styles.container}>
                <VDR isConnected={isConnected}/>
                {!isConnected && <View style={styles.messageContainer}>
                    <View style={styles.message}>
                        <Text style={styles.messageText}>Connect to the Internet</Text>
                    </View>
                </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    },
    messageContainer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        width: '100%',
        minHeight: 40,
    },
    message: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 70, 80, 0.7)',
        borderWidth: 0,
        borderRadius: 9,
        width: '70%',
        minHeight: 40,
    },
    messageText: {
        color: 'white',
        fontSize: 16,
    }
});

AppRegistry.registerComponent('Prism', () => RootContainer);
