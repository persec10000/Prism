import React, { Component } from "react";
import {
    View,
    TouchableOpacity,
    Alert,
    FlatList,
    BackHandler,
} from "react-native";
import {Text} from "native-base";
import { ScaledSheet } from 'react-native-size-matters';
import {UserInactivity, Header} from '../Components';
import {GoLogin, ellipsis} from '../Helpers';
var pause = require('../images/pause.jpg')

export default class Dashboard extends React.Component {
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
        }
    }

   
    openFile(item) {
        if (item.name == "1. PENDING REQUESTS") {
                this.setState({
                    LoadingDialog: true,
                });
            this.props.navigation.navigate("PendingRequest")
        }
        else if(item.name == "2. MY REQUESTS") {
            this.props.navigation.navigate("MyRequest")
        }
    }
    onButtonPress = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        // then navigate
    }

    handleBackButton = () => {
        console.log(__APP_NAME__)
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
        const option = [
            {
                name: "1. PENDING REQUESTS"
            },
            {
                name: "2. MY REQUESTS"
            }
        ]
        return (
            <View style={styles.container}>
                <Header type="menu" title="Dashboard" navigation={this.props.navigation}/>
                    <View style={{ marginTop: 20, marginBottom: 175 }}>
                        <View style={{ height: 1, backgroundColor: '#000', marginLeft: 10, marginRight: 10 }} />
                        <FlatList
                            data={option}
                            scrollEnabled={true}
                            renderItem={({ item }) =>
                                <View style={styles.uperCard}>
                                    <View style={styles.uperCardChild}>
                                        <TouchableOpacity onPress={() => this.openFile(item)}>
                                            <View>
                                                <Text style={styles.itemText}>{ellipsis(item.name)} </Text>
                                            </View>
                                        </TouchableOpacity>
                                        
                                    </View>
                                    <View style={{ height: 1, backgroundColor: '#000', marginLeft: 10, marginRight: 10 }} />
                                </View>
                            } keyExtractor={(item, index) => index.toString()} />
                    </View>
               
            </View>
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
        marginLeft:10,
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
    titleText: {
        fontSize: '18@ms',
        color:"#000",
        fontWeight: 'bold',
        textAlign:'center'
    },
    itemText: {
        marginLeft: '20@ms',
        color: '#FFFFFF',
        fontSize: '18@ms',
    },
    itemActions: {
        position: "absolute",
        right: 2,
        alignItems: 'center',
        width: '25@ms',
        height: '25@ms'
    },
});

