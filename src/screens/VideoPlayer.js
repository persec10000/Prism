import React, {Component} from "react"
import {Dialog} from 'react-native-simple-dialogs';
import { moderateScale } from 'react-native-size-matters';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    ToastAndroid,
    AlertIOS, BackHandler, WebView,
    View, Dimensions, Image, PanResponder,
    AsyncStorage,
    ActivityIndicator
} from 'react-native';
import {
    Container,
    Title,
    Content,
    Button,
    Card,
    CardItem,
    Thumbnail,
    Left,
    Body,
    Right,
    IconNB,
    Label,
    Input,
    Form, FooterTab, Footer,
    Row, CheckBox, Col
} from "native-base";
import Video from 'react-native-video';
import RNFetchBlob from 'react-native-fetch-blob'
import Orientation from 'react-native-orientation';
import VideoPlayer from 'react-native-video-controls';
import FS from 'react-native-fs';

import api from '../api'
import {UserInactivity, Header} from '../Components';
import {GoLogin} from '../Helpers';
import { Colors, Fonts, Images, dialogStyle } from '../themes';
import {Toast} from '../Helpers';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

var UserID;
var UserEmailID, url;
const {
    width: deviceScreenWidth,
    height: deviceScreenHeight
} = Dimensions.get('window');
let aspectRatio = deviceScreenWidth / deviceScreenHeight;

const DownloadMessage = (props) => {
    const {message = 'File is getting downloaded..', visible = false, onTouchOutside = () => {}} = props;
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

export default class LocalVideo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rate: 1,
            volume: 1,
            muted: false,
            resizeMode: 'contain',
            duration: 0.0,
            currentTime: 0.0,
            paused: true,
            show: false,
            path: null,
            LoadingDialog: true,
        };
        this.focus = false
        this.timer = null;
    }

    componentWillUnmount() {
        this.focusListener.remove()
        this.blurListener.remove()
        this.back_componentWillUnmount()
        Orientation.getOrientation((err, orientation) => {
        });
        this.removeFile();
    }

    removeFile() {
        const {path} = this.state;
        if (path) {
            FS.exists(path).then(() => {
                FS.unlink(path);
            });
        }
    }
    
    async componentWillMount() {
        UserID = await AsyncStorage.getItem('ID');
        UserEmailID = await AsyncStorage.getItem('EmailID');
        { this.setState({ paused: !this.state.paused }) }
        this.openFile();
        this.back_componentDidMount()
    }

    async openFile() {
        var params = this.props.navigation.state.params;
        let dirs = RNFetchBlob.fs.dirs;
        RNFetchBlob.config({
            fileCache : true,
            path : dirs.DocumentDir +'/1.mp4'
        })
        .fetch('GET', api.View_URL +"?FileName=" + params.DocumentGuid + "&Email=" + UserEmailID + "&UserId=" + UserID, {
        })
        .then((res) => {
            url = `file://${res.data}`;
            this.setState({
                path: res.data,
                show :true,
                LoadingDialog: false
            });
        });

        // url = api.View_URL +"?FileName=" + params.DocumentGuid + "&Email=" + UserEmailID + "&UserId=" + UserID;
    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener("didFocus", () => {
            this.focus = true
        });
        this.blurListener = this.props.navigation.addListener("didBlur", () => {
            this.focus = false
        });
        this.setState({ paused: !this.state.paused });
        this.back_componentDidMount();
        this.timer = setInterval(() => {
            this.checkInternetConnection();
        }, 1000);
    }

    checkInternetConnection() {
        if (!this.props.screenProps.isConnected()) {
            if (this.timer) clearTimeout(this.timer);
            GoLogin(this.props.navigation);
        }
    }

    video = null

    onLoad = (data) => {
        this.setState({ duration: data.duration });
    };

    onProgress = (data) => {
        this.setState({ currentTime: data.currentTime });
    };

    onEnd = () => {
        this.setState({ paused: true })
        this.video.seek(0)
    };

    onAudioBecomingNoisy = () => {
        this.setState({ paused: true })
    };

    onAudioFocusChanged = (event) => {
        this.setState({ paused: !event.hasAudioFocus })
    };

    getCurrentTimePercentage() {
        if (this.state.currentTime > 0) {
            return parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
        }
        return 0;
    };

    renderRateControl(rate) {
        const isSelected = (this.state.rate === rate);

        return (
            <TouchableOpacity onPress={() => { this.setState({ rate }) }}>
                <Text style={[styles.controlOption, { fontWeight: isSelected ? 'bold' : 'normal' }]}>
                    {rate}x
            </Text>
            </TouchableOpacity>
        );
    }

    renderResizeModeControl(resizeMode) {
        const isSelected = (this.state.resizeMode === resizeMode);

        return (
            <TouchableOpacity onPress={() => { this.setState({ resizeMode }) }}>
                <Text style={[styles.controlOption, { fontWeight: isSelected ? 'bold' : 'normal' }]}>
                    {resizeMode}
                </Text>
            </TouchableOpacity>
        )
    }

    renderVolumeControl(volume) {
        const isSelected = (this.state.volume === volume);

        return (
            <TouchableOpacity onPress={() => { this.setState({ volume }) }}>
                <Text style={[styles.controlOption, { fontWeight: isSelected ? 'bold' : 'normal' }]}>
                    {volume * 100}%
          </Text>
            </TouchableOpacity>
        )
    }

    backPress() {
        { this.setState({ paused: !this.state.paused }) }
        { this.props.navigation.goBack() }

    }


    //exit app start//
    onButtonPress = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        // then navigate
        navigate('NewScreen');
    }

    handleBackButton = () => {
        { this.setState({ paused: !this.state.paused }) }
        { this.props.navigation.goBack() }
        // this.props.navigation.navigate('MyDownloads')
        return true;
    }

    back_componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    back_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        if (this.timer) clearTimeout(this.timer);
    }
    //exit app end//  
    render() {
        const flexCompleted = this.getCurrentTimePercentage() * 100;
        const flexRemaining = (1 - this.getCurrentTimePercentage()) * 100;
        return (
            <UserInactivity
                onInactivity={(active)=> {
                    if (!active && this.focus) {
                    GoLogin(this.props.navigation)
                }
                }}
            >
                <View style={styles.container}>
                    <Header type="back" title="Video" navigation={this.props.navigation}/>
                    {this.state.show &&
                        <View style={styles.videocontainer}>
                            {/*<WebView
                                source={{ uri: url }}
                                renderLoading={this.renderLoadingView} startInLoadingState={true}
                                style={styles.WebView} /> */}
                            <VideoPlayer
                                showOnStart={true}
                                source={{ uri: url }}
                                navigator={ this.props.navigation }
                                videoStyle={{backgroundColor: 'white'}}
                                onError={(error)=>{
                                }}
                            />
                        </View>
                    }
                </View>
                <DownloadMessage
                    visible={this.state.LoadingDialog}
                    onTouchOutside={() => this.setState({ LoadingDialog: true })}
                />
            </UserInactivity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        width:"100%",
        height:"100%"
    },
    videocontainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#F5FCFF',
        height:200,
    },
    fullScreen: {
        position: 'relative',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});
