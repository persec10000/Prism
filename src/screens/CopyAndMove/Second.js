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
import { Dialog } from 'react-native-simple-dialogs';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';

const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4
const title = <Text style={{ color: 'crimson', fontSize: 18 }}>Which one do you like?</Text>
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

let action,params,ID,UserName,RoleID,FirstName,LastName,EmailID,Download,Upload,tempData,currentFolderID,selectedFileID

export default class Second extends React.Component {
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
            move:'',
            copy:'',
            currentFolderID:"",
            selectedFileID:'',
            action:'',
            message: {},
            selected: 1,
            enable:false,
            searchtrue:false,
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
            action = this.props.navigation.state.params.action
            await AsyncStorage.setItem('action', action);
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
        var params = this.props.navigation.state.params
        await fetch(api.GetAllVdrMetaTemplates_URL + "/" + this.state.RoleID + "/" + this.state.ID + "/" + params.RepositoryID).then(res => res.json())
            .then(res => {
                if (res.IsSuccess == "1") {
                    this.setState({ isLoading: false , LoadingDialog:false  })
                    try {
                        let message = JSON.parse(res.Message);
                        this.setState({
                            isLoading: false,
                            dataSource: message,
                        })
                    } catch (error) {
                          this.setState({ isLoading: false, LoadingDialog:false })
                        Platform.select({
                            ios: () => { AlertIOS.alert(error + ' '); },
                            android: () => { ToastAndroid.show(error + ' ', ToastAndroid.SHORT); }
                        })();
                    }
                } else {
                      this.setState({ isLoading: false, LoadingDialog:false })
                }
            })
    }
    // selectAction(item){
    //     if(this.state.action =="1"){
    //         if(item.FolderID != currentFolderID){
    //             this.copyItem(item);
    //         }else{
    //             Alert.alert(
    //                 item.FolderName,
    //                     'File already in this folder, Please select another folder.',
    //                 [
    //                     {text: 'Cancel', style: 'cancel'},
    //                     {text: 'OK', style: 'cancel'},
    //                 ],
    //                 { cancelable: false }
    //             )
    //         }
    //     }else{if(this.state.action =="2"){
    //             if(item.FolderID != currentFolderID){
    //                 this.moveItem(item);
    //             }else{
    //                 Alert.alert(
    //                     item.FolderName,
    //                         'File already in this folder, Please select another folder.',
    //                     [
    //                         {text: 'Cancel', style: 'cancel'},
    //                         {text: 'OK', style: 'cancel'},
    //                     ],
    //                     { cancelable: false }
    //                 )
    //             }
    //         }
    //     }
    // }
     //exit app start//
     onButtonPress = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        // then navigate
    }
    handleBackButton = () => {
        this.props.navigation.goBack(null)
        // Alert.alert(
        //     'Virtual Data Room',
        //     'Are you sure you want to exit from App?',
        //     [
        //         { text: 'cancel'},
        //         { text: 'OK'},
        //     ],
        //     { cancelable: false }
        // )
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

    // async copyItem(item) {
    //     var params = this.props.navigation.state.params
    //     const pass_data = {
    //         method: 'POST',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             RepositoryId: params.RepositoryID,
    //             MetatemplateId: params.MetaTemplateID,
    //             SelectedDocId: this.state.selectedFileID,
    //             FolderId: item.FolderID,
    //             UserId: this.state.ID
    //         }),
    //     }
    //     await fetch(api.Copy_URL, pass_data).then(res => res.json())
    //         .then(res => {
    //             if (res.IsSuccess == "1") {
    //                 Platform.select({
    //                     ios: () => { AlertIOS.alert('Copy done'); },
    //                     android: () => { ToastAndroid.show('Copy done', ToastAndroid.SHORT); }
    //                 })();
    //                 this.props.navigation.navigate("Homescreen")
    //             } else {
    //                 Platform.select({
    //                     ios: () => { AlertIOS.alert('Copy failed'); },
    //                     android: () => { ToastAndroid.show('Copy failed', ToastAndroid.SHORT); }
    //                 })();
    //                 this.props.navigation.navigate("Homescreen")
    //             }
    //         }).catch((error) => {
    //         })
    // }
    // async moveItem(item) {
    //     var params = this.props.navigation.state.params
    //     const pass_data = {
    //         method: 'POST',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             RepositoryId: params.RepositoryID,//VDR folder id
    //             MetatemplateId: params.MetaTemplateID,//Metatemplate folder id
    //             SelectedDocId: this.state.selectedFileID,// selected file id
    //             FolderId: item.FolderID,//Target Selected folder id
    //             OldFolderId:this.state.currentFolderID,  //Current folder id
    //             UserId: this.state.ID// logged in user id.
    //         }),
    //     }
    //     await fetch(api.Move_URL, pass_data).then(res => res.json())
    //         .then(res => {
    //             if (res.IsSuccess == "1") {

    //                 Platform.select({
    //                     ios: () => { AlertIOS.alert('Move done'); },
    //                     android: () => { ToastAndroid.show('Move done', ToastAndroid.SHORT); }
    //                 })();
    //                 this.props.navigation.navigate("Homescreen")
    //             } else {

    //                 Platform.select({
    //                     ios: () => { AlertIOS.alert('Move failed'); },
    //                     android: () => { ToastAndroid.show('Move failed', ToastAndroid.SHORT); }
    //                 })();
    //                 this.props.navigation.navigate("Homescreen")
    //             }
    //         }).catch((error) => {
    //         })
    // }
    search(text){
        this.setState({ searchtrue: true ,text:text })
        const {dataSource } = this.state;
        var text1 = text;
        array1 =[];
        var i = 0;
        for(i ; i < dataSource.length; i++){
           if( dataSource[i].MetaTemplateName.toLowerCase().indexOf(text.toLowerCase()) >= 0){
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
                <Header type="back" title={params.RepositoryName} navigation={this.props.navigation}/>
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
                {this.state.searchtrue &&
                <View>
                    <FlatList
                        data={this.state.newdataSource}
                        renderItem={({ item }) =>

                            <View style={styles.uperCard}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate("Third", {
                                    CreatedBy: item.CreatedBy, ID: item.ID, RepositoryID: item.RepositoryID,
                                    MetaTemplateName: item.MetaTemplateName, MetaTemplateID: item.MetaTemplateID
                                })}>
                                    <View style={styles.uperCardChild}>
                                        <Image
                                            source={Images.folder}
                                            style={styles.listIcon} />
                                        <View>
                                            <Text style={styles.itemText}>{ellipsis(item.MetaTemplateName)}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <View style={{ height: 1, backgroundColor: '#000', marginLeft: 10, marginRight: 10 }} />
                            </View>

                        } keyExtractor={(item, index) => index} />


                </View>
            }
             {this.state.searchtrue == false &&
                <View>
                    <FlatList
                        data={this.state.dataSource}
                        renderItem={({ item }) =>

                            <View style={styles.uperCard}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate("Third", {
                                    CreatedBy: item.CreatedBy, ID: item.ID, RepositoryID: item.RepositoryID,
                                    MetaTemplateName: item.MetaTemplateName, MetaTemplateID: item.MetaTemplateID
                                })}
                                   >
                                    <View style={styles.uperCardChild}>
                                        <Image
                                            source={Images.folder}
                                            style={styles.listIcon} />
                                        <View>
                                            <Text style={styles.itemText}>{ellipsis(item.MetaTemplateName)}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
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
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("Homescreen")} style={{alignSelf:"center",width:"40%",margin:10,backgroundColor:'white',borderRadius:30,height:45,justifyContent:'center',alignItems:'center'}}>
                        <Text style={styles.titleText}> Cancel </Text>
                    </TouchableOpacity>
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
      SectionStylePopup: {
        flexDirection: 'row',
        marginTop: 20,
        backgroundColor: '#FFFFFF',
        height: 45,
        marginBottom: 5,
        marginLeft: 5,
        marginRight: 5,
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'gray'
    },
    popupText: {
        fontFamily: Fonts.base,
        fontSize: 14,
        margin: 8,
        color: '#FFF',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    popupView: {
        marginTop: 20,
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#00A95D',
        borderRadius: 10
    },
    signinText: {
        fontFamily: Fonts.base,
        fontSize: 22,
        color: '#FFF',
        textAlign: 'center'
    },
    inputFontPopup: {
        color: '#000',
        height: 30,
        width: '75%',
        marginRight: 10,
        marginLeft: 10,
        padding: 0,
        fontSize: 14
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

