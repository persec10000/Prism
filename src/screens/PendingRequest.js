import React, { Component } from "react";
import {
    View,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    Platform,
    AsyncStorage,
    FlatList,
    ToastAndroid,
    AlertIOS,
    Modal,
    BackHandler,
} from "react-native";
import {Text} from "native-base";
import { Dropdown } from 'react-native-material-dropdown';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import {
    Colors,
    Fonts,
    Images,
    dialogStyle,
} from '../themes'
import api from '../api'
import {WaitMessage, FiletypeIcon, UserInactivity, ActionSheet, Header} from '../Components';
import {GoLogin, ellipsis} from '../Helpers';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height
const profileImage = 'https://hubbe.rs/uploads/connectedmug55x33jpg-50984.jpg'

const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4
const title = <Text style={{ color: 'crimson', fontSize: 18 }}>Which one do you like?</Text>

let ID, UserName, RoleID, FirstName, LastName, EmailID, Download, Upload, tempData;

export default class PendingRequest extends React.Component {
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
            LoadingDialog:true,
            dataSource: [],
            sortdata: "",
            newdataSource:[],
            isVisible: false,
        };
        this.timer = null;
        this.onChangeText = this.onChangeText.bind(this);
    }
      
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
   
    handleBackButton = () => {
        this.props.navigation.goBack(null)      
        return true;
    }

    componentDidMount() {     
        this.props.navigation.addListener("didFocus",()=>{
            this.GetAllVDR();
        })     
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
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);     
    }

    async GetAllVDR() {
        await fetch(api.GetPendingRequest + "/" + this.state.ID + "/" + this.state.RoleID).then(res => res.json())
            .then(res => {
                if (res.IsSuccess == "1") {
                    this.setState({ isLoading: false ,LoadingDialog:false })
                    try {
                        let message = JSON.parse(res.Message);
                        console.log(message);
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
                        ios: () => { AlertIOS.alert("No Requests"); },
                        android: () => { ToastAndroid.show("No Requests", ToastAndroid.SHORT); }
                    })();
                    this.setState({ isLoading: false ,LoadingDialog:false })
                }
                 this.setState({ isLoading: false ,LoadingDialog:false })
            })
         this.setState({ isLoading: false ,LoadingDialog:false })
    }
    
    onChangeText(text) {
        this.setState({searchtrue: true , text:text})
        const { dataSource } = this.state;
        let text1 = text;
        let array = [], array1 = [];
        let i = 0;
        if (text1 == 'Date'){
            for (i; i < dataSource.length; i++) {
                array.push(Date.parse(dataSource[i].HTcreatedOn));
                array.sort(function(a,b){return b-a})   
            }

            for (j=0; j<array.length;j++){
                for (k=0; k<dataSource.length; k++){
                    if (array[j] == Date.parse(dataSource[k].HTcreatedOn)){
                        array1.push(dataSource[k]);
                    }
                }
            }
        }
        else if (text1 == 'Status'){
            for(i; i<dataSource.length;i++){
                if (dataSource[i].HTStatus.indexOf("InProgress") >= 0) {
                    array1.push(dataSource[i]);
                }
            }
        }
        this.setState({ newdataSource: array1})
    }

    render() {
        let data = [{
            value: 'Date',
          }, {
            value: 'Status',
        }];
        return (
            <View style={styles.container}>
                <Header type="back" title="PENDING REQUESTS" navigation={this.props.navigation}/>
                <Dropdown
                    label='Sort by'
                    data={data}
                    value={this.state.sortdata}
                    onChangeText={(text)=>this.onChangeText(text)}
                    baseColor='#00FF00'
                    textColor='#00FF00'
                    itemColor='gray'
                    selectedItemColor='black'
                />                
                {this.state.noData == true &&
                    <View style={{ justifyContent: "center", alignItems: "center", alignContent: 'center' }} >
                        <Text style={{ marginLeft: 20, fontWeight: 'bold', color: "#fff", fontSize: 15, textAlign: 'center' }}>
                            This Folder is empty
                        </Text>
                    </View>
                }
                <ScrollView>
                    {this.state.searchtrue &&
                        <FlatList
                        data={this.state.newdataSource}
                        scrollEnabled={true}
                        renderItem={({ item }) =>
                        <TouchableOpacity onPress={()=>this.props.navigation.navigate('SubPending',{
                            item: item, workspaceid: item.workspaceid, UserId: this.state.ID, HumanTaskid: item.humantaskid
                        })}>
                            <View style={styles.componentsSection}>
                                <View style={styles.carditem}>
                                    <Text style={styles.itemText1}>CreatedOn: </Text>
                                    <View style={{justifyContent:"flex-end"}}>
                                        <Text style={styles.itemText2}>{ellipsis(item.HTcreatedOn)}</Text>
                                    </View>
                                    
                                </View>
                                <View style={styles.carditem}>
                                    <Text style={styles.itemText1}>File Name: </Text>
                                    <View style={{justifyContent:'flex-end'}}>
                                        <Text style={styles.itemText2}>{ellipsis(item.DocumentName)}</Text>
                                    </View>
                                </View>
                                {(item.RepositoryName||item.DepartmentName||item.MetaTemplateName||item.FolderName)&&
                                    <View>
                                        <View style={styles.carditem}>
                                            <Text style={styles.itemText1}>Folder Name: </Text>
                                            <Text style={styles.itemText2}>{ellipsis(item.RepositoryName+'/'+item.DepartmentName)+'/'+'\n'+ellipsis(item.MetaTemplateName+'/'+item.FolderName)}</Text>
                                        </View>
                                    </View>
                                }
                                {/* {(item.RepositoryName||item.DepartmentName||item.MetaTemplateName||item.FolderName)&&
                                    <View>
                                        <View style={styles.carditem}>
                                            <Text style={styles.itemText1}>Folder Name: </Text>
                                            <Text style={styles.itemText2}>{ellipsis(item.RepositoryName)+'/'+ellipsis(item.DepartmentName)+'/'}</Text>
                                        </View>
                                        <View style={styles.carditem1}>
                                        <Text style={styles.itemText2}>{ellipsis(item.MetaTemplateName)+'/'+ellipsis(item.FolderName)}</Text>
                                        </View>
                                    </View>
                                } */}
                                <View style={styles.carditem}>
                                    <Text style={styles.itemText1}>Status: </Text>
                                    <Text style={styles.itemText2}>{ellipsis(item.HTStatus)}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        } keyExtractor={(item, index) => index.toString()} />
                    }
                    {this.state.searchtrue == false &&
                        <FlatList
                            data={this.state.dataSource}
                            scrollEnabled={true}
                            renderItem={({ item }) =>
                            <TouchableOpacity onPress={()=>this.props.navigation.navigate('SubPending',{
                                item: item, workspaceid: item.workspaceid, UserId: this.state.ID, HumanTaskid: item.humantaskid
                            })}>
                                <View style={styles.componentsSection}>
                                    <View style={styles.carditem}>
                                        <Text style={styles.itemText1}>CreatedOn: </Text>
                                        <View style={{justifyContent:"flex-end"}}>
                                            <Text style={styles.itemText2}>{ellipsis(item.HTcreatedOn)}</Text>
                                        </View>
                                        
                                    </View>
                                    <View style={styles.carditem}>
                                        <Text style={styles.itemText1}>File Name: </Text>
                                        <View style={{justifyContent:'flex-end'}}>
                                            <Text style={styles.itemText2}>{ellipsis(item.DocumentName)}</Text>
                                        </View>
                                    </View>                              
                                    {(item.RepositoryName||item.DepartmentName||item.MetaTemplateName||item.FolderName)&&
                                        <View>
                                            <View style={styles.carditem}>
                                                <Text style={styles.itemText1}>Folder Name: </Text>
                                                <Text style={styles.itemText2}>{ellipsis(item.RepositoryName+'/'+item.DepartmentName)+'/'+'\n'+ellipsis(item.MetaTemplateName+'/'+item.FolderName)}</Text>
                                            </View>
                                        </View>
                                    }
                                    <View style={styles.carditem}>
                                        <Text style={styles.itemText1}>Status: </Text>
                                        <Text style={styles.itemText2}>{ellipsis(item.HTStatus)}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            } keyExtractor={(item, index) => index.toString()} />
                    }
                  
                </ScrollView>

                <WaitMessage
                    visible={this.state.LoadingDialog}
                    onTouchOutside={() => this.setState({ LoadingDialog: true })}
                />
            </View >
        );
    }
}

const styles = ScaledSheet.create({
    container: {
        height: '100%',
        backgroundColor: '#285A7F'
    },
    componentsSection: {
        backgroundColor: 'white',
        padding: 6,
        borderRadius: 5,
        margin: 6
    },
    itemText1: {
        marginLeft: '5@ms',
        color: '#000',
        fontSize: '13@ms',
    },
    itemText2: {
        // marginLeft: '15@ms',
        color: '#000',
        fontSize: '13@ms',
    },
    carditem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: '3@ms',
    },
    carditem1: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: '3@ms',
    },
});

