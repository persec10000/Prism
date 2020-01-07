import React, { Component } from "react";
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
} from "react-native";
import {
    Container,
    Title,
    Content,
    Card,
    Button,
    CardItem,
    Text,
    Thumbnail,
    Left,
    FooterTab,
    Footer,
    Body,
    Right,
    IconNB
} from "native-base";
import { Dialog } from 'react-native-simple-dialogs';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';

import {
    Colors,
    Fonts,
    Images,
    dialogStyle,
} from '../themes'
import api from '../api'
import {WaitMessage, UserInactivity, ActionSheet, Header} from '../Components';
import {GoLogin, ellipsis} from '../Helpers';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height
const profileImage = 'https://hubbe.rs/uploads/connectedmug55x33jpg-50984.jpg'

const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4
const title = <Text style={{ color: 'crimson', fontSize: 18 }}>Which one do you like?</Text>

let ID, UserName, RoleID, FirstName, LastName, EmailID, Download, Upload, tempData;

export default class Homescreen extends React.Component {
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
            Upload: "",
            searchtrue: false,
            enable: false,
            selected: 1,
            timeWentInactive: null,
            LoadingDialog:true,
            focus:false,
            dataSource: []
        };
        this.focus = false
        this.timer = null;
    }
    
    // onButtonPress = () => {
    //     BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    //     // then navigate
    // }
    handleBackButton = () => {
        Alert.alert(
            'Prism',
            'Are you sure you want to exit from App?',
            [
                { text: 'cancel' },
                { text: 'OK', onPress: ()=>{
                    BackHandler.exitApp()
                }},
            ],
            { cancelable: false }
        )
        return true;
    }

    // componentDidMount() {
    //     this.focusListener = this.props.navigation.addListener("didFocus", () => {
    //         this.focus = true
    //     });
    //     this.blurListener = this.props.navigation.addListener("didBlur", () => {
    //         this.focus = false
    //     });
    //     BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    //     this.checkInternetConnection();
    //     this.timer = setInterval(() => {
    //         this.checkInternetConnection();
    //     }, 1000);
    // }
  

    componentWillUnmount() {
        // this.focusListener.remove()
        // this.blurListener.remove()
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }


    async componentWillMount() {
        ID = await AsyncStorage.getItem('ID');
        UserName = await AsyncStorage.getItem('UserName');
        RoleID = await AsyncStorage.getItem('RoleID');
        FirstName = await AsyncStorage.getItem('FirstName');
        LastName = await AsyncStorage.getItem('LastName');
        EmailID = await AsyncStorage.getItem('EmailID');
        Download = await AsyncStorage.getItem('Download');
        Upload = await AsyncStorage.getItem('Upload');
        if (ID != null || ID != undefined || ID != '') {
            this.setState({
                ID: ID,
                UserName: UserName,
                RoleID: RoleID,
                FirstName: FirstName,
                LastName: LastName,
                EmailID: EmailID,
                Download: Download,
                Upload: Upload,
            });
            this.GetAllVDR();
        }
        this.props.navigation.addListener("didFocus", () => {
            BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        });
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);       
    }

    async GetAllVDR() {
        await fetch(api.GetAllVdr_URL + "/" + this.state.ID + "/" + this.state.RoleID).then(res => res.json())
            .then(res => {
                if (res.IsSuccess == "1") {
                    this.setState({ isLoading: false ,LoadingDialog:false })
                    try {
                        let message = JSON.parse(res.Message);
                        console.log("111111=",message);
                        this.setState({
                            isLoading: false,
                            dataSource: message,
                        })
                    } catch (error) {
                        this.setState({ isLoading: false ,LoadingDialog:false })
                        Platform.select({
                            ios: () => { AlertIOS.alert("Error, try agian later"); },
                            android: () => { ToastAndroid.show("Error, try agian later", ToastAndroid.SHORT); }
                        })();
                    }
                } else {
                    Platform.select({
                        ios: () => { AlertIOS.alert(res.Message); },
                        android: () => { ToastAndroid.show(res.Message, ToastAndroid.SHORT); }
                    })();
                    this.setState({ isLoading: false ,LoadingDialog:false })
                }
                 this.setState({ isLoading: false ,LoadingDialog:false })
            })
         this.setState({ isLoading: false ,LoadingDialog:false })
    }

    search(text) {
        this.setState({ searchtrue: true , text:text })
        const { dataSource } = this.state;
        var text1 = text;
        var array = [], array1 = [];
        var i = 0;
        for (i; i < dataSource.length; i++) {
            if (dataSource[i].RepositoryName.toLowerCase().indexOf(text.toLowerCase()) >= 0) {
                array1.push(dataSource[i]);
            }
        }
        this.setState({ newdataSource: array1 })
    }

    render() {
        var _this = this;
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return (
            <UserInactivity
                onInactivity={(active)=> {
                    if (!active && this.focus) {
                    GoLogin(this.props.navigation)
                }
                }}
            >
            <View style={styles.container}>			
                <Header type="menu" title="PRISM" navigation={this.props.navigation}/>
                { this.state.dataSource.length > 0 &&
                <View style={{
                        backgroundColor: '#333333', width: '100%',
                        height: 60, marginTop: 5, flexDirection: 'row', alignItems: 'center'
                    }}>
                    <Image style={styles.searchIcon} source={Images.search} />
                    <TextInput
                        placeholder={"Search Repository"}//placeholder={"Document Name"}
                        placeholderTextColor="lightgray"
                        underlineColorAndroid={'transparent'}
                        onChangeText={(text) => this.search(text)}
                        returnKeyType={'go'}
                        value={this.state.text}
                        onFocus={() => this.setState({ focus:this.state.focus })}
                        style={styles.searchInput}
                        textColor="#fff" />
                    { this.state.searchtrue &&
                    <TouchableOpacity style={{ position: "absolute", right: 5,marginTop:10, alignItems: 'center', marginRight: 10, width: 25, height: 25}}
                        onPress={() => this.setState({searchtrue :false, text:"", focus:false}) }>
                        <Image style={{ width: 15, height: 15, tintColor:"white" }} 
                            source={Images.cancel} 
                        />
                    </TouchableOpacity>
                    }
                </View>
                }
                 {/*   search listView --------------------------------------start */}
                {this.state.searchtrue &&
                    <View>
                        <FlatList
                            data={this.state.newdataSource}
                            renderItem={({ item }) =>
                                <View style={styles.uperCard}>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate("Department", {
                                        CreatedBy: item.CreatedBy, ID: item.ID, RepositoryID: item.RepositoryID,
                                        RepositoryName: item.RepositoryName, Status: item.Status,
                                    })}>
                                        <View style={styles.uperCardChild}>
                                            <Image
                                                source={Images.repository}
                                                style={styles.itemIcon} />
                                            <View>
                                                <Text style={styles.itemText}>{ellipsis(item.RepositoryName)}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    <View style={{ height: 1, backgroundColor: '#000', marginLeft: 10, marginRight: 10 }} />
                                </View>
                            } keyExtractor={(item, index) => index.toString()} />
                    </View>
                }
                {/*   search listView --------------------------------------end*/}

                {/*   default listView --------------------------------------start*/}
                {this.state.searchtrue == false &&
                    <View >
                        <FlatList
                            data={this.state.dataSource}
                            renderItem={({ item }) =>
                                <View style={styles.uperCard}>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate("Department", {
                                        CreatedBy: item.CreatedBy, ID: item.ID, RepositoryID: item.ID,
                                        RepositoryName: item.RepositoryName, Status: item.Status
                                    })}>
                                        <View style={styles.uperCardChild}>
                                            <Image
                                                source={Images.repository}
                                                style={styles.itemIcon} />
                                            <View>
                                                <Text style={styles.itemText}>{ellipsis(item.RepositoryName)}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    <View style={{ height: 1, backgroundColor: '#000', marginLeft: 10, marginRight: 10 }} />
                                </View>
                            } keyExtractor={(item, index) => index.toString()}/>
                    </View>
                }
                {/*   default listView --------------------------------------end*/}

                <WaitMessage
                    visible={this.state.LoadingDialog}
                    onTouchOutside={() => this.setState({ LoadingDialog: true })}
                />
                </View>
            {/* </ImageBackground> */}
         </UserInactivity>
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
    uperCardChild: {
        flexDirection: 'row',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        backgroundColor: 'transparent',
        marginBottom: 10,
        alignItems: 'center'
    },
    uperCard: {
        marginTop: 2,
        backgroundColor: 'transparent',
        borderRadius: 5,
        marginBottom: 2
    },
    itemIcon: {
        width: '25@ms',
        height: '25@ms',
    },
    itemText: {
        marginLeft: '20@ms',
        color: '#FFFFFF',
        fontSize: '14@ms',
    },
    searchIcon: {
        resizeMode: "contain",
        width: '25@ms',
        height: '25@ms',
        marginLeft: '15@ms',
    },
    searchInput: {
        marginLeft: '18@ms',
        marginRight: 40,
        fontSize: '14@ms',
        color: '#FFF',
        width: '100%',
    },
});

