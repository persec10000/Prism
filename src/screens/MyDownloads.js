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
    FlatList,
    ToastAndroid,
    AlertIOS,
    PanResponder,
    ActivityIndicator,
    BackHandler,
    AppState,
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
var SQLite = require('react-native-sqlite-storage')
var RNFetchBlob = require('react-native-fetch-blob').default;
const db = SQLite.openDatabase("virtualdata.db", "1.0", "virtualdata Database", 200000);
import Sound from 'react-native-sound';
import { Dialog } from 'react-native-simple-dialogs';
import FS from 'react-native-fs';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';

import api from '../api'
import { Colors, Fonts, Images, dialogStyle } from '../themes';
import {FiletypeIcon, UserInactivity, ActionSheet, Header, Mp3Player} from '../Components';
import {GoLogin, ellipsis} from '../Helpers';

const CANCEL_INDEX2 = 0
const DESTRUCTIVE_INDEX2 = 4
const title2 = <Text style={{ color: '#000', fontSize: moderateScale(18), textAlign: 'center' }}>Sort By</Text>

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height
var UserID, url;
var UserEmailID;
var play = require('../images/play.png')
var pause = require('../images/pause.jpg')

export default class MyDownloads extends React.Component {
    static navigationOptions = {
        header: null
        //headerMode: 'none'
    };
    constructor(props) {
        super(props)
        this.state = {
            enable: false,
            selected1: 1, selected2: 1,
            searchtrue: false,
            isLoading: false,
            ascSize: false,
            descSize: false,
            ascModified: false,
            descModified: false,
            ascType: false,
            descType: false,
            value: 1,
            LoadingDialog: false,
            play: pause,
            focus: false,
            tmpMp3File: null,
            itemUrl: null,
            dataSource: []
        };
        this.focus = false
        this.timer = null;
    }

