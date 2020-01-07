import React from "react";
import {
  AppRegistry, Image, StatusBar, View, Text, StyleSheet, TouchableOpacity, Alert
  , TextInput, AsyncStorage, Dimensions, Platform
} from "react-native";
import {
  Button,
  Container,
  List,
  ListItem,
  Content,
} from "native-base";
import {ScaledSheet} from 'react-native-size-matters';

import {
  Colors,
  Fonts,
  Images
} from '../themes';
import {GoLogin} from '../Helpers';

const profileImage = 'https://hubbe.rs/uploads/connectedmug55x33jpg-50984.jpg'
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

var UserName;

export default class SideBar extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      enable: false,
      page: 'MyVDR',
      firstName: '',
      lastName: '',
      userright: ''
    };

    this.timer = null;
  }

  get name() {
    const {firstName, lastName} = this.state;

    return `${firstName} ${lastName}`;
  }

  flagSecure() {
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.getUserProperties();
    }, 1000);
  }

  componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer);
  }

  getUserProperties() {
    AsyncStorage.getItem('FirstName').then((val) => {
      this.setState({firstName: val || ''});
    });
    AsyncStorage.getItem('LastName').then((val) => {
      this.setState({lastName: val || ''});
    });
    AsyncStorage.getItem('Dashboard').then((val) => {
      this.setState({userright: val || ''});
    });
  }

  openMyVDR() {
    this.setState({
      page: 'MyVDR'
    })
    this.props.navigation.navigate("Homescreen")
    this.props.navigation.closeDrawer();
  }
  openDashboard() {
    this.setState({
      page: 'Dashboard'
    })
    this.props.navigation.navigate("Dashboard")
    this.props.navigation.closeDrawer();
  }

  openMyDownloads() {
    this.setState({
      page: 'MyDownloads'
    })
    this.props.navigation.navigate('MyDownloads')
    this.props.navigation.closeDrawer();
  }

  openLogin() {
    this.setState({
      page: 'LoginOut'
    })
    this.props.navigation.navigate('Login');
    this.props.navigation.closeDrawer();
    // GoLogin(this.props.navigation);
  }

  render() {
    return (
      <Container style={{ backgroundColor: '#363C46' }}>
        <Content>
          <View
            style={{
              alignSelf: "stretch", flexDirection: 'row', alignItems: 'center',
              backgroundColor: "transparent", marginLeft: 15, marginTop: 15
            }}
          >
            <Image
              source={Images.placeholder}
              style={{ width: 80, height: 80, borderRadius: 40 }}
            />
            <Text style={styles.username}>Hello, {this.name}</Text>
          </View>
          <View style={styles.viewContainer}>
            {
              this.state.page !== 'Dashboard' && this.state.userright == 1 &&
              <View>
                <View style={styles.viewDivider} />
                <TouchableOpacity onPress={() => this.openDashboard()}
                  style={styles.itemContainer}>
                  <View style={styles.itemContent}
                  >
                    <Image
                      source={Images.second}
                      style={styles.itemImage} />
                    <Text style={styles.itemText}>Dashboard</Text>
                  </View>
                </TouchableOpacity>
                </View>
            }
            {
              this.state.page === 'Dashboard' && this.state.userright == 1 &&
              <View>
                <View style={styles.viewDivider}/>
                <TouchableOpacity onPress={() => this.openDashboard()}
                  style={styles.itemContainer}>
                  <View style={styles.itemContent}
                  >
                    <Image
                    source={Images.second}
                      style={styles.itemImage} />
                    <Text style={styles.itemTextLogout}>Dashboard</Text>
                  </View>
                </TouchableOpacity>
              </View>
            }
            <View style={styles.viewDivider} />
            {
              this.state.page !== 'MyVDR' &&
              <TouchableOpacity onPress={() => this.openMyVDR()}
                style={styles.itemContainer}>
                <View style={styles.itemContent}
                >
                  <Image
                  source={Images.first}
                    style={styles.itemImage} />
                  <Text style={styles.itemText}>PRISM</Text>
                </View>
              </TouchableOpacity>
            }
            {
              this.state.page === 'MyVDR' &&
              <TouchableOpacity onPress={() => this.openMyVDR()}
                style={styles.itemContainer}>
                <View style={styles.itemContent}
                >
                  <Image
                  source={Images.first}
                    style={styles.itemImage} />
                  <Text style={styles.itemTextLogout}>PRISM</Text>
                </View>
              </TouchableOpacity>
            }

            {
              this.state.page !== 'MyDownloads' &&
              <TouchableOpacity onPress={() => this.openMyDownloads()}
                style={styles.itemContainer}>
                <View style={styles.itemContent}
                >
                  <Image
                    source={Images.second}
                    style={styles.itemImage} />
                  <Text style={styles.itemText}>Download History</Text>
                </View>
              </TouchableOpacity>
            }
            {
              this.state.page === 'MyDownloads' &&
              <TouchableOpacity onPress={() => this.openMyDownloads()}
                style={styles.itemContainer}>
                <View style={styles.itemContent}
                >
                  <Image
                  source={Images.second}
                    style={styles.itemImage} />
                  <Text style={styles.itemTextLogout}>Download History</Text>
                </View>
              </TouchableOpacity>
            }
            <View style={styles.viewDivider} />
            {
              this.state.page !== 'LoginOut' &&
              <TouchableOpacity onPress={() => this.openLogin()}
                style={styles.itemContainer}>
                <View style={styles.itemContent}
                >
                  <Image
                  source={Images.third}
                    style={styles.itemImage} />
                  <Text style={styles.itemText}>Logout</Text>
                </View>
              </TouchableOpacity>
            }
            {
              this.state.page === 'LoginOut' &&
              <TouchableOpacity onPress={() => this.openLogin()}
                style={styles.itemContainer}>
                <View style={styles.itemContent}
                >
                  <Image
                  source={Images.third}
                    style={styles.itemImage} />
                  <Text style={styles.itemTextLogout}>Logout</Text>
                </View>
              </TouchableOpacity>
            }
            <View style={styles.viewDivider} />

          </View>
        </Content >
      </Container >
    );
  }
}

