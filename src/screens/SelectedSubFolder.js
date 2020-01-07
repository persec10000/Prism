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
    ToastAndroid,PanResponder,
    AlertIOS,
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

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height
import {
    Colors,
    Fonts,
    Images,
    dialogStyle,
} from '../themes';
import api from '../api';
import {WaitMessage, UserInactivity, ActionSheet, Header} from '../Components';
import {GoLogin, ellipsis} from '../Helpers';

const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4
const title = <Text style={{ color: 'crimson', fontSize: moderateScale(18, 0.3) }}>Select action</Text>

const profileImage = 'https://hubbe.rs/uploads/connectedmug55x33jpg-50984.jpg'

let ID, UserName, RoleID, FirstName, LastName, EmailID, Download, Upload, tempData;

export default class SelectedSubFolder extends React.Component {
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
            message: {},
            noData: false,
            folderID: "0", selected: 1, fileNameNew: '',
            enable: false,
            searchtrue: false,
            LoadingDialog:true,
            focus:false,
            dataSource: []
        };
        this.focus = false
    }
	
	componentWillUnmount() {
        this.focusListener.remove()
        this.blurListener.remove()
        this.back_componentWillUnmount()
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
    }
    async GetAllVDR() {
        var params = this.props.navigation.state.params
        await fetch(api.GetAllVdrMetaTemplateFoldersAndFiles_URL + "/" + this.state.RoleID + "/" + this.state.ID + "/" + params.RepositoryID + "/" + params.ID)
            .then(res => res.json())
            .then(res => {
                if (res.IsSuccess == "1") {
                    if (res.Message != "[]") {
                        this.setState({ isLoading: false ,LoadingDialog:false })
                        try {
                            let message = JSON.parse(res.Message);
                            console.log("44444=",message);
                            var data = [];
                            this.setState({
                                isLoading: false,
                                LoadingDialog:false,
                                dataSource: message.Folders,
                            })
                        } catch (error) {
                             this.setState({ isLoading: false ,LoadingDialog:false })
                        }
                    } else {
                        Platform.select({
                            ios: () => { AlertIOS.alert(res.Message); },
                            android: () => { ToastAndroid.show(res.Message, ToastAndroid.SHORT); }
                        })();
                        this.setState({ isLoading: false, noData: true, LoadingDialog:false  })
                    }
                } else {
                     this.setState({ isLoading: false ,LoadingDialog:false })
                }
            }).catch((error)=>{
                this.setState({ isLoading: false ,LoadingDialog:false })

            })
    }
    openNext(item) {
        var params = this.props.navigation.state.params
        this.props.navigation.navigate("SelectedSubFolder2", {
            FolderName: item.FolderName,
            ID: item.ID, FolderID: item.ID,
            RepositoryID: params.RepositoryID,
            MetaTemplateID: params.MetaTemplateID,
            DepartmentId: params.DepartmentId,
            repoCreatedBy: params.repoCreatedBy, repoID: params.repoID, repoRepositoryID: params.repoRepositoryID, repoRepositoryName: params.repoRepositoryName, repoStatus: params.repoStatus
        })
    }

    async renameItem() {
        const pass_data = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                NewFolderName: this.state.fileNameNew,
                UserId: this.state.ID,
                FolderId: tempData.FolderID,
                FolderDesc: tempData.FolderDescription
            }),
        }
        await fetch(api.Rename_URL, pass_data).then(res => res.json())
            .then(res => {
                if (res.IsSuccess == "1") {
                    this.GetAllVDR()
                    Platform.select({
                        ios: () => { AlertIOS.alert(res.Message); },
                        android: () => { ToastAndroid.show(res.Message, ToastAndroid.SHORT); }
                    })();
                } else {
                    Platform.select({
                        ios: () => { AlertIOS.alert(res.Message); },
                        android: () => { ToastAndroid.show(res.Message, ToastAndroid.SHORT); }
                    })();
                }
            }).catch((error) => {
            })
    }
    changeName(item) {
        tempData = item;
        this.actionSheet.show()
    }
    openRenameDialog(show) {
        this.setState({ Rename_showDialog: show })
    }
    submitOTP() {
        this.openRenameDialog(false)
        this.renameItem(tempData)
    }
    search(text) {
        this.setState({ searchtrue: true ,text:text })
        const { dataSource } = this.state;
        var text1 = text;
        var array = [], array1 = [];
        var i = 0;
        for (i; i < dataSource.length; i++) {
            if (dataSource[i].FolderName.toLowerCase().indexOf(text.toLowerCase()) >= 0) {
                array1.push(dataSource[i]);
            }
        }
        this.setState({ newdataSource: array1 })
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
    } 

    back_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    //actionSheet start//
    showActionSheet = () => this.actionSheet.show()
    getActionSheetRef = ref => (this.actionSheet = ref)
    handlePress = index => this.actionSheetfuncton(index)
    //actionSheet end//


    actionSheetfuncton(index) {
        if (index == 1) {
            this.setState({ Rename_showDialog: true })
        }
    }
    render() {
        const options = [
            'Cancel',
            {
                component: <View
                    style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Image
                        source={Images.edit}
                        style={{ width: 25, height: 25, marginRight: 10 }} />
                    <Text style={{ color: 'blueviolet', fontSize: moderateScale(18, 0.3) }}>Rename</Text>
                </View>,
                height: 40,
            },
        ]
        const { selected } = this.state
        const selectedText = options[selected].component || options[selected]

        var params = this.props.navigation.state.params
        return (
                <UserInactivity
                    onInactivity={(active)=> {
                        if (!active && this.focus) {
                        GoLogin(this.props.navigation)
                    }
                    }}
                >
                <View style={styles.container}>
                    <Header type="back" title={params.MetaTemplateName} navigation={this.props.navigation}/>
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
                    {this.state.searchtrue &&
                        <View>
                            <FlatList
                                data={this.state.newdataSource}
                                renderItem={({ item }) =>

                                    <View style={styles.uperCard}>
                                        <TouchableOpacity onPress={() => this.openNext(item)} >
                                            <View style={styles.uperCardChild}>
                                                <Image
                                                    source={Images.folder}
                                                    style={styles.itemIcon} />
                                                <View>
                                                    <Text style={styles.itemText}>{ellipsis(item.FolderName)}</Text>
                                                </View>
                                                {/* <TouchableOpacity onPress={() => this.changeName(item)}
                                                    style={styles.itemActions}>
                                                    <Image
                                                        source={Images.menu}
                                                        style={styles.itemIcon} />
                                                </TouchableOpacity> */}
                                            </View>
                                        </TouchableOpacity>
                                        <View style={{ height: 1, backgroundColor: '#000', marginLeft: 10, marginRight: 10 }} />
                                    </View>

                                } keyExtractor={(item, index) => index.toString()} />
                        </View>
                    }
                    {this.state.searchtrue == false &&
                        <View>
                            <FlatList
                                data={this.state.dataSource}
                                renderItem={({ item }) =>
                                    <View style={styles.uperCard}>
                                        <TouchableOpacity onPress={() => this.openNext(item)} >
                                            <View style={styles.uperCardChild}>
                                                <Image
                                                    source={Images.folder}
                                                    style={styles.itemIcon} />
                                                <View>
                                                    <Text style={styles.itemText}>{ellipsis(item.FolderName)}</Text>
                                                </View>
                                                {/* {RoleID == "1" &&
                                                <TouchableOpacity onPress={() => this.changeName(item)}
                                                    style={styles.itemActions}>
                                                    <Image
                                                        source={Images.menu}
                                                        style={styles.itemIcon} />
                                                </TouchableOpacity>
                                                } */}
                                            </View>
                                        </TouchableOpacity>
                                        <View style={{ height: 1, backgroundColor: '#000', marginLeft: 10, marginRight: 10 }} />
                                    </View>

                                } keyExtractor={(item, index) => index.toString()} />
                        </View>
                    }
                    <Dialog
                        dialogStyle={dialogStyle}
                        visible={this.state.Rename_showDialog}
                        supportedOrientations={['portrait', 'landscape']}
                        onTouchOutside={() => this.setState({ Rename_showDialog: true })}>
                        <View style={{ marginTop: -10, }}>
                            <View style={{ marginTop: 10, alignSelf: 'flex-end' }}>
                                <TouchableOpacity onPress={() => this.setState({ Rename_showDialog: false })}
                                    style={{ marginRight: 20 }}>
                                    <Image
                                        source={Images.cancel}
                                        style={{ width: 15, height: 15, tintColor: '#000' }}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginTop: 15, height: 1, backgroundColor: '#DFE4E8', marginLeft: 5, marginRight: 5 }} />
                            <Text style={{ marginTop: 15, textAlign: 'center', fontSize: 17, color: '#878787', fontWeight: "bold" }}>Please enter new folder name</Text>
                            <View style={styles.SectionStylePopup}>
                                <View style={styles.SectionStylePopupChild}>
                                    <Image
                                        source={Images.popupfolder}
                                        style={{ width: 25, height: 25, tintColor: '#2CA9E1' }} />
                                </View>
                                <TextInput
                                    style={styles.inputFontPopup}
                                    secureTextEntry={false}
                                    underlineColorAndroid={'transparent'}
                                    placeholder="Enter folder name"
                                    placeholderTextColor="#C5C5C5"
                                    selectionColor={Colors.blackColor}
                                    value={this.state.fileNameNew}
                                    onChangeText={(text) => this.setState({ fileNameNew: text })}
                                   // keyboardType='numeric'
                                    returnKeyType={'go'} 
                                    onEndEditing={() => {}}
                                />
                            </View>

                            <TouchableOpacity onPress={() => this.submitOTP()}
                                style={styles.popupView}>
                                <Text style={styles.popupText}>
                                    SUBMIT</Text>
                            </TouchableOpacity>
                        </View>
                    </Dialog>
                    <ActionSheet
                        ref={this.getActionSheetRef}
                        title={title}
                        options={options}
                        cancelButtonIndex={CANCEL_INDEX}
                        destructiveButtonIndex={DESTRUCTIVE_INDEX}
                        onPress={this.handlePress}
                    />

                    <WaitMessage
                        visible={this.state.LoadingDialog}
                        onTouchOutside={() => this.setState({ LoadingDialog: true })}
                    />
                </View>
                </UserInactivity>
        );
    }
}

const styles = ScaledSheet.create({
    container: {
        height: '100%',
        backgroundColor: '#285A7F'
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
    SectionStylePopup: {
        flexDirection: 'row',
        marginTop: 20,
        backgroundColor: '#EFF7FA',
        height: 55,
        marginBottom: 5,
        marginLeft: 10,
        marginRight: 10,
        alignItems: 'center' 
    },
    SectionStylePopupChild: {
        backgroundColor: '#E5F2FA',
        height: 55,
        width: 55,
        justifyContent: 'center',
        alignItems: 'center'
    },
    popupView: {
        marginTop: 20,
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#2CA9E1',
        width: '100%',
        height: 55,
        borderRadius:15
    },
    popupText: {
        fontFamily: Fonts.base,
        fontSize: 18,
        margin: 8,
        color: '#FFF',
        textAlign: 'center',
        fontWeight: 'bold'
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
    footer: {
        position: 'absolute',
        height: 50,
        bottom: 0,
        backgroundColor: "#FFFFFF"
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

