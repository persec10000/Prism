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
    ToastAndroid,
    AlertIOS,
    AsyncStorage,
    NativeModules,
    TextInput,
    ListView,
    FlatList, ActivityIndicator, PanResponder,
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
import { ScaledSheet } from 'react-native-size-matters';

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
} from '../themes'
import api from '../api';
import {WaitMessage, UserInactivity, ActionSheet, Header} from '../Components';
import {GoLogin, ellipsis} from '../Helpers';

const profileImage = 'https://hubbe.rs/uploads/connectedmug55x33jpg-50984.jpg'

let ID, UserName, RoleID, FirstName, LastName, EmailID, Download, Upload , tempData;

export default class SelectedFolder extends React.Component {
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
            selected: 1,
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
        await fetch(api.GetAllVdrMetaTemplates_URL + "/" + this.state.RoleID + "/" + this.state.ID + "/" + params.RepositoryID+ "/" +params.DeptID).then(res => res.json())
            .then(res => {

                if (res.IsSuccess == "1") {
                    this.setState({ isLoading: false , LoadingDialog:false })
                    try {
                        let message = JSON.parse(res.Message);
                        console.log("333333333==",message);
                        this.setState({
                            isLoading: false,
                            dataSource: message,
                        })
                    } catch (error) {
                        this.setState({ isLoading: false ,LoadingDialog:false })
                        Platform.select({
                            ios: () => { AlertIOS.alert(error + ' '); },
                            android: () => { ToastAndroid.show(error + ' ', ToastAndroid.SHORT); }
                        })();
                    }
                } else {
                    Platform.select({
                        ios: () => { AlertIOS.alert(res.Message); },
                        android: () => { ToastAndroid.show(res.Message, ToastAndroid.SHORT); }
                    })();
                    this.setState({ isLoading: false ,LoadingDialog:false })
                }
            }
        )
    }
    search(text) {
        this.setState({ searchtrue: true ,text:text })
        const { dataSource } = this.state;
        var text1 = text;
        var array = [], array1 = [];
        var i = 0;
        for (i; i < dataSource.length; i++) {
            if (dataSource[i].MetaTemplateName.toLowerCase().indexOf(text.toLowerCase()) >= 0) {
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

    render() {
        const options = [
            'Cancel',
            {
                component: <TouchableOpacity onPress={() => this.moveItem()}
                    style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Image
                        source={Images.move}
                        style={{ width: 25, height: 25, marginRight: 10 }} />
                    <Text style={{ color: 'blueviolet', fontSize: 18 }}>Move</Text>
                </TouchableOpacity >,
                height: 40,
            },
            {
                component: <TouchableOpacity onPress={() => this.add()}
                    style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Image
                        source={Images.media}
                        style={{ width: 25, height: 25, marginRight: 10 }} />
                    <Text style={{ color: 'blueviolet', fontSize: 18 }}>Download</Text>
                </TouchableOpacity >,
                height: 40,
            },
            {
                component: <TouchableOpacity onPress={() => this.copyItem()}
                    style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Image
                        source={Images.view}
                        style={{ width: 25, height: 25, tintColor: '#000', marginRight: 10 }} />
                    <Text style={{ color: 'blueviolet', fontSize: 18 }}>Copy</Text>
                </TouchableOpacity >,
                height: 40,
            },
            {
                component: <TouchableOpacity onPress={() => this.renameItem()}
                    style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Image
                        source={Images.edit}
                        style={{ width: 25, height: 25, marginRight: 10 }} />
                    <Text style={{ color: 'blueviolet', fontSize: 18 }}>Rename</Text>
                </TouchableOpacity >,
                height: 40,
            },
            {
                component: <TouchableOpacity onPress={() => this.deleteItem()}
                    style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Image
                        source={Images.delete}
                        style={{ width: 25, height: 25, marginRight: 10 }} />
                    <Text style={{ color: 'blueviolet', fontSize: 18 }}>Delete</Text>
                </TouchableOpacity >,
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
                <Header type="back" title={params.DepartmentName} navigation={this.props.navigation}/>
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
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate("SelectedSubFolder", {
                                        CreatedBy: item.CreatedBy, ID: item.ID, RepositoryID: params.RepositoryID,
                                        MetaTemplateName: item.MetaTemplateName, MetaTemplateID: item.ID, DepartmentId:params.DeptID,
                                        repoCreatedBy: params.CreatedBy, repoID: params.ID, repoRepositoryID: params.RepositoryID, repoRepositoryName: params.RepositoryName, repoStatus: params.Status
                                    })}>
                                        <View style={styles.uperCardChild}>
                                            <Image
                                                source={Images.folder}
                                                style={styles.itemIcon} />
                                            <View>
                                                <Text style={styles.itemText}>{ellipsis(item.MetaTemplateName)}</Text>
                                            </View>
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
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate("SelectedSubFolder", {
                                        CreatedBy: item.CreatedBy, ID: item.ID, RepositoryID: params.RepositoryID,
                                        MetaTemplateName: item.MetaTemplateName, MetaTemplateID: item.ID, DepartmentId:params.DeptID,
                                        repoCreatedBy: params.CreatedBy, repoID: params.ID, repoRepositoryID: params.RepositoryID, repoRepositoryName: params.RepositoryName, repoStatus: params.Status
                                    })}>
                                        <View style={styles.uperCardChild}>
                                            <Image
                                                source={Images.folder}
                                                style={styles.itemIcon} />
                                            <View>
                                                <Text style={styles.itemText}>{ellipsis(item.MetaTemplateName)}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    <View style={{ height: 1, backgroundColor: '#000', marginLeft: 10, marginRight: 10 }} />
                                </View>

                            } keyExtractor={(item, index) => index.toString()} />


                    </View>
                }

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

