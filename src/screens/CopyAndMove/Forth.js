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
    ToastAndroid, AlertIOS,
    BackHandler
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
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import { Dialog } from 'react-native-simple-dialogs';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';

var SQLite = require('react-native-sqlite-storage');
const db = SQLite.openDatabase("laybrook.db", "1.0", "Laybrook Database", 200000);

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height
import {
    Colors,
    Fonts,
    Images,
    dialogStyle,
} from '../../themes'
import api from '../../api'
import {WaitMessage, UserInactivity, ActionSheet, Header} from '../../Components';
import {GoLogin, ellipsis} from '../../Helpers';

const profileImage = 'https://hubbe.rs/uploads/connectedmug55x33jpg-50984.jpg'

const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4

const title = <Text style={{ color: 'crimson', fontSize: 18 }}>Which one do you like?</Text>

var item1 = {} ,   tempData ;
let action,params,ID,UserName,RoleID,FirstName,LastName,EmailID,Download,Upload,currentFolderID,selectedFileID
export default class SelectedSubFolder2 extends React.Component {
    static navigationOptions = {
        header: null
        //headerMode: 'none'
    };
    constructor(props) {
        super(props);
        this.state = {
            addItem: 1, checkbox: false, selectedLots: [], selectedAll: [], TotalPrice: '',
            checked: false,

            isLoading: true,
            ID: "",
            UserName: "",
            RoleID: "",
            FirstName: "",
            LastName: "",
            EmailID: "",
            Download: "",
            Upload: "",
            move:'',
            copy:'',
            currentFolderID:"",
            selectedFileID:'',
            message: {},
            noData: false,
            folderID: "0",
            item:{},
            selected: 1,
            searchtrue:false,
            action:'',
            LoadingDialog:true,
            dataSource: []
        };
        this.focus = false
        this.timer = null;
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
            copy = await AsyncStorage.getItem('copy');
            move = await AsyncStorage.getItem('move');
            currentFolderID = await AsyncStorage.getItem('currentFolderID');
            selectedFileID = await AsyncStorage.getItem('selectedFileID');
            action = await AsyncStorage.getItem('action');
        if(ID != null || ID != undefined || ID != ''){
            this.setState({
                ID : ID,
                UserName:UserName,
                RoleID:RoleID,
                FirstName:FirstName,
                LastName:LastName,
                EmailID:EmailID,
                Download:Download,
                Upload:Upload,
                currentFolderID:currentFolderID.toString(),
                selectedFileID:selectedFileID.toString(),
                action:action
            });
            this.GetAllVDR();
        }
    }
    async GetAllVDR() {
        var params = this.props.navigation.state.params;
        var folder;
        this.setState({ folderID: params.folderID });
        const { RoleID, ID, folderID } = this.state;
        if (params.FolderID != null || params.FolderID != "" || params.FolderID != undefined) {
            folder = params.FolderID;
        } else {
            folder = "0";
        }
        await fetch(api.GetAllVdrMetaTemplateFoldersAndFiles_URL + "/" + RoleID + "/" + ID + "/" + params.RepositoryID + "/" + params.MetaTemplateID + "/" + folder)
            .then(res => res.json())
            .then(res => {
                if (res.IsSuccess == "1") {
                    if (res.Message != "[]") {
                        this.setState({ isLoading: false, LoadingDialog:false })
                        try {
                            let message = JSON.parse(res.Message);

                            this.setState({
                                isLoading: false,
                                dataSource: message.Folders,
                            })
                        } catch (error) {
                              this.setState({ isLoading: false, LoadingDialog:false })
                        }
                    } else {
                        this.setState({ isLoading: false, noData: true, LoadingDialog:false  })
                    }
                } else {
                      this.setState({ isLoading: false, LoadingDialog:false })
                }
            })
    }
    //exit app start//
    onButtonPress = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        // then navigate
    }
    handleBackButton = () => {
        this.props.navigation.goBack(null)
        return true;
    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener("didFocus", () => {
            this.focus = true
        });
        this.blurListener = this.props.navigation.addListener("didBlur", () => {
            this.focus = false
        });
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
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

    componentWillUnmount() {
        this.focusListener.remove()
        this.blurListener.remove()
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        if (this.timer) clearTimeout(this.timer);
    }
    pasteAction(){
        const FolderID = this.props.navigation.getParam('FolderID')
        const FolderName = this.props.navigation.getParam('FolderName')
        if(this.state.action =="1"){
            if(FolderID != currentFolderID){
                this.copyItem(FolderID);
            }else{
                Alert.alert(
                    FolderName,
                        'File already in this folder, Please select another folder.',
                    [
                        // {text: 'Cancel', style: 'cancel'},
                        {text: 'OK', style: 'cancel'},
                    ],
                    { cancelable: false }
                )
            }
        } else if(this.state.action =="2"){
            if (FolderID != currentFolderID){
                this.moveItem(FolderID);
            }else{
                Alert.alert(
                    FolderName,
                        'File already in this folder, Please select another folder.',
                    [
                        // {text: 'Cancel', style: 'cancel'},
                        {text: 'OK', style: 'cancel'},
                    ],
                    { cancelable: false }
                )
            }
        }
    }

    selectAction(item){
        if(this.state.action =="1"){
            if(item.FolderID != currentFolderID){
                this.copyItem(item.FolderID);
            }else{
                Alert.alert(
                    item.FolderName,
                        'File already in this folder, Please select another folder.',
                    [
                        // {text: 'Cancel', style: 'cancel'},
                        {text: 'OK', style: 'cancel'},
                    ],
                    { cancelable: false }
                )
            }
        }else{if(this.state.action =="2"){
                if(item.FolderID != currentFolderID){
                    this.moveItem(item.FolderID);
                }else{
                    Alert.alert(
                        item.FolderName,
                            'File already in this folder, Please select another folder.',
                        [
                            // {text: 'Cancel', style: 'cancel'},
                            {text: 'OK', style: 'cancel'},
                        ],
                        { cancelable: false }
                    )
                }
            }
        }
    }
    async copyItem(FolderID) {
        var params = this.props.navigation.state.params
        const pass_data = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                RepositoryId: params.RepositoryID,
                MetatemplateId: params.MetaTemplateID,
                SelectedDocId: this.state.selectedFileID,
                FolderId: FolderID,
                UserId: this.state.ID
            }),
        }
        await fetch(api.Copy_URL, pass_data).then(res => res.json())
            .then(res => {
                if (res.IsSuccess == "1") {

                    Platform.select({
                        ios: () => { AlertIOS.alert(res.Message); },
                        android: () => { ToastAndroid.show(res.Message, ToastAndroid.SHORT); }
                    })();
                    this.props.navigation.navigate("Homescreen")
                } else {

                    Platform.select({
                        ios: () => { AlertIOS.alert(res.Message); },
                        android: () => { ToastAndroid.show(res.Message, ToastAndroid.SHORT); }
                    })();
                }
            }).catch((error) => {
            })
    }
    async moveItem(FolderID) {
        var params = this.props.navigation.state.params
        const pass_data = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               RepositoryId: params.RepositoryID,
                MetatemplateId: params.MetaTemplateID,
                 SelectedDocId: this.state.selectedFileID,
                FolderId: FolderID,
                UserId: this.state.ID
            }),
        }
        await fetch(api.Move_URL, pass_data).then(res => res.json())
            .then(res => {
                if (res.IsSuccess == "1") {

                    Platform.select({
                        ios: () => { AlertIOS.alert(res.Message); },
                        android: () => { ToastAndroid.show(res.Message, ToastAndroid.SHORT); }
                    })();
                    this.props.navigation.navigate("Homescreen")
                } else {
                    Platform.select({
                        ios: () => { AlertIOS.alert('Move failed'); },
                        android: () => { ToastAndroid.show('Move failed', ToastAndroid.SHORT); }
                    })();
                }
            }).catch((error) => {
            })
    }
    search(text){
        this.setState({ searchtrue: true ,text:text })
        const {dataSource } = this.state;
        var text1 = text;
        array1 =[];
        var i = 0;
        for(i ; i < dataSource.length; i++){
            if( dataSource[i].DocumentName.toLowerCase().indexOf(text.toLowerCase()) >= 0){
                array1.push(dataSource[i]);
            }
        }
        this.setState({ newdataSource : array1 })
    }
    render() {
        var params = this.props.navigation.state.params
        return (
             <UserInactivity
                onInactivity={(active)=> {
                    if (!active && this.focus) {
                    GoLogin(this.props.navigation)
                }
                }}
            >
            <Container style={styles.container}>
                <Header type="back" title={params.FolderName} navigation={this.props.navigation}/>
                { this.state.dataSource.length > 0 &&
                <View style={{
                    backgroundColor: '#333333', width: '100%',
                    height: 60, marginTop: 5, flexDirection: 'row', alignItems: 'center'
                }}>

                    <Image style={styles.searchIcon}
                            source={Images.search} />
                    <TextInput
                        placeholder={"Search Folder"}//placeholder={"Document Name"}
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
                  {this.state.noData == true &&
                    <View style={{ justifyContent: "center", alignItems: "center", alignContent: 'center' }} >
                        <Text style={{ marginLeft: 20, fontWeight: 'bold', color: "#fff", fontSize: 15, textAlign: 'center' }}>
                            This Folder is empty
                    </Text>
                    </View>
                }

                {this.state.noData == false &&
                    <View>
                        <FlatList
                            data={this.state.newdataSource}
                            scrollEnabled={true}
                            renderItem={({ item }) =>
                                <View style={styles.uperCard}>
                                    <View style={styles.uperCardChild}>
                                        <View style={{ marginLeft: 20 }}>
                                            <Text style={{
                                                color: '#FFFFFF',
                                                fontSize: 14
                                            }}>{item.FolderName}</Text>
                                        </View>
                                    </View>
                                    <View style={{ height: 1, backgroundColor: '#000', marginLeft: 10, marginRight: 10 }} />
                                </View>

                            } keyExtractor={(item, index) => index} />
                    </View>
                }

                <WaitMessage
                    visible={this.state.LoadingDialog}
                    onTouchOutside={() => this.setState({ LoadingDialog: true })} 
                />

                <View style={{position:"absolute", bottom:0,justifyContent:'center',alignItems:'center',width:'100%',}}>
                 <View>
                 <Text style={styles.titleText2}> Long Press on the folder to select</Text>
                 </View>
                 <View style={{flexDirection: 'row'}}>
                 <TouchableOpacity onPress={() => this.pasteAction()} style={{alignSelf:"center",width:"40%",margin:10,backgroundColor:'white',borderRadius:30,height:45,justifyContent:'center',alignItems:'center'}}>
                    <Text style={styles.titleText}> Paste </Text>
                </TouchableOpacity>
                 <TouchableOpacity onPress={() => this.props.navigation.navigate("Homescreen")} style={{alignSelf:"center",width:"40%",margin:10,backgroundColor:'white',borderRadius:30,height:45,justifyContent:'center',alignItems:'center'}}>
                     <Text style={styles.titleText}> Cancel </Text>
                 </TouchableOpacity>
                 </View>
             </View>
            </Container>
               </UserInactivity>
        );
    }
}

