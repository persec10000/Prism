import React from "react";
import {
    AppRegistry, NetInfo,
} from 'react-native';
import Splash from './screens/Splash';
import SideBar from './screens/SideBar';
import Homescreen from './screens/Homescreen';
import Dashboard from './screens/Dashboard';
import Department from './screens/Department';
import Login from './screens/Login';
import MyDownloads from './screens/MyDownloads';
import SelectedFolder from './screens/SelectedFolder';
import SelectedSubFolder from './screens/SelectedSubFolder';
import SelectedSubFolder2 from './screens/SelectedSubFolder2';
import SelectedSubFolder3 from './screens/SelectedSubFolder3';
import SelectedSubFolder4 from './screens/SelectedSubFolder4';
import PendingRequest from './screens/PendingRequest';
import MyRequest from './screens/MyRequest';
import SubPending from './screens/SubPending';
import CreateRequest from './screens/CreateRequest'
import VideoPlayer from './screens/VideoPlayer';
import ViewFile from './screens/ViewFile';
import First from './screens/CopyAndMove/First';
import Second from './screens/CopyAndMove/Second';
import Third from './screens/CopyAndMove/Third';
import Forth from './screens/CopyAndMove/Forth';
import {createDrawerNavigator, createStackNavigator} from "react-navigation";

console.disableYellowBox = true;

import {isConnectedStatus, isConnected} from '..';

const VDR = createStackNavigator({
    Homescreen: {
        screen: props => <Homescreen {...props} screenProps={{isConnected}}/>,
    },
    Dashboard: {
        screen: props => <Dashboard {...props} screenProps={{isConnected}}/>,
    },
    Department: {
        screen: props => <Department {...props} screenProps={{isConnected}}/>,
    },
    Splash: {
        screen: Splash
    },
    SideBar: {
        screen: SideBar
    },
    Login: {
        screen: props => <Login {...props} screenProps={{isConnected}}/>
    },
    MyDownloads: {
        screen: props => <MyDownloads {...props} screenProps={{isConnected}}/>,
    },
    SelectedFolder: {
        screen: props => <SelectedFolder {...props} screenProps={{isConnected}}/>,
    },
    SelectedSubFolder:{
         screen: props => <SelectedSubFolder {...props} screenProps={{isConnected}}/>,
    },
    SelectedSubFolder2:{
        screen: props => <SelectedSubFolder2 {...props} screenProps={{isConnected}}/>,
    }, 
    SelectedSubFolder3:{
        screen: props => <SelectedSubFolder3 {...props} screenProps={{isConnected}}/>,
    },
    SelectedSubFolder4:{
        screen: props => <SelectedSubFolder4 {...props} screenProps={{isConnected}}/>,
    },
    PendingRequest:{
        screen: props => <PendingRequest {...props} screenProps={{isConnected}}/>,
    },
    MyRequest:{
        screen: props => <MyRequest {...props} screenProps={{isConnected}}/>,
    },
    CreateRequest:{
        screen: props => <CreateRequest {...props} screenProps={{isConnected}}/>,
    },
    SubPending:{
        screen: props => <SubPending {...props} screenProps={{isConnected}}/>,
    },
    VideoPlayer:{
        screen: props => <VideoPlayer {...props} screenProps={{isConnected}}/>
    },
    ViewFile:{
        screen: props => <ViewFile {...props} screenProps={{isConnected}}/>
    },
    First: {
        screen: props => <First {...props} screenProps={{isConnected}}/>
    },
    Second: {
        screen: props => <Second {...props} screenProps={{isConnected}}/>
    },
    Third:{
        screen: props => <Third {...props} screenProps={{isConnected}}/>
    },
    Forth:{
        screen: props => <Forth {...props} screenProps={{isConnected}}/>
    }
},
{
    initialRouteName: 'Login',
    headerMode: 'none'
});

const Drawer = createDrawerNavigator({
    Main: {
        screen: VDR,
    },
}, {
    Name: 'Main',
    contentComponent: props => <SideBar {...props}/>,
    header: null,
    headerMode: 'null'
});

export default Drawer;
