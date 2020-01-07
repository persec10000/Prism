import React, { Component } from "react";
import {
    View,
    TouchableOpacity,
    Alert,
    BackHandler,
    Platform,
    ToastAndroid,
    AlertIOS,
    Dimensions,
    AsyncStorage
} from "react-native";
import {Text} from "native-base";
import Textarea from 'react-native-textarea';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import {Fonts} from '../themes'
import api from '../api'
import {WaitMessage, UserInactivity, ActionSheet, Header} from '../Components';
import {GoLogin, ellipsis} from '../Helpers';
var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

export default class SubPending extends React.Component {
    static navigationOptions = {
        header: null
        //headerMode: 'none'
    };
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            ID: "",
            UserName: "",
            RoleID: "",
            FirstName: "",
            LastName: "",
            EmailID: "",
            Download: "",
            UserID: null,
            Upload: "",
            LoadingDialog:true,
            focus:false,
            dataSource: [],
            remarks:'',
            text:''
        };
        this.focus = false
        this.timer = null;
    }
    
    onButtonPress(text) {
        let UserAction = text;
        let params = this.props.navigation.state.params ;
        let workspaceid = params.workspaceid;
        let UserId = params.UserId;
        let HumanTaskid = params.HumanTaskid;
        let body = {
            Workspaceid: workspaceid,
            UserId: UserId,
            HumanTaskid: HumanTaskid,
            UserAction: UserAction,
            Remarks: this.state.remarks
        }
            let self = this;
            let url = api.UpdateTask		 
            try{
                fetch(url,{
                    method: 'POST',
                    headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body)}
                )
                .then((response) =>response.json())
                .then((responseJson) => {
                    if (responseJson.IsSuccess == '1')
                    {
                        Platform.select({
                            ios: () => { AlertIOS.alert(responseJson.Message); },
                            android: () => { ToastAndroid.show(responseJson.Message, ToastAndroid.SHORT); }
                        })();
                        this.setState({ remarks:''});
                        this.props.navigation.goBack();
                    }
                    if (responseJson.IsSuccess == '0')
                    {
                        Platform.select({
                            ios: () => { AlertIOS.alert(responseJson.Message); },
                            android: () => { ToastAndroid.show(responseJson.Message, ToastAndroid.SHORT); }
                        })();
                        this.setState({ remarks:''});
                        this.props.navigation.goBack();
                    }
                })
            }
            catch (e) {
                Alert.alert(e.message);
            }
    }
 
    async viewFile() {
        let params = this.props.navigation.state.params ;
        let item =params.item;
        let res = item.DocumentPath.split('\\').reverse();
        console.log(res[0]);
        UserID = await AsyncStorage.getItem('ID');
        UserEmailID = await AsyncStorage.getItem('EmailID');
        if (item.Documenttype.toLowerCase() == ".mp3") {
            this.setState({
                showMp3Player: true,
                itemUrl: api.View_URL +"?FileName=" + item.DocumentGuid + "&Email=" + UserEmailID + "&UserId=" + UserID,
            });
        }
        else {
            if (item.Documenttype.toLowerCase() == ".mp4" || item.Documenttype.toLowerCase() == ".wma"){
                this.props.navigation.navigate("VideoPlayer",{ DocumentGuid : item.DocumentName,DocumentType: item.DocumentType})
            } else{
                this.props.navigation.navigate("ViewFile",{ DocumentGuid : res[0]})
            }
        }
    }

    handleBackButton = () => {
        this.props.navigation.goBack(null)       
        return true;
    }
    componentDidMount() {       
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);      
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    
    render() {
        return (
            <View style={styles.container}>
                <Header type="back" title="PENDING REQUEST" navigation={this.props.navigation}/>
                    <Textarea
                        containerStyle={styles.textareaContainer}
                        style={styles.textarea}
                        onChangeText={(text) => { this.setState({remarks: text}) }}
                        returnKeyType={'go'}
                        defaultValue={this.state.remarks}
                        placeholder={'Input commment'}
                        placeholderTextColor='white'
                        underlineColorAndroid={'transparent'}
                    />
                <View style={{marginTop: 30, marginLeft:20, marginRight: 20}}>
                    <View style={styles.fullWidth1}>
                        <TouchableOpacity activeOpacity={0.70}
                            onPress={() => this.viewFile()}>
                            <View style={styles.signinView}>
                                <Text style={styles.signinText}>
                                    View
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>                  
                </View>
                <View style={{flexDirection: 'row', marginTop: 30}}>
                    <View style={styles.fullWidth}>
                        <TouchableOpacity activeOpacity={0.70}
                            onPress={() => this.onButtonPress(true)}>
                            <View style={styles.signinView1}>
                                <Text style={styles.signinText}>
                                    Approve
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.fullWidth}>
                        <TouchableOpacity activeOpacity={0.70}
                            onPress={() => this.onButtonPress(false)}>
                            <View style={styles.signinView2}>
                                <Text style={styles.signinText}>
                                    Reject
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
               
                {/* <WaitMessage
                    visible={this.state.LoadingDialog}
                    onTouchOutside={() => this.setState({ LoadingDialog: true })}
                /> */}
            </View>
        );
    }
}

const styles = ScaledSheet.create({
    container: {
        height: '100%',
        backgroundColor: '#285A7F'
    },
	logo: {
		position: 'absolute',
		right: 0,
		bottom: 0,
		width: '140@ms',
		height: '59@ms',
	},
	logoLight: {
		position: 'absolute',
		right: 0,
		bottom: 0,
		width: '350@s',
		height: '680@s',
    },
    // 116DC2
    fullWidth1: {
        alignItems:'center'
    },
    fullWidth: {
        width: '50%',
        alignItems:'center'
    },
    signinView: {
		width: width*0.8,
        height: '40@ms0.2',
        justifyContent: 'center',
		backgroundColor: '#0583F7',
		borderRadius: 10
    },
    signinView1: {
		width: 130,
        height: '35@ms0.2',
        justifyContent: 'center',
		backgroundColor: '#00A95D',
		borderRadius: 10
    },
    signinView2: {
		width: 130,
        height: '35@ms0.2',
        justifyContent: 'center',
		backgroundColor: '#BF1F15',
		borderRadius: 10
    },
    signinText: {
		fontFamily: Fonts.base,
		fontSize: '15@ms',
		color: '#FFF',
		textAlign: 'center'
    },
    textareaContainer: {
        width:'95%',
        height: 180,
        margin: 10,
        borderRadius: 10,
        backgroundColor: '#F5FCFF',
    },
    textarea: {
        textAlignVertical: 'top',  // hack android
        height: 170,
        margin: 15,
        fontSize: 16,
        color: '#000',
    },
});