const styles = ScaledSheet.create({
    container: {
        height: '100%',
        backgroundColor: '#285A7F'
    },
    popupView: {
        marginTop: 20,
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        borderRadius: 10
    },
    popupText: {
        fontFamily: Fonts.base,
        fontSize: 14,
        margin: 8,
        color: '#000',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    iconContainer: {
        width: 25,
        height: 25,
        alignSelf: 'center'
    },
    buttonOnBed: {
        justifyContent: 'space-around',
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        flexDirection: 'row'
    },
    back_img: {
        //marginTop: 5, marginBottom: 5,
        width: width,
        //height: 470,
        height: height
    },
    buttonLogin: {
        width: 175,
        height: 50,
        borderRadius: 4
    },
    buttonregister: {
        width: 160,
        height: 50,
        borderRadius: 4,
        backgroundColor: "#FFF"
    },
    uperCardChild: {
        flexDirection: 'row',
        marginTop: 10,
        marginLeft:20,
        marginRight:20,
        backgroundColor: 'transparent',
        marginBottom: 10,
        alignItems: 'center'
    },
    buttonLogintext: {
        color: "#363F45",
        fontSize: 15
    },
    uperCard: {
        marginTop: 2,
        backgroundColor: 'transparent',
        borderRadius: 5,
        marginBottom: 2
    },
    rightPicView: {
        position: 'absolute',
        right: 0
    },
    buttonRegistertext: {
        color: "#0c0c0c",
        fontSize: 15
    },
    buttonRight: {
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        marginLeft: 15,
        flex: 50,
        width: 40,
        height: 80,
        backgroundColor: '#f6f6f6'
    },
    buttonLeft: {
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
        flex: 50,
        width: 40,
        height: 80,
        backgroundColor: '#f6f6f6'
    },
    footer: {
        position: 'absolute',
        height: 50,
        bottom: 0,
        backgroundColor: "#FFFFFF"
    },
    titleText: {
        fontSize: 20,
        color:"#000",
        fontWeight: 'bold',
        textAlign:'center'
    },
    titleText2: {
        fontSize: 20,
        color:"#fff",
        fontWeight: 'bold',
        textAlign:'center'
    },
    listIcon: {
        width: '25@ms',
        height: '25@ms',
    },
    itemText: {
        marginLeft: '20@ms',
        color: '#FFFFFF',
        fontSize: '14@ms',
    },
    itemActions: {
        position: "absolute",
        right: 2,
        alignItems: 'center',
        width: '25@ms',
        height: '25@ms'
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