const styles = ScaledSheet.create({
  container: {
    backgroundColor: "#4196CD"
  },
  drawerCover: {
    alignSelf: "stretch",
    // resizeMode: 'cover',
    height: deviceHeight / 3.5,
    width: null,
    position: "relative",
    marginBottom: 10
  },
  drawerImage: {
    position: "absolute",
    // left: (Platform.OS === 'android') ? 20 : 40,
    left: Platform.OS === "android" ? deviceWidth / 10 : deviceWidth / 9,
    // top: (Platform.OS === 'android') ? 45 : 55,
    top: Platform.OS === "android" ? deviceHeight / 13 : deviceHeight / 12,
    width: 210,
    height: 75,
    resizeMode: "cover"
  },
  buttonContainer: {
    justifyContent: "center",
    margin: 0,
    marginTop: 20,
    borderRadius: 5,
    backgroundColor: "#FFF",
  },
  buttontextContainer: {
    color: "#000",
    fontSize: 20,
  },
  imageContainer: {
    marginRight: 15,
    margin: 5,
    width: 20,
    height: 20

  },
  textContainer: {
    color: "#244d66",
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 10,

  },
  col: {
    alignItems: "center",
    paddingHorizontal: 3
  },
  row: {
    paddingBottom: 20
  },
  iconText: {
    fontSize: 12
  },
  mb10: {
    marginBottom: 10
  },
  mb35: {
    marginBottom: 35
  },
  viewContainer: {
    backgroundColor: 'transparent',
    marginTop: 20,
    alignSelf: 'stretch',

  },
  viewDivider: {
    marginTop: 20,
    backgroundColor: "#FFF",
    alignSelf: 'stretch',
    height: 1
  },
  itemContainer: {
    marginLeft: 10,
    flexDirection: "row",
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  itemContent: {
    flexDirection: "row",
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginTop: 20,
  },
  itemImage: {
    width: 36,
    height: 36,
    borderRadius: 18
  },
  itemText: {
    marginLeft: 20,
    fontSize: '20@ms0.3',
    color: '#FFF',
  },
  itemTextLogout: {
    marginLeft: 20,
    fontSize: '20@ms0.3',
    color: '#285A7F'
  },
  username: {
    marginLeft: 20,
    fontSize: '14@ms0.3',
    color: '#FFF'
  },
});