    componentWillUnmount() {
        this.focusListener.remove()
        this.blurListener.remove()
        this.back_componentWillUnmount();
        if (this.timer) clearTimeout(this.timer);
    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener("didFocus", () => {
            this.focus = true
        });
        this.blurListener = this.props.navigation.addListener("didBlur", () => {
            this.focus = false
        });
       this.getalldata();
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

    SortBy(prop, inAscOrder) {
        return function (a, b) {
            if (a[prop] > b[prop]) {
                return inAscOrder === 1 ? 1 : -1; //  in case to show  large to small order in case of integer
                //return 1;
            } else if (a[prop] < b[prop]) {
                return inAscOrder === 1 ? -1 : 1;
                //return -1;
            }
            return 0;
        }
    }
    //actionSheet start//
    showActionSheet2 = () => this.actionSheet2.show()
    getActionSheetRef2 = ref => (this.actionSheet2 = ref)
    handlePress2 = index => this.actionSheetfuncton1(index)
    //actionSheet end//

    ResetArray() {
        this.setState({ isLoading: true, searchtrue: true , LoadingDialog:false })
        this.getalldata();
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
    actionSheetfuncton1(index) {
        if (index == 1) {
            this.latestUse()
            if (this.state.ascSize == false) {
                if (this.state.descSize == false) {
                    this.setState({
                        ascSize: false,
                        descSize: true,
                        value: 1,
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
                        value: 0
                    })
                }
            }
            this.setState({ isLoading: true })
        }
        if (index == 2) {
            this.FileType();
            if (this.state.ascType == false) {
                if (this.state.ascType == false) {
                    this.setState({
                        ascType: false,
                        descType: true,
                        ascModified: false,
                        descModified: false,
                        ascSize: false,
                        descSize: false,
                        value: 1
                    })
                } else {
                    this.setState({
                        ascType: true,
                        descType: false,
                        ascModified: false,
                        descModified: false,
                        ascSize: false,
                        descSize: false,
                        value: 0
                    })
                }
            }
            this.setState({ isLoading: true })
        }
        if (index == 3) {
            this.LastModified();
            if (this.state.ascModified == false) {
                if (this.state.ascModified == false) {
                    this.setState({
                        ascModified: false,
                        descModified: true,
                        ascType: false,
                        descType: false,
                        ascSize: false,
                        descSize: false,
                        value: 1
                    })
                } else {
                    this.setState({
                        ascModified: true,
                        descModified: false,
                        ascType: false,
                        descType: false,
                        ascSize: false,
                        descSize: false,
                        value: 0
                    })
                }
            }
            this.setState({ isLoading: true })
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
            })
            this.setState({ isLoading: true })
        }
    }
    onValueChange(value) {
        this.setState({
            selected1: value
        });
    }
    async openFile(item) {
        if (item.DocumentType.toLowerCase() == ".mp3") {
                this.setState({
                    LoadingDialog: true,
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
    async getalldata() {
        UserID = await AsyncStorage.getItem('ID');
        UserEmailID = await AsyncStorage.getItem('EmailID');
        var _this = this;
        db.transaction(function (tx) {
            var query = "SELECT * FROM tbl_history WHERE user_id=?";
            tx.executeSql(query, [UserID], function (tx, resultSet) {
                var dataArray = [];
                var dataArray1 = [];
                for (var x = 0; x < resultSet.rows.length; x++) {
                    dataArray1.push(JSON.parse(resultSet.rows.item(x).size),
                    );
                }
                _this.setState({ dataSource: dataArray1 });
            }, function (tx, error) {
            });
        }, function (error) {
        }, function () {
        });
    }

    search(text) {
        this.setState({ searchtrue: true ,text:text })
        const { dataSource } = this.state;
        var text1 = text;
        var array = [], array1 = [];
        var i = 0;
        for (i; i < dataSource.length; i++) {
            if (dataSource[i].DocumentName.toLowerCase().indexOf(text.toLowerCase()) >= 0) {
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
        Alert.alert(
            'Prism',
            'Are you sure you want to exit from App?',
            [
                { text: 'cancel'},
                { text: 'OK', onPress: ()=>{
                    BackHandler.exitApp()
                }},
            ],
            { cancelable: false }
        )
        return true;
    }

    back_componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    back_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    render() {
        const options2 = [
            'Cancel',
            {
                component: <View
                    style={styles.optionsRow}>
                    <Text style={styles.optionsText}>File Size</Text>
                    {this.state.ascSize &&
                        <Text style={styles.optionsText}>- Asc</Text>
                    }
                    {this.state.descSize &&
                        <Text style={styles.optionsText}>- Desc</Text>
                    }
                </View >,
                height: 40,
            },
            {
                component: <View
                    style={styles.optionsRow}>
                    <Text style={styles.optionsText}>File Type</Text>
                    {this.state.ascType &&
                        <Text style={styles.optionsText}>- Asc</Text>
                    }
                    {this.state.descType &&
                        <Text style={styles.optionsText}>- Desc</Text>
                    }
                </View >,
                height: 40,
            },
            {
                component: <View
                    style={styles.optionsRow}>
                    <Text style={styles.optionsText}>Last Modified</Text>
                    {this.state.ascModified &&
                        <Text style={styles.optionsText}>- Asc</Text>
                    }
                    {this.state.descModified &&
                        <Text style={styles.optionsText}>- Desc</Text>
                    }
                </View >,
                height: 40,
            }, {
                component: <View
                    style={styles.optionsRow}>
                    <Text style={styles.optionsText}>Reset</Text>
                </View >,
                height: 40,
            },
        ]
        const { selected2 } = this.state
        const selectedText2 = options2[selected2].component || options2[selected2]
        return (
            <UserInactivity
                onInactivity={(active)=> {
                    if (!active && this.focus) {
                    GoLogin(this.props.navigation)
                }
                }}
            >
            <View style={styles.container}>
                <Header type="menu" title="Download History" navigation={this.props.navigation}/>
                { this.state.dataSource.length > 0 &&
                <View style={{
                    backgroundColor: '#333333', width: '100%',
                    height: 60, marginTop: 5, flexDirection: 'row', alignItems: 'center'
                }}>
                    <Image style={styles.searchIcon} source={Images.search} />
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
                    <View style={{ marginBottom: 175 }}>
                        <FlatList
                            data={this.state.newdataSource}
                            scrollEnabled={true}
                            renderItem={({ item }) =>
                                <View style={styles.uperCard}>
                                    <View style={styles.uperCardChild}>
                                        <FiletypeIcon
                                            extention={item.DocumentType}
                                            style={styles.listIcon}
                                        />
                                        <View>
                                                <Text style={styles.itemText}>{ellipsis(item.DocumentName)} </Text>
                                        </View>
                                        <TouchableOpacity onPress={() => this.openFile(item)}
                                            style={styles.itemActions}>
                                            <Image
                                                source={Images.view}
                                                style={styles.listIcon} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ height: 1, backgroundColor: '#000', marginLeft: 10, marginRight: 10 }} />
                                </View>

                            } keyExtractor={(item, index) => index.toString()} />
                    </View>
                }
                {this.state.isLoading == true &&
                    <View
                        style={{
                            backgroundColor: 'transparent',
                            marginTop: 20, flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        <ActivityIndicator
                            color={Colors.whiteColor}
                            size='large'
                        />
                        <Text style={{ marginLeft: 15, fontSize: 17, color: '#FFFFFF', fontWeight: "bold" }}>Please Wait..</Text>
                    </View>
                }
                {this.state.searchtrue == false &&
                    <View style={{ marginBottom: 175 }}>
                        {
                            this.state.dataSource.length > 0?
                        <FlatList
                        data={this.state.dataSource}
                        scrollEnabled={true}
                        renderItem={({ item }) =>
                            <View style={styles.uperCard}>
                                <View style={styles.uperCardChild}>
                                    <FiletypeIcon
                                        extention={item.DocumentType}
                                        style={styles.listIcon}
                                    />
                                    <View>
                                        <Text style={styles.itemText}>{ellipsis(item.DocumentName)} </Text>
                                    </View>
                                    <TouchableOpacity onPress={() => this.openFile(item)}
                                        style={styles.itemActions}>
                                        <Image
                                            source={Images.view}
                                            style={styles.listIcon} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ height: 1, backgroundColor: '#000', marginLeft: 10, marginRight: 10 }} />
                            </View>
                        }keyExtractor={(item, index) => index.toString} />
                        :
                        <Text style={{textAlign: 'center', marginTop: 20, color: 'white', fontSize: moderateScale(15)}}>No Documents Downloaded</Text>

                        }
                    </View>
                }
                <ActionSheet
                    ref={this.getActionSheetRef2}
                    title={title2}
                    options={options2}
                    cancelButtonIndex={CANCEL_INDEX2}
                    destructiveButtonIndex={DESTRUCTIVE_INDEX2}
                    onPress={this.handlePress2}
                />
                {this.state.LoadingDialog && <Mp3Player
                    url={this.state.itemUrl}
                    visible={this.state.LoadingDialog}
                    onTouchOutside={() => this.setState({ LoadingDialog: false })}
                    onClose={() => this.setState({ LoadingDialog: false })}
                />}
                <Footer style={styles.footer}>
                    <View style={{ width: '100%', backgroundColor: "#FFFFFF", flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={this.showActionSheet2}
                            style={{ alignItems: 'center', position: "absolute", left: 10, flexDirection: 'row' }}>
                            <Image source={Images.sort} style={{ width: 30, height: 30, tintColor: '#000' }} />
                            <Text style={{ marginLeft: 15, fontWeight: 'bold', color: "#000", fontSize: moderateScale(15) }}>
                                Sort</Text>
                        </TouchableOpacity>
                    </View>
                </Footer>
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
        marginTop: 10,
        marginLeft:20,
        marginRight:20,
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
    rightPicView: {
        position: 'absolute',
        right: 0
    },
    footer: {
        position: 'absolute',
        height: 50,
        bottom: 0,
        backgroundColor: "#FFFFFF"
    },
    titleText: {
        fontSize: '18@ms',
        color:"#000",
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
    optionsRow: {
        position: 'absolute',
        left: 20,
        flexDirection: "row",
    },
    optionsText: {
        marginLeft: 2,
        color: 'grey',
        fontSize: '18@ms0.3',
    },
});

