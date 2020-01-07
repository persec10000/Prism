import React, { Component } from "react"
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
    ToastAndroid, AlertIOS, PanResponder,
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
import DocumentPicker from 'react-native-document-picker';
var SQLite = require('react-native-sqlite-storage');
import { ScaledSheet, moderateScale } from 'react-native-size-matters';

import {
    Colors,
    Fonts,
    Images,
    dialogStyle,
} from '../themes';
import api from '../api';
import {FiletypeIcon, WaitMessage, UserInactivity, ActionSheet, Header, Mp3Player} from '../Components';
import {AppAlert, GoLogin, CheckAllowedFormat, ellipsis} from '../Helpers';
import Toast, {DURATION} from 'react-native-easy-toast'

const db = SQLite.openDatabase("virtualdata.db", "1.0", "virtualdata Database", 200000);
var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height
let ID, UserName, RoleID, FirstName, LastName, EmailID, DownloadRole, UploadRole, ViewRole, MoveCopyRole, CreateRequestRole, tempData;
const CANCEL_INDEX1 = 0
const DESTRUCTIVE_INDEX1 = 0
const CANCEL_INDEX2 = 0
const DESTRUCTIVE_INDEX2 = 4

const title1 = <Text style={{ color: 'crimson', fontSize: moderateScale(18, 0.3) }}>Select action</Text>
const title2 = <Text style={{ color: '#000', fontSize: moderateScale(18, 0.3), textAlign: 'center' }}>Sort By</Text>

const DESTRUCTIVE_INDEX3 = 4
var greycolor = "lightgrey", one ="1";

var mimestyle = "|Application/pdf|image/png|application/vnd.openxmlformats-officedocument.presentationml.presentation|application/msword|application/vnd.openxmlformats-officedocument.wordprocessingml.document|application/vnd.ms-excel|application/vnd.openxmlformats-officedocument.spreadsheetml.sheet|image/jpeg|image/gif|image/png|image/bmp|audio/mpeg|video/mp4|application/mp4|video/x-ms-wmv|application/vnd.ms-powerpoint|";


var options1 = [
    'Cancel'
]

