import React from "react"
import {
    Image,
    View,
    StyleSheet,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
    Linking,
    Alert,
    Platform,
    AsyncStorage,
    NativeModules,
    TextInput,
    ListView,
    ActivityIndicator,
    FlatList,
    ToastAndroid,
    AlertIOS,
    PanResponder,
    BackHandler,
    Text,
    TouchableHighlight,
    PermissionsAndroid
} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob'
import { Dialog } from 'react-native-simple-dialogs'
import api from '../api'
import Pdf from 'react-native-pdf';
import * as mime from 'react-native-mime-types';
import { Colors, Fonts, Images, dialogStyle } from '../themes';
import {CurrentDateTime, GoLogin} from '../Helpers';
import {WaitMessage, Header} from '../Components';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

let res;
var UserID;
var UserEmailID;
export default class PDFExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            scale: 1,
            numberOfPages: 0,
            horizontal: false,
            show :false,
            LoadingDialog:true,
            isLoading: true
        };
        this.pdf = null;
    }

    componentWillUnmount() {
        this.back_componentWillUnmount()
    }

    async componentDidMount () {
        UserID = await AsyncStorage.getItem('ID');
        UserEmailID = await AsyncStorage.getItem('EmailID');
        { this.setState({ paused: !this.state.paused }) }
        this.check_permission();
        this.back_componentDidMount();
        this.checkInternetConnection();
    }

    checkInternetConnection() {
        if (!this.props.screenProps.isConnected) {
            setTimeout(() => {
                GoLogin(this.props.navigation);
            }, 1000);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.screenProps.isConnected !== nextProps.screenProps.isConnected && !nextProps.screenProps.isConnected) {
            this.checkInternetConnection();
        }
    }

    prePage = () => {
        let prePage = this.state.page > 1 ? this.state.page - 1 : 1;
        this.setState({ page: prePage });
    };

    nextPage = () => {
        let nextPage = this.state.page + 1 > this.state.numberOfPages ? this.state.numberOfPages : this.state.page + 1;
        this.setState({ page: nextPage });
    };

    zoomOut = () => {
        let scale = this.state.scale > 1 ? this.state.scale / 1.2 : 1;
        this.setState({ scale: scale });
    };

    zoomIn = () => {
        let scale = this.state.scale * 1.2;
        scale = scale > 3 ? 3 : scale;
        this.setState({ scale: scale });
    };

    switchHorizontal = () => {
        this.setState({ horizontal: !this.state.horizontal, page: this.state.page });
    };

     //exit app start//
    onButtonPress = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        navigate('NewScreen');
    }

    handleBackButton = () => {
        this.props.navigation.goBack();
        return true;
    }

    back_componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    back_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    
    check_permission = () => {
        let that = this
        async function Permission() {
            //Calling the permission function
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
              {
                title: 'AndoridPermission download Permission',
                message: 'AndoridPermission App needs access to your download',
              }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              that.openFile();
            } else {
              alert('WRITE_EXTERNAL_STORAGE Permission Denied.');
            }
          }
          if (Platform.OS === 'android') {
            Permission();
          } else {
            this.openFile();
          }
    }
    openFile = async() => {
        var params = this.props.navigation.state.params;
        console.log("receivevalue",params)
        UserEmailID = await AsyncStorage.getItem('EmailID');
        let dirs = RNFetchBlob.fs.dirs;
        const mimetype = mime.lookup(params.DocumentGuid);
        console.log("mimetype====>",mimetype)
        const datetime = CurrentDateTime();
        const email = encodeURIComponent(`${UserEmailID} - ${datetime}`);
        console.log(`${api.View_URL}?FileName=${params.DocumentGuid}&Email=${email}&UserId=${UserID}`);
        // RNFetchBlob
		// .config({
		// 	addAndroidDownloads : {
		// 		useDownloadManager : true,
		// 		description : 'File that will be installed',
		// 		mime : mimetype,
		// 		mediaScannable : true,
		// 		notification : true,
		// 		path : dirs.DownloadDir + '/' + params.DocumentGuid
		// 	}
		// })
        RNFetchBlob.config({
            fileCache : true,
            appendExt : 'pdf',
            path : dirs.DocumentDir +'/'+params.DocumentGuid
        })
        .fetch('GET', `${api.View_URL}?FileName=${params.DocumentGuid}&Email=${email}&UserId=${UserID}`, {
        })
        .then((res) => {
            console.log('The file saved to ', res)
            setTimeout(() => {
                this.setState({ isLoading: false ,LoadingDialog:false, path: res.data, show :true})
            }, 3000);
        })
    }
    render() {
        return (
            <View style={{flex: 1}}>
                <Header type="back" title="View File" navigation={this.props.navigation}/>
            <View style={styles.container}>
                {this.state.LoadingDialog == false &&
                <View style={{ flexDirection: 'row' }}>
                    <TouchableHighlight disabled={this.state.page === 1}
                        style={this.state.page === 1 ? styles.btnDisable : styles.btn}
                        onPress={() => this.prePage()}>
                        <Text style={styles.btnText}>{'-'}</Text>
                    </TouchableHighlight>
                    <View style={styles.btnText}><Text style={styles.btnText}>Page</Text></View>
                    <TouchableHighlight disabled={this.state.page === this.state.numberOfPages}
                        style={this.state.page === this.state.numberOfPages ? styles.btnDisable : styles.btn}
                        onPress={() => this.nextPage()}>
                        <Text style={styles.btnText}>{'+'}</Text>
                    </TouchableHighlight>
                    <TouchableHighlight disabled={this.state.scale === 1}
                        style={this.state.scale === 1 ? styles.btnDisable : styles.btn}
                        onPress={() => this.zoomOut()}>
                        <Text style={styles.btnText}>{'-'}</Text>
                    </TouchableHighlight>
                    <View style={styles.btnText}><Text style={styles.btnText}>Scale</Text></View>
                    <TouchableHighlight disabled={this.state.scale >= 3}
                        style={this.state.scale >= 3 ? styles.btnDisable : styles.btn}
                        onPress={() => this.zoomIn()}>
                        <Text style={styles.btnText}>{'+'}</Text>
                    </TouchableHighlight>
                    <View style={styles.btnText}><Text style={styles.btnText}>{'View:'}</Text></View>
                    <TouchableHighlight style={styles.btn} onPress={() => this.switchHorizontal()}>
                        {!this.state.horizontal ? (<Text style={styles.btnText}>{'Book'}</Text>) : (
                            <Text style={styles.btnText}>{'Slide'}</Text>)}
                    </TouchableHighlight>

                </View>
                        }
                {this.state.show == true &&
                <Pdf ref={(pdf) => {
                    this.pdf = pdf;
                }}
                    source={{uri:this.state.path}}
                    page={this.state.page}
                    scale={this.state.scale}
                    horizontal={this.state.horizontal}
                    onLoadComplete={(numberOfPages, filePath) => {
                        this.state.numberOfPages = numberOfPages; //do not use setState, it will cause re-render
                    }}
                    onPageChanged={(page, numberOfPages) => {
                        this.state.page = page; //do not use setState, it will cause re-render
                    }}
                    onError={(error) => {
                        this.setState({ LoadingDialog: false }, () => {
                            Platform.select({
                                ios: () => { AlertIOS.alert("File not in PDF format or corrupted."); },
                                android: () => { ToastAndroid.show("File not in PDF format or corrupted.", ToastAndroid.SHORT); }
                            })();
                        });
                    }}
                    style={styles.pdf} />
                }

                <WaitMessage
                    visible={this.state.LoadingDialog}
                    onTouchOutside={() => this.setState({ LoadingDialog: false })}
                />
            </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    btn: {
        margin: 2,
        padding: 2,
        backgroundColor: "aqua",
    },
    btnDisable: {
        margin: 2,
        padding: 2,
        backgroundColor: "gray",
    },
    btnText: {
        margin: 2,
        padding: 2,
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
    }
});