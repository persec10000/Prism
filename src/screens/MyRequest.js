import React, { Component } from "react";
import {
    View,
    Modal,
    ScrollView,
    Platform,
    AsyncStorage,
    FlatList,
    ToastAndroid,
    AlertIOS,
    BackHandler,
    TouchableOpacity
} from "react-native";
import {Text,Button,Icon} from "native-base";
import { Dropdown } from 'react-native-material-dropdown';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import {Fonts} from '../themes'
import api from '../api'
import {WaitMessage, Header} from '../Components';
import {GoLogin, ellipsis} from '../Helpers';
let ID, UserName, RoleID, FirstName, LastName, EmailID, Download, Upload, tempData;

export default class MyRequest extends React.Component {
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
            isVisible:false,
            item: []
        };
        this.timer = null;
        this.onChangeText = this.onChangeText.bind(this);
    }
   
    handleBackButton = () => {
        this.props.navigation.goBack(null)
        return true;
    }
    componentWillUnmount() {     
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        // if (this.timer) clearTimeout(this.timer);
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
        await fetch(api.GetMyRequest + "/" + this.state.ID + "/" + this.state.RoleID).then(res => res.json())
            .then(res => {
                if (res.IsSuccess == "1") {
                    this.setState({ isLoading: false ,LoadingDialog:false })
                    try {
                        let message = JSON.parse(res.Message);              
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
                        android: () => { ToastAndroid.show("No Requests", ToastAndroid.SHORT);}
                    })();
                    this.setState({ isLoading: false ,LoadingDialog:false })
                }
                 this.setState({ isLoading: false ,LoadingDialog:false })
            })
         this.setState({ isLoading: false ,LoadingDialog:false })
    }

    async viewFile() {
        this.setState({ isVisible:!this.state.isVisible})
        let item =this.state.item;
        let res = item.DocumentPath.split('\\').reverse();
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
        else if (text1 == 'Approved request'){
            for(i; i<dataSource.length;i++){
                if (dataSource[i].HTStatus.indexOf("Completed") >= 0) {
                    array1.push(dataSource[i]);
                }
            }
        }
        else if (text1 == 'Rejected request'){
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
            value: 'Approved request',
          }, {
            value: 'Rejected request',
          }];
        return (           
            <View style={styles.container}>
                <Header type="back" title="MY REQUESTS" navigation={this.props.navigation}/>
                <Dropdown
                    label='Sort by'
                    data={data}
                    value={this.state.sortdata}
                    onChangeText={(text)=>this.onChangeText(text)}
                    baseColor='#00FF00'
                    textColor='#00FF00'
                    itemColor='gray'
                    selectedItemColor='black'
                    // ref={}
                />
                {this.state.item.DocumentName&& 
                <Modal            
                    animationType = {"slide"}  
                    transparent = {true}  
                    visible = {this.state.isVisible}  
                    onRequestClose = {() =>{ console.log("Modal has been closed.") } }>  
                    <View style = {styles.modal}>  
                        <View style={styles.componentsSection1}>
                            <View style={styles.carditem}>
                                <Text style={styles.itemText1}>CreatedOn: </Text>
                                <View style={{justifyContent:"flex-end"}}>
                                    <Text style={styles.itemText2}>{ellipsis(this.state.item.HTcreatedOn)}</Text>
                                </View>
                                
                            </View>
                            <View style={styles.carditem}>
                                <Text style={styles.itemText1}>File Name: </Text>
                                <View style={{justifyContent:'flex-end'}}>
                                    <Text style={styles.itemText2}>{ellipsis(this.state.item.DocumentName)}</Text>
                                </View>
                            </View>
                            {(this.state.item.RepositoryName||this.state.item.DepartmentName||this.state.item.MetaTemplateName||this.state.item.FolderName)&&
                                        <View style={styles.carditem}>
                                            <Text style={styles.itemText1}>Folder Name: </Text>
                                            <Text style={styles.itemText2}>{ellipsis(this.state.item.RepositoryName+'/'+this.state.item.DepartmentName)+'/'+'\n'+ellipsis(this.state.item.MetaTemplateName+'/'+this.state.item.FolderName)}</Text>
                                        </View>
                            }
                            <View style={styles.carditem}>
                                <Text style={styles.itemText1}>Status: </Text>
                                <Text style={styles.itemText2}>{ellipsis(this.state.item.HTStatus)}</Text>
                            </View>
                                
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Button rounded primary onPress={() => this.viewFile()}  style={{marginRight: 10}}>
                                <Icon name='eye' />
                                <Text style={{fontSize: 17}}>View</Text>
                            </Button>
                            <Button rounded danger onPress = {() => {  
                                this.setState({ isVisible:!this.state.isVisible})}} style={{marginLeft: 10}}>
                                <Icon name='close' />
                                <Text style={{fontSize: 17}}>Close</Text>
                            </Button>
                        </View>
                    </View>  
                </Modal>
                }
                
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
                        <TouchableOpacity  onPress = {() => {this.setState({ isVisible: true, item: item})}}>
                            <View style={styles.componentsSection}>
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
                    {this.state.searchtrue == false &&
                        <FlatList
                            data={this.state.dataSource}
                            scrollEnabled={true}
                            renderItem={({ item }) =>
                            <TouchableOpacity onPress = {() => {this.setState({ isVisible: true, item: item})}}>
                                <View style={styles.componentsSection}>
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
                  
                </ScrollView >

                <WaitMessage
                    visible={this.state.LoadingDialog}
                    onTouchOutside={() => this.setState({ LoadingDialog: true })}
                />
            </View>
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
    componentsSection1: {
        width: "95%",
        backgroundColor: 'white',
        padding: 6,
        borderRadius: 5,
        margin: 20
    },
    componentSectionHeader: {
        // fontFamily: fonts.primaryRegular,
        color: '#686868',
        fontSize: 20,
        marginBottom: 20,
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
        justifyContent: 'flex-end',
        marginBottom: '3@ms',
    },       
    modal: {  
        justifyContent: 'center',  
        alignItems: 'center',   
        backgroundColor : "#00BCD4",   
        height: 220 ,  
        width: '80%',  
        borderRadius:10,  
        borderWidth: 1,  
        borderColor: '#fff',    
        marginTop: 80,  
        marginLeft: 40,           
    },  
    text: {  
        color: '#3f2949',  
        marginTop: 10  
    }  
});