export default class SelectedSubFolder2 extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            addItem: 1, checkbox: false, selectedLots: [], selectedAll: [], TotalPrice: '',
            checked: false,
            isLoading: true,
            ID: "",
            UserID: null,
            UserName: "",
            FirstName: "",
            LastName: "",
            EmailID: "",
            message: {},
            noData: false,
            folderID: "0",
            searchtrue: false,
            selected1: 1,
            selected2: 1,
            selected3: 0,
            ascSize: false,
            descSize: false,
            ascModified: false,
            descModified: false,
            ascType: false,
            descType: false,
            value: 1,
            LoadingDialog: true,
            greycolor: "blueviolet",
            focus: false,
            itemUrl: null,
            showMp3Player: false,
            dataSource: [],
            dataSource1: []
        };
        this.focus = false
        this.timer = null;
    }
    
    componentWillUnmount() {
        this.focusListener.remove()
        this.blurListener.remove()
        this.back_componentWillUnmount()
    }

    async componentWillMount() {
        let params = this.props.navigation.state.params;
        console.log("ppp",params)
        ID = await AsyncStorage.getItem('ID');
        UserName = await AsyncStorage.getItem('UserName');
        RoleID = await AsyncStorage.getItem('RoleID');
        FirstName = await AsyncStorage.getItem('FirstName');
        LastName = await AsyncStorage.getItem('LastName');
        EmailID = await AsyncStorage.getItem('EmailID');
        DownloadRole = await AsyncStorage.getItem('Download');
        UploadRole = await AsyncStorage.getItem('Upload');
        ViewRole = await AsyncStorage.getItem('View');
        MoveCopyRole = await AsyncStorage.getItem('MoveCopy')
        CreateRequestRole = params.MetaTemplateID
        options1 = [
            'Cancel'
        ]
        
        if (CreateRequestRole) {
            options1.push(
                {
                    component: <View style={styles.options1Row}>
                        <Image
                            source={Images.download}
                            style={{ width: 25, height: 25, marginRight: 10 }} />
                        <Text style={styles.options1Text}>Document Entry</Text>
                    </View>,
                    height: 40,
                    role: 'createrequest'
                },
            )
        }

        if (ViewRole == '1') {
            options1.push(
                {
                    component: <View style={styles.options1Row}>
                        <Image
                            source={Images.view}
                            style={{ width: 25, height: 25, tintColor: '#000', marginRight: 10 }} />
                        <Text style={styles.options1Text}>View</Text>
                    </View>,
                    height: 40,
                    role: 'view'
                },
            )
        }
        // if (MoveCopyRole == '1') {
        //     options1.push(
        //         {
        //             component: <View style={styles.options1Row}>
        //                 <Image
        //                     source={Images.move}
        //                     style={{ width: 25, height: 25, marginRight: 10 }} />
        //                 <Text style={styles.options1Text}>Move</Text>
        //             </View>,
        //             height: 40,
        //             role: 'move'
        //         },
        //     )
        //     options1.push(
        //         {
        //             component: <View style={styles.options1Row}>
        //                 <Image
        //                     source={Images.upload}
        //                     style={{ width: 30, height: 30, marginRight: 10 }} />
        //                 <Text style={styles.options1Text}>Copy</Text>
        //             </View>,
        //             height: 40,
        //             role: 'copy'
        //         },
        //     )
        // }
        if (DownloadRole == '1') {
            options1.push(
                {
                    component: <View style={styles.options1Row}>
                        <Image
                            source={Images.download}
                            style={{ width: 25, height: 25, marginRight: 10 }} />
                        <Text style={styles.options1Text}>Download</Text>
                    </View>,
                    height: 40,
                    role: 'download'
                },
            )
        }

        if (ID) {
            this.setState({
                UserID: ID,
                UserName: UserName,
                FirstName: FirstName,
                LastName: LastName,
                EmailID: EmailID,
            }, () => {
                this.GetAllVDR();
            });
        }
    }

    async GetAllVDR() {
        let params = this.props.navigation.state.params;
        console.log("params==",params);
        let folder;
        this.setState({ folderID: params.FolderID });
        const { UserID, folderID } = this.state;
        if (params.FolderID != null || params.FolderID != "" || params.FolderID != undefined) {
            folder = params.FolderID;
        } else {
            folder = "0";
        }
        await fetch(api.GetAllVdrMetaTemplateFoldersAndFiles_URL2 + "/" + RoleID + "/" + UserID  + "/" + params.MetaTemplateID+ "/" + params.FolderID )
            .then(res => res.json())
            .then(res => {
                if (res.IsSuccess == "1") {
                    if (res.Message != "[]") {
                         this.setState({ isLoading: false ,LoadingDialog:false })
                        try {
                            let message = JSON.parse(res.Message);
                            console.log("555555555=",message)
                            let data1 = message.Files
                            let data2 = message.Folders
                            this.setState({
                                isLoading: false,LoadingDialog:false,
                                dataSource: [...data2, ...data1]
                            })
                            // this.setState({
                            //     isLoading: false,LoadingDialog:false,
                            //     dataSource: message.Files
                            // })
                        } catch (error) {
                             this.setState({ isLoading: false ,LoadingDialog:false })
                        }
                    } else {
                        this.refs.toast.show(res.Message);
                        this.setState({ isLoading: false, noData: true , LoadingDialog:false})
                    }
                } else {
                     this.setState({ isLoading: false ,LoadingDialog:false })
                }
            }).catch((error)=>{
                this.setState({ isLoading: false ,LoadingDialog:false })

            })
    }

    SortBy(prop, inascSizeOrder) {
        return function (a, b) {
            if (a[prop] > b[prop]) {
                return inascSizeOrder === 1 ? 1 : -1; //  in case to show  large to small order in case of integer
                //return 1;
            } else if (a[prop] < b[prop]) {
                return inascSizeOrder === 1 ? -1 : 1;
                //return -1;
            }
            return 0;
        }
    }

    ResetArray() {
        this.setState({ isLoading: true, searchtrue: true , LoadingDialog:false })
        this.GetAllVDR();
        setTimeout(() => {
           this.setState({ isLoading: false, searchtrue: false , LoadingDialog:false})
        }, 2000);
    }
    latestUse() {
         this.setState({ isLoading: true, searchtrue: true , LoadingDialog:false })
        var sortedArray = this.state.dataSource.sort(this.SortBy('Size', this.state.value));
        this.setState({
            dataSource: sortedArray,
        });
        setTimeout(() => {
           this.setState({ isLoading: false, searchtrue: false , LoadingDialog:false})
        }, 2000);
    }
    FileType() {
         this.setState({ isLoading: true, searchtrue: true , LoadingDialog:false })
        var sortedArray = this.state.dataSource.sort(this.SortBy('DocumentType', this.state.value));
        this.setState({
            dataSource: sortedArray,
        })
        setTimeout(() => {
           this.setState({ isLoading: false, searchtrue: false , LoadingDialog:false})
        }, 2000);
    }
    LastModified() {
         this.setState({ isLoading: true, searchtrue: true , LoadingDialog:false })
        var sortedArray = this.state.dataSource.sort(this.SortBy('UpdatedOn2', this.state.value));
        this.setState({
            dataSource: sortedArray,
        })
        setTimeout(() => {
           this.setState({ isLoading: false, searchtrue: false , LoadingDialog:false})
        }, 2000);
    }
    actionSheetfuncton(index) {
        const role = options1[index].role
        switch (role) {
            case 'createrequest':
                if (CreateRequestRole) {
                    this.create_request();
                } else {
                    setTimeout(() => {
                        this.refs.toast.show("No create request permission");
                    }, 300 );
                }
                break
            case 'view':
                if (ViewRole == '1') {
                    this.viewFile();
                } else {
                    setTimeout(() => {
                        this.refs.toast.show("No view permission");
                    }, 300 );
                }
                break
            case 'move':
                if (MoveCopyRole == '1') {
                    this.moveItem()
                } else {
                    setTimeout(() => {
                        this.refs.toast.show("No move permission");
                    }, 300 );
                }
                break
            case 'copy':
                if (MoveCopyRole == '1') {
                    this.copyItem();
                } else {
                    setTimeout(() => {
                        this.refs.toast.show("No copy permission");
                    }, 300 );
                }
                break
            case 'download':
                if (DownloadRole == '1') {
                    this.add();
                } else {
                    setTimeout(() => {
                        this.refs.toast.show("No download permission");
                    }, 300 );
                }
                break           
        }
    }
    actionSheetfuncton3(index) {
        if (index == 1) {
          this.add();
        }
    }
    actionSheetfuncton1(index) {
        if (index == 1) {
            this.latestUse()
            if (this.state.ascSize == false) {
                if (this.state.descSize == false) {
                    this.setState({
                        ascSize: false,
                        descSize: true,
                        value: 0,
                        ascType: false,
                        descType: false,
                        ascModified: false,
                        descModified: false,
                    })
                } else {
                    this.setState({
                        ascSize: true,
                        descSize: false,
                        ascType: false,
                        descType: false,
                        ascModified: false,
                        descModified: false,
                        value: 1
                    })
                }
            }else{
                this.setState({
                    ascSize: false,
                    descSize: true,
                    value: 0,
                    ascType: false,
                    descType: false,
                    ascModified: false,
                    descModified: false,
                })
            }
            this.setState({ isLoading: true, LoadingDialog: true})
        }
        if (index == 2) {
            this.FileType();
            if (this.state.ascType == false) {
                if (this.state.descType == false) {
                    this.setState({
                        ascType: false,
                        descType: true,
                        ascModified: false,
                        descModified: false,
                        ascSize: false,
                        descSize: false,
                        value: 0
                    })
                } else {
                    this.setState({
                        ascType: true,
                        descType: false,
                        ascModified: false,
                        descModified: false,
                        ascSize: false,
                        descSize: false,
                        value:1
                    })
                }
            }else{
                this.setState({
                    ascType: false,
                    descType: true,
                    ascModified: false,
                    descModified: false,
                    ascSize: false,
                    descSize: false,
                    value: 0
                })
            }
            this.setState({ isLoading: true, LoadingDialog: true})
        }
        if (index == 3) {
            this.LastModified();
            if (this.state.ascModified == false) {
                if (this.state.descModified == false) {
                    this.setState({
                        ascModified: false,
                        descModified: true,
                        ascType: false,
                        descType: false,
                        ascSize: false,
                        descSize: false,
                        value: 0
                    })
                } else {
                    this.setState({
                        ascModified: true,
                        descModified: false,
                        ascType: false,
                        descType: false,
                        ascSize: false,
                        descSize: false,
                        value: 1
                    })
                }
            }else{
                this.setState({
                    ascModified: false,
                    descModified: true,
                    ascType: false,
                    descType: false,
                    ascSize: false,
                    descSize: false,
                    value: 0
                })
            }
            this.setState({ isLoading: true,  LoadingDialog: true})
        }
        if (index == 4) {
            this.ResetArray()
            this.setState({
                ascModified: false,
                descModified: false,
                ascType: false,
                descType: false,
                ascSize: false,
                descSize: false,
                value: 1
            })
            this.setState({ isLoading: true, LoadingDialog: true})
        }
    }

    async Upload() {
        var params = this.props.navigation.state.params;
        console.log("?UserId=" + ID + "&MetatemplateId=" + params.MetaTemplateID + "&FolderId=" + params.FolderID + "&RepositoryId=" + params.RepositoryID + "&DepartmentID=" + params.DepartmentId);
        try {
            const results = await DocumentPicker.pickMultiple({
              type: [DocumentPicker.types.allFiles],
              //There can me more options as well find above
            });
            for (const res of results) {
                console.log(
                    res.uri,
                    res.type, // mime type
                    res.name,
                    res.size
                  );
                if (res != null || res != undefined) {
                    if (CheckAllowedFormat(res.name)) {
                        if (res.size <= 5242880) {
                            this.setState({ isLoading: true, LoadingDialog:true });
                            this.UploadFile(res);
                        } else {
                            this.refs.toast.show("please select the file which is less then 5 MB.");
                        }
                    } else {
                        this.refs.toast.show("Please select the allowed file format.");
                    }
                } else {
                    this.refs.toast.show("No file selected.");
                }
            }
            //Setting the state to show multiple file attributes
            this.setState({ multipleFile: results });
        } catch (err) {
        //Handling any exception (If any)
        if (DocumentPicker.isCancel(err)) {
            //If user canceled the document selection
            alert('Canceled from multiple doc picker');
        } else {
            //For Unknown Error
            alert('Unknown Error: ' + JSON.stringify(err));
            throw err;
        }
        }
    }

    async UploadFile(res) {
        var params = this.props.navigation.state.params
        var data = new FormData();
        data.append('file', {
            uri: res.uri,
            type: res.type,
            name: res.name,
        });
        const config = {
            method: 'POST',
            headers: {Accept: 'application/json',
            'Content-Type': 'multipart/form-data'},
            body: data
        }
        await fetch(api.Upload_URL + "?UserId=" + ID + "&MetatemplateId=" + params.MetaTemplateID + "&FolderId=" + params.FolderID + "&RepositoryId=" + params.RepositoryID + "&DepartmentID=" + params.DepartmentId, config)
            .then(res => res.json())
            .then(res => {
                this.setState({ isLoading: false, LoadingDialog: false});
                if (res.IsSuccess == "1") {
                    this.GetAllVDR().then(() => {
                        this.refs.toast.show(res.Message);
                    });
                } else {
                    this.refs.toast.show("Error, Please try again");
                }
            });
    }

    openDialogOTP(show) {
        this.setState({ otp_showDialog: show })
    }

    submitOTP() {
        this.openDialogOTP(false)
    }

    //actionSheet start//
    showActionSheet1 = () => this.actionSheet1.show()
    getActionSheetRef1 = ref => (this.actionSheet1 = ref)
    handlePress1 = index => this.actionSheetfuncton(index)
    //actionSheet end//

    //actionSheet start//
    showActionSheet2 = () => this.actionSheet2.show()
    getActionSheetRef2 = ref => (this.actionSheet2 = ref)
    handlePress2 = index => this.actionSheetfuncton1(index)
    //actionSheet end//

    //actionSheet start//
    showActionSheet3 = () => this.actionSheet3.show()
    getActionSheetRef3 = ref => (this.actionSheet3 = ref)
    handlePress3 = index => this.actionSheetfuncton3(index)
    //actionSheet end//


    async onCheckBoxPress(item) {
        tempData = item;
        this.setState({
            CategoryID: item.CategoryID,
            CreatedBy: item.CreatedBy,
            CreatedBy1: item.CreatedBy1,
            CreatedBy2: item.CreatedBy2,
            CreatedOn: item.CreatedOn,
            CreatedOn1: item.CreatedOn1,
            CreatedOn2: item.CreatedOn2,
            DocumentGuid: item.DocumentGuid,
            DocumentName: item.DocumentName,
            DocumentPath: item.DocumentPath,
            DocumentStatusID: item.DocumentStatusID,
            DocumentStatusID1: item.DocumentStatusID1,
            DocumentType: item.DocumentType,
            FolderdescSizeription: item.FolderdescSizeription,
            FolderID: item.FolderID, FolderName: item.FolderName,
            ID: item.ID, ID1: item.ID1, ID2: item.ID2,
            Image: item.Image, IsLucened: item.IsLucened,
            MetaDataCode: item.MetaDataCode, MetaDataID: item.MetadataId,
            MetaTemplateID: item.MetaTemplateID, MetaTemplateID1: item.MetaTemplateID1,
            OldPageCount: item.OldPageCount, PageCount: item.PageCount,
            ParentFolderID: item.ParentFolderID, RepositoryID: item.RepositoryID,
            Size: item.Size, Status: item.Status, Status1: item.Status1,
            Status2: item.Status2, Tag: item.Tag, UpdatedBy: item.UpdatedBy,
            UpdatedBy1: item.UpdatedBy1, UpdatedBy2: item.UpdatedBy2,
            UpdatedOn: item.UpdatedOn, UpdatedOn1: item.UpdatedOn1,
            UpdatedOn2: item.UpdatedOn2
        });
        this.actionSheet1.show()
    }

    async viewFile() {
        const item = this.state;
        UserID = await AsyncStorage.getItem('ID');
        UserEmailID = await AsyncStorage.getItem('EmailID');
        if (item.DocumentType.toLowerCase() == ".mp3") {
            this.setState({
                showMp3Player: true,
                itemUrl: api.View_URL +"?FileName=" + item.DocumentGuid + "&Email=" + UserEmailID + "&UserId=" + UserID,
            });
        }
        else {
            if (item.DocumentType.toLowerCase() == ".mp4" || item.DocumentType.toLowerCase() == ".wma"){
                this.props.navigation.navigate("VideoPlayer",{ DocumentGuid : item.DocumentGuid,DocumentType: item.DocumentType,DocumentName:item.DocumentName})
            } else{
                this.props.navigation.navigate("ViewFile",{ DocumentGuid : item.DocumentGuid})
            }
        }
    }
    async create_request() {
        const item = this.state;
        const params = this.props.navigation.state.params
        this.props.navigation.navigate('CreateRequest', {item : item})
    }
    async add() {
        var Size = {
            'CategoryID': this.state.CategoryID,
            'CreatedBy': this.state.CreatedBy,
            'CreatedBy1': this.state.CreatedBy1,
            'CreatedBy2': this.state.CreatedBy2,
            'CreatedOn': this.state.CreatedOn,
            'CreatedOn1': this.state.CreatedOn1,
            'CreatedOn2': this.state.CreatedOn2,
            'DocumentGuid': this.state.DocumentGuid,
            'DocumentName': this.state.DocumentName,
            'DocumentPath': this.state.DocumentPath,
            'DocumentStatusID': this.state.DocumentStatusID,
            'DocumentStatusID1': this.state.DocumentStatusID1,
            'DocumentType': this.state.DocumentType,
            'FolderdescSizeription': this.state.FolderdescSizeription,
            'FolderID': this.state.FolderID,
            'FolderName': this.state.FolderName,
            'ID': this.state.ID,
            'ID1': this.state.ID1,
            'ID2': this.state.ID2,
            'Image': this.state.Image,
            'IsLucened': this.state.IsLucened,
            'MetaDataCode': this.state.MetaDataCode,
            'MetaDataID': this.state.MetaDataID,
            'MetaTemplateID': this.state.MetaTemplateID,
            'MetaTemplateID1': this.state.MetaTemplateID1,
            'OldPageCount': this.state.OldPageCount,
            'PageCount': this.state.PageCount,
            'ParentFolderID': this.state.ParentFolderID,
            'RepositoryID': this.state.RepositoryID,
            'Size': this.state.Size,
            'Status': this.state.Status,
            'Status1': this.state.Status1,
            'Status2': this.state.Status2,
            'Tag': this.state.Tag,
            'UpdatedBy': this.state.UpdatedBy,
            'UpdatedBy1': this.state.UpdatedBy1,
            'UpdatedBy2': this.state.UpdatedBy2,
            'UpdatedOn': this.state.UpdatedOn,
            'UpdatedOn1': this.state.UpdatedOn1,
            'UpdatedOn2': this.state.UpdatedOn2,
        };
        db.sqlBatch([
            'CREATE TABLE IF NOT EXISTS tbl_history (id integer primary key AUTOINCREMENT, size text, user_id integer)',
            ['INSERT INTO tbl_history (size, user_id) VALUES (?,?)', [JSON.stringify(Size), this.state.UserID]],
        ], function() {
            this.refs.toast.show("File downloaded successfully");
        }, (e) => {});
    }

    async copyItem() {
        const params = this.props.navigation.state.params
        AsyncStorage.setItem('selectedFileID', tempData.ID.toString());
        AsyncStorage.setItem('currentFolderID', tempData.FolderID.toString());
        // this.props.navigation.navigate('First', { action: "1" })
        this.props.navigation.navigate("Second",{CreatedBy:params.repoCreatedBy , ID:params.repoID, RepositoryID:params.repoRepositoryID,
            RepositoryName:params.repoRepositoryName,Status:params.repoStatus, action: '1'})
        this.setState({ isLoading: false, LoadingDialog: false})
    }

    async moveItem() {
        const params = this.props.navigation.state.params
        AsyncStorage.setItem('selectedFileID', tempData.ID.toString());
        AsyncStorage.setItem('currentFolderID', tempData.FolderID.toString());
        // this.props.navigation.navigate('First', { action: "2" })
        this.props.navigation.navigate("Second",{CreatedBy:params.repoCreatedBy , ID:params.repoID, RepositoryID:params.repoRepositoryID,
            RepositoryName:params.repoRepositoryName,Status:params.repoStatus, action: '2'})
        this.setState({ isLoading: false, LoadingDialog: false})
    }

    askDelete() {
        AppAlert({
            title: 'Delete',
            subtitle: 'Are you sure you want to delete?',
            ok: () => {
                this.deleteItem();
            },
            cancel: () => {
                this.setState({ isLoading: false, LoadingDialog: false})
            }
        });
    }

    deleteItem() {
        this.setState({ isLoading: true, LoadingDialog: true })
        const pass_data = {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: "",
        };
        fetch(api.Delete_URL + "/" + tempData.ID + "/" + this.state.ID, pass_data)
            .then(res => res.json())
            .then(res => {
                this.setState({ isLoading: false, LoadingDialog:false });
                if (res.IsSuccess == "1") {
                    this.setState({ selected: 0 });
                    this.GetAllVDR().then(() => {
                        this.refs.toast.show('Delete done');
                    });
                } else {
                    this.refs.toast.show('Delete failed');
                }
            }).catch((error) => {
                this.setState({ isLoading: false, LoadingDialog:false });
                this.refs.toast.show('Delete failed');
            })
    }

    search(text) {
        this.setState({ searchtrue: true , text:text})
        const { dataSource } = this.state;
        var text1 = text;
        var array = [], array1 = [];
        var i = 0;
        for (i; i < dataSource.length; i++) {
            if (dataSource[i].DocumentName){
                if (dataSource[i].DocumentName.toLowerCase().indexOf(text.toLowerCase()) >= 0) {
                    array1.push(dataSource[i]);
                }
            }
            else if (dataSource[i].FolderName){
                if (dataSource[i].FolderName.toLowerCase().indexOf(text.toLowerCase()) >= 0) {
                    array1.push(dataSource[i]);
                }
            }
        }
        this.setState({ newdataSource: array1 })
    }

    onButtonPress = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
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
        if (this.timer) clearTimeout(this.timer);
    }

    openNext(item) {
        var params = this.props.navigation.state.params
        this.props.navigation.navigate("SelectedSubFolder3", {
            FolderName: item.FolderName,
            ID: item.ID, FolderID: item.ID,
            ParentFolderID: item.ParentFolderID,
            RepositoryID: params.RepositoryID,
            MetaTemplateID: params.MetaTemplateID,
            DepartmentId: params.DepartmentId,
            repoCreatedBy: params.repoCreatedBy, repoID: params.repoID, repoRepositoryID: params.repoRepositoryID, repoRepositoryName: params.repoRepositoryName, repoStatus: params.repoStatus
        })
    }

    render() {
        console.log("ddddddddd==>", this.state.dataSource.length) 
        const options2 = [
            'Cancel',
            {
                component: <View
                    style={styles.options2Row}>
                    <Text style={styles.options2Text}>File Size</Text>
                    {this.state.ascSize &&
                        <Text style={styles.options2Text}>- Asc</Text>
                    }
                    {this.state.descSize &&
                        <Text style={styles.options2Text}>- Desc</Text>
                    }
                </View >,
                height: 40,
            },
            {
                component: <View
                    style={styles.options2Row}>
                    <Text style={styles.options2Text}>File Type</Text>
                    {this.state.ascType &&
                        <Text style={styles.options2Text}>- Asc</Text>
                    }
                    {this.state.descType &&
                        <Text style={styles.options2Text}>- Desc</Text>
                    }
                </View >,
                height: 40,
            },
            {
                component: <View
                    style={styles.options2Row}>
                    <Text style={styles.options2Text}>Last Modified</Text>
                    {this.state.ascModified &&
                        <Text style={styles.options2Text}>- Asc</Text>
                    }
                    {this.state.descModified &&
                        <Text style={styles.options2Text}>- Desc</Text>
                    }
                </View >,
                height: 40,
            }, {
                component: <View
                    style={styles.options2Row}>
                    <Text style={styles.options2Text}>Reset</Text>
                </View >,
                height: 40,
            },
        ]
        // const { selected2 } = this.state
        // const selectedText2 = options2[selected2].component || options2[selected2]

        const options3 = [
            'Cancel',
            {
                component: <View
                    style={styles.options1Row}>
                    <Image
                        source={Images.download}
                        style={{ width: 25, height: 25, marginRight: 10 }} />
                    <Text style={styles.options1Text}>Download</Text>
                </View >,
                height: 40,
            },
        ]
        // const { selected3 } = this.state
        // const selectedText3 = options3[selected3].component || options3[selected3]
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
                <Header type="back" title={params.FolderName} navigation={this.props.navigation}/>
                { this.state.dataSource.length > 0 &&
                <View style={{
                    backgroundColor: '#333333', width: '100%',
                    height: 60, marginTop: 5, flexDirection: 'row', alignItems: 'center'
                }}>
                    <Image style={styles.searchIcon}
                            source={Images.search} />
                    <TextInput
                        placeholder={"Search File"}
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
                <View>
                    {this.state.searchtrue &&
                        <FlatList
                            style={{marginBottom:170}}
                            data={this.state.newdataSource}
                            scrollEnabled={true}
                            renderItem={({ item }) =>
                                <View
                                    style={styles.uperCard}>
                                    {item.DocumentName ?     
                                    <View style={styles.uperCardChild}>
                                        <FiletypeIcon
                                            extention={item.DocumentType}
                                            style={styles.listIcon}
                                        />
                                        <View>
                                            <Text style={styles.itemText}>{ellipsis(item.DocumentName)} </Text>
                                        </View>
                                        {(DownloadRole == '1' || UploadRole == '1' || ViewRole == '1' || MoveCopyRole == '1') &&
                                            <TouchableOpacity onPress={() => this.onCheckBoxPress(item)}
                                            style={styles.itemActions}>
                                                <Image
                                                    source={Images.menu}
                                                    style={styles.listIcon} />
                                            </TouchableOpacity>
                                        }
                                    </View>
                                    :
                                    <TouchableOpacity onPress={() => this.openNext(item)} >
                                        <View style={styles.uperCardChild}>
                                            <Image
                                                source={Images.folder}
                                                style={styles.itemIcon} />
                                            <View>
                                                <Text style={styles.itemText}>{ellipsis(item.FolderName)}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    }
                                    <View style={{ height: 1, backgroundColor: '#000', marginLeft: 10, marginRight: 10 }} />
                                </View>
                            } keyExtractor={(item, index) => index.toString()} />
                    }
                    {this.state.searchtrue == false &&                      
                        <FlatList
                            style={{marginBottom:170}}
                            data={this.state.dataSource}
                            scrollEnabled={true}
                            renderItem={({ item }) =>
                                <View
                                    style={styles.uperCard}>
                                    {item.DocumentName ?
                                    <View style={styles.uperCardChild}>
                                            <FiletypeIcon
                                                extention={item.DocumentType}
                                                style={styles.listIcon}
                                            />
                                            <View>
                                                <Text style={styles.itemText}>{ellipsis(item.DocumentName)} </Text>
                                            </View>                                        
                                        {(DownloadRole == '1' || UploadRole == '1' || ViewRole == '1' || MoveCopyRole == '1') &&
                                            <TouchableOpacity onPress={() => this.onCheckBoxPress(item)}
                                            style={styles.itemActions}>
                                                <Image
                                                    source={Images.menu}
                                                    style={styles.listIcon} />
                                            </TouchableOpacity>
                                        }
                                    </View>
                                    :
                                    <TouchableOpacity onPress={() => this.openNext(item)} >
                                        <View style={styles.uperCardChild}>
                                            <Image
                                                source={Images.folder}
                                                style={styles.itemIcon} />
                                            <View>
                                                <Text style={styles.itemText}>{ellipsis(item.FolderName)}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    }
                                    <View style={{ height: 1, backgroundColor: '#000', marginLeft: 10, marginRight: 10 }} />
                                </View>
                        } keyExtractor={(item, index) => index.toString()} />
                    }
                    <ActionSheet
                        ref={this.getActionSheetRef1}
                        title={title1}
                        options={options1}
                        cancelButtonIndex={CANCEL_INDEX1}
                        destructiveButtonIndex={DESTRUCTIVE_INDEX1}
                        onPress={this.handlePress1}
                    />
                    <ActionSheet
                        ref={this.getActionSheetRef2}
                        title={title2}
                        options={options2}
                        cancelButtonIndex={CANCEL_INDEX2}
                        destructiveButtonIndex={DESTRUCTIVE_INDEX2}
                        onPress={this.handlePress2}
                    />
                    <ActionSheet
                        ref={this.getActionSheetRef3}
                        title={title1}
                        options={options3}
                        cancelButtonIndex={CANCEL_INDEX2}
                        destructiveButtonIndex={DESTRUCTIVE_INDEX3}
                        onPress={this.handlePress3}
                    />
                </View>

                <WaitMessage
                    visible={this.state.LoadingDialog}
                    onTouchOutside={() => this.setState({ LoadingDialog: true })}
                />

                {this.state.showMp3Player && <Mp3Player
                    url={this.state.itemUrl}
                    visible={this.state.showMp3Player}
                    onTouchOutside={() => this.setState({ showMp3Player: false })}
                    onClose={() => this.setState({ showMp3Player: false })}
                />}
                <Footer style={styles.footer}>
                    <View
                        style={{ width: '100%', backgroundColor: "#FFFFFF", flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={this.showActionSheet2}
                            style={{ alignItems: 'center', position: "absolute", left: 10, flexDirection: 'row' }}>
                            <Image source={Images.sort} style={{ width: 30, height: 30, tintColor: '#000' }} />
                            <Text style={styles.footerSort}>Sort</Text>
                        </TouchableOpacity>
                        { UploadRole == "1" &&
                        <TouchableOpacity onPress={() => this.Upload()} style={{ alignItems: 'center', position: "absolute", right: 10, flexDirection: 'row' }}>
                            <Text style={styles.footerUpload}>Upload</Text>
                            <Image source={Images.upload} style={{ width: 30, height: 30, }} />
                        </TouchableOpacity>
                        }
                    </View>

                </Footer>
                <Toast ref="toast"/>
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
    itemIcon: {
        width: '25@ms',
        height: '25@ms',
    },
    popupView: {
        marginTop: 20,
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        borderRadius: 15
    },
    popupText: {
        fontFamily: Fonts.base,
        fontSize: 14,
        margin: 8,
        color: '#000',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    listIcon: {
        width: '25@ms',
        height: '25@ms',
    },
    uperCardChild: {
        flexDirection: 'row',
        marginLeft: 20,
        marginRight: 20,
        marginTop: '10@ms',
        backgroundColor: 'transparent',
        marginBottom: '10@ms',
        alignItems: 'center',
    },
    uperCard: {
        marginTop: 2,
        backgroundColor: 'transparent',
        borderRadius: 5,
    },
    footer: {
        position: 'absolute',
        height: 50,
        bottom: 0,
        backgroundColor: "#FFFFFF"
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
    footerSort: {
        marginLeft: 15,
        fontWeight: 'bold',
        color: "#000",
        fontSize: '15@ms',
    },
    footerUpload: {
        marginRight: 5,
        fontWeight: 'bold',
        color: "#000",
        fontSize: '15@ms',
    },
    options1Text: {
        color: 'blueviolet',
        fontSize: '18@ms0.3',
    },
    options1Row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: '38%',
    },
    options2Text: {
        marginLeft: 2,
        color: 'grey',
        fontSize: '18@ms0.3',
    },
    options2Row: {
        position: 'absolute',
        alignItems: 'center',
        left: 20,
        flexDirection: "row"
    },
});

