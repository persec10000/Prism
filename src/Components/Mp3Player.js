import React, {Component} from 'react';
import {View, Image, TouchableOpacity, AppState, Platform} from 'react-native';
import {Text} from 'native-base';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import RNFetchBlob from 'react-native-fetch-blob';
import { Dialog } from 'react-native-simple-dialogs';
import Sound from 'react-native-sound';
import FS from 'react-native-fs';

import {Colors, dialogStyle} from '../themes';
import api from '../api'
import Toast, {DURATION} from 'react-native-easy-toast'

const play = require('../images/play.png')
const pause = require('../images/pause.jpg')

class Mp3Player extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            play: pause,
            appState: AppState.currentState,
            tmpMp3File: null,
        };

        this.sound = null;

        this.handleAppStateChange = this.handleAppStateChange.bind(this);
    }

    componentDidMount() {
        AppState.addEventListener('change', this.handleAppStateChange);
        this.autoplay();
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange);
        this.removeFile();
        this.cancel();
    }

    handleAppStateChange(nextAppState) {
        if (this.state.appState.match(/inactive|active/) && nextAppState === 'background') {
            if (this.sound) this.cancel();
        }
        this.setState({appState: nextAppState});
    }

    removeFile() {
        const {tmpMp3File} = this.state;
        if (tmpMp3File) {
            FS.exists(tmpMp3File).then(() => {
                FS.unlink(tmpMp3File);
            });
        }
    }
    
    cancel() {
        const {onClose = () => {}} = this.props;
        this.sound.release();
        this.sound.stop();
        onClose();
    }

    pause() {
        if (this.state.play == pause){
            this.setState({play : play})
            this.sound.pause();
        } else {
            this.setState({play : pause})
            this.sound.play();
        }
    }

    stop() {
        this.setState({play : play})
        this.sound.stop();
    }

    play() {
        this.sound.play();
    }

    autoplay() {
        const {url} = this.props;
        if (Platform.OS === 'ios') {
            let dirs = RNFetchBlob.fs.dirs;
            RNFetchBlob.config({
                fileCache : true,
                path : dirs.DocumentDir +'/1.mp3'
            })
            .fetch('GET', url, {
            })
            .then((res) => {
                const file = `file://${res.data}`;
                this.setState({
                    tmpMp3File: res.data,
                });
                this.sound = new Sound(file, null, (error) => {
                    if (error) this.refs.toast.show('Error, please try again later');
                    this.sound.play();
                });
            });
        }
        else {
            this.sound = new Sound(url, null, (error) => {
                if (error) this.refs.toast.show('Error, please try again later');
                this.sound.play();
            });
        }
    }

    render() {
        const {visible, onTouchOutside = () => {}} = this.props;
        return (
            <Dialog
                dialogStyle={dialogStyle}
                visible={visible}
                supportedOrientations={['portrait', 'landscape']}
                onTouchOutside={onTouchOutside}
            >
                <View>
                    <Text style={styles.title}>Playing Mp3 file</Text>
                    <View style={styles.button}>
                            <TouchableOpacity onPress={() => this.pause("pause")}>
                                <Image style={styles.buttonIcon}
                                source={this.state.play} />
                            </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => this.cancel()} style={styles.cancelContainer}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
                <Toast ref="toast"/>
            </Dialog>
        );
    }
}

const styles = ScaledSheet.create({
    title: {
        marginLeft: 15,
        fontSize: '17@ms',
        color: Colors.mainColor,
        fontWeight: "bold",
        textAlign:'center',
    },
    button: {
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection:"row"
    },
    buttonIcon: {
        resizeMode: "contain", 
        width: '40@ms0.3',
        height: '40@ms0.3',
        margin: 10,
    },
    cancelContainer: {
        alignSelf: "center",
        width: "40%",
        margin: 5,
        backgroundColor: 'white',
        borderRadius: 30,
        height: 45,
        justifyContent:'center',
        alignItems:'center'
    },
    cancelText: {
        fontSize: '18@ms',
        color:"#000",
        fontWeight: 'bold',
        textAlign:'center'
    },
});

export default Mp3Player;
