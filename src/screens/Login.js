import * as React from 'react';
import {
	Image,
	Keyboard,
	KeyboardAvoidingView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
	TextInput,
	ActivityIndicator,
	Platform,
	ToastAndroid,
	AlertIOS,
	AsyncStorage, Dimensions, Button,
	BackHandler,
	Alert,
	ScrollView,
} from 'react-native';
import { Dialog } from 'react-native-simple-dialogs';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';

import {
	Colors,
	Fonts,
	Images,
	dialogStyle,
} from '../themes'

import api from '../api';
import {bugsnag} from '../../index';
import Toast from 'react-native-easy-toast'

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height
const redlineColor = Colors.mainColor;
const lineColor = 'lightgrey';

export default class Login extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			linecolorview1: lineColor,
			linecolorview2: lineColor,
			isLoading: false,
			username: (__DEV__)?'ADMIN':'', //StockholdingAdmin
			password: (__DEV__)?'1234':'', //456123, sandbox=1234
			Message: {},
			OTP: (__DEV__)?'0':'',
			forgotPassword: '',
			enable: false,
			forgotPasswordUsername: '',
		}
	}

	handleBackButton() {
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

	componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
	}

	flagSecure() {
	}
	openDialogOTP(show) {
		this.setState({ otp_showDialog: show })
	}
	openDialogUsername(show) {
		this.setState({ Forgot_showDialog: show })
	}
	async userLogin() {
		if (this.state.username == "") {
			Platform.select({
				ios: () => { AlertIOS.alert('username should not be blank'); },
				android: () => { ToastAndroid.show('username should not be blank', ToastAndroid.SHORT); }
			})();
		} else {
			if (this.state.password == "") {
				Platform.select({
					ios: () => { AlertIOS.alert('Password should not be blank'); },
					android: () => { ToastAndroid.show('Password should not be blank', ToastAndroid.SHORT); }
				})();
			}
			else {
				this.setState({ isLoading: true })

				const pass_data = {
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						Username: this.state.username,
						Password: this.state.password,
					}),
				}
				
				await fetch(api.LOGIN_URL, pass_data).then(res => res.json())
					.then(async res => {
						console.log("res========>",res)
						if (res.IsSuccess == "1") {
							this.setState({ isLoading: false });
							try {
									let message = JSON.parse(res.Message);
									console.log(message)
								this.setState({ Message: message });
								await AsyncStorage.setItem('ID', message.ID.toString());
								await AsyncStorage.setItem('UserName', message.UserName);
								await AsyncStorage.setItem('RoleID', message.RoleID.toString());
								await AsyncStorage.setItem('FirstName', message.FirstName);
								await AsyncStorage.setItem('LastName', message.LastName);
								await AsyncStorage.setItem('EmailID', message.EmailID);
								await AsyncStorage.setItem('Download', message.Download.toString());
								await AsyncStorage.setItem('Upload', message.Upload.toString());
								await AsyncStorage.setItem('View', message.View.toString());
								await AsyncStorage.setItem('MoveCopy', message.MoveCopy.toString());
								await AsyncStorage.setItem('Dashboard', message.Dashboard.toString());
							} catch (error) {
								this.setState({ isLoading: false })
								Platform.select({
									ios: () => { AlertIOS.alert(error + ' '); },
									android: () => { ToastAndroid.show(error + ' ', ToastAndroid.SHORT); }
								})();
							}
							setTimeout(() => {
								this.refs.toast.show('Login successfully')
								// Toast("Login successfully");
							}, 300 );
							setTimeout(() => {
								this.props.navigation.navigate('Homescreen');
							}, 600 );
							//this.openDialogOTP(true)
						} else {
							this.setState({ isLoading: false })
							Platform.select({
								ios: () => { AlertIOS.alert('Wrong username or Password, please try again'); },
								android: () => { ToastAndroid.show('Wrong username or Password, please try again', ToastAndroid.SHORT); }
							})();
						}
					}).catch((error) => {
						this.setState({ isLoading: false });
			            bugsnag.notify(new Error('Login error'), (report) => {
			                report.metadata = {
			                    errorDetails: error,
			                };
			            });
					})
			}
		}
	}

	submitOTP() {
		// this.openDialogOTP(false);
		// this.props.navigation.navigate('Homescreen');

		if (this.state.Message.OTP.toString() == this.state.OTP.toString()) {
			this.openDialogOTP(false);
			this.setState({ OTP :''});
			setTimeout(() => {
                this.refs.toast.show('Login successfully')
                // Toast("Login successfully");
            }, 300 );
			setTimeout(() => {
				this.props.navigation.navigate('Homescreen');
            }, 600 );
		} else {
			this.setState({ OTP :''});
			setTimeout(() => {
                this.refs.toast.show("OTP didn't match")
                // Toast("OTP didn't match");
            }, 300 );
		}
	}
	openForgotPassDialog() {
		this.openDialogUsername(true)
	}
	async forgotPassword() {
		this.openDialogUsername(false)
		if (this.state.forgotPasswordUsername == "") {
			Platform.select({
				ios: () => { AlertIOS.alert('username should not be blank'); },
				android: () => { ToastAndroid.show('username should not be blank', ToastAndroid.SHORT); }
			})();
		} else {
			this.setState({ isLoading: true })

			const pass_data = {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: "'" + this.state.forgotPasswordUsername + "'"
			}
			await fetch(api.forgotpassword_URL, pass_data).then(res => res.json())
				.then(res => {
					if (res.IsSuccess == "1") {
                        this.setState({ isLoading: false });
                        this.refs.toast.show(res.Message)
						// Toast(res.Message);
					} else {
                        this.refs.toast.show('Wrong username please try again')
						// Toast('Wrong username please try again');
						this.setState({ isLoading: false });
					}
				}).catch((error) => {
					this.setState({ isLoading: false })
				}
			)
		}
	}

	render() {
		var _this = this;
		return (
			<ScrollView style={styles.container}>
				<View style={styles.container}>
					<StatusBar backgroundColor={Colors.mainColor} barStyle="light-content" />
					<KeyboardAvoidingView style={styles.container}>
						<TouchableWithoutFeedback
							style={styles.container}
							onPress={Keyboard.dismiss}>
							<View style={styles.logoContainer}>
								<Image source={Images.logoLight} style={styles.logoLight} />
								<Image source={Images.logo3} style={styles.logo} resizeMode='contain'/>
								<Image source={Images.logo2} style={styles.logo1} resizeMode='contain'/>
								<Image source={Images.logo} style={styles.logo2} resizeMode='contain'/>

								<View style={{ marginBottom: 40, marginTop: 10 }}>
									<Text style={styles.title}>PRISM</Text>
									{/* <Text style={styles.subtitle}>DATA ROOM</Text> */}
								</View>
								<View style={styles.loginContainer}>

									<View style={styles.SectionStyle}>
										<Image
											source={require('../images/user.png')}
											style={{ width: 35, height: 35, marginLeft: 10 }} />
										<TextInput
											style={styles.inputFont}
											secureTextEntry={false}
											placeholder="Username"
											underlineColorAndroid={'transparent'}
											placeholderTextColor="#C5C5C5"
											selectionColor={Colors.whiteColor}
											value={this.state.username}
											onChangeText={(text) => this.setState({ username: text })}
											type={'username-address'}
											returnKeyType={'next'}
											onFocus={() => this.setState({ linecolorview1: redlineColor })}
											onSubmitEditing={() => {
												this.refs.Password.focus();
												this.setState({ linecolorview1: lineColor })
											}}
											onEndEditing={() => {}}
										/>
									</View>

									<View style={styles.SectionStyle}>
										<Image
											source={require('../images/password.png')}
											style={{ width: 35, height: 35, marginLeft: 10 }} />
										<TextInput
											style={styles.inputFont}
											secureTextEntry={true}
											ref='Password'
											underlineColorAndroid={'transparent'}
											placeholder="Password"
											placeholderTextColor="#C5C5C5"
											selectionColor={Colors.whiteColor}
											value={this.state.password}
											onChangeText={(text) => this.setState({ password: text })}
											type={'username-address'}
											returnKeyType={'go'}
											onFocus={() => this.setState({ linecolorview2: redlineColor })}
											onSubmitEditing={() => { this.setState({ linecolorview2: lineColor }) }}
											onEndEditing={() => {}}
										/>
									</View>
                                    {this.state.isLoading == true &&
                                        <View style={{ backgroundColor: '#064A94', marginTop: 20 }}>
                                            <ActivityIndicator
                                                color={Colors.whiteColor}
                                                size='large'
                                            />
                                        </View>
                                    }
                                    {this.state.isLoading != true &&
                                        <View style={styles.btnContainer}>
                                            <TouchableOpacity activeOpacity={0.70}
                                                onPress={() => this.userLogin()} style={styles.fullWidth}>
                                                <View style={styles.signinView}>
                                                    <Text style={styles.signinText}>
                                                        LOGIN</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    }

                                    {/* <View style={styles.forgotView}>
                                        <Text style={styles.forgotText}>Forgot Your Password?</Text>
                                        <TouchableOpacity activeOpacity={0.70} onPress={() => this.openForgotPassDialog()}>
                                            <Text style={styles.clickHereText}>Click Here</Text>
                                        </TouchableOpacity>
                                    </View> */}

									<Dialog
										dialogStyle={dialogStyle}
										visible={this.state.otp_showDialog}
										supportedOrientations={['portrait', 'landscape']}
										onTouchOutside={() => this.setState({ otp_showDialog: false })} >
										<View style={{ marginTop: -10, }}>
											<View style={{ marginTop: 10, alignSelf: 'flex-end' }}>
												<TouchableOpacity onPress={() => this.setState({ otp_showDialog: false })}
													style={{ marginRight: 20 }}>
													<Image
														source={Images.cancel}
														style={{ width: 15, height: 15, tintColor: '#DFE4E8' }}
													/>
												</TouchableOpacity>
											</View>
											<View style={{ marginTop: 15, height: 1, backgroundColor: '#DFE4E8', marginLeft: 5, marginRight: 5 }} />
											<Text style={{ marginTop: 15, textAlign: 'center', fontSize: moderateScale(17,0.3), color: '#878787', fontWeight: "bold" }}>Please enter the OTP you recieved on your Registered mobile.</Text>
											<View style={styles.SectionStylePopup}>
												<View style={styles.SectionStylePopupChild}>
													<Image
														source={Images.popuplock}
														style={{ width: 15, height: 15, tintColor: '#2CA9E1' }} />
												</View>
												<TextInput
													style={styles.inputFontPopup}
													secureTextEntry={false}
													underlineColorAndroid={'transparent'}
													placeholder="Enter OTP"
													placeholderTextColor="#C5C5C5"
													selectionColor={Colors.blackColor}
													value={this.state.OTP}
													onChangeText={(text) => this.setState({ OTP: text })}
													keyboardType='numeric'
													returnKeyType={'go'}
													onFocus={() => this.setState({ linecolorview2: redlineColor })}
													onSubmitEditing={() => { this.setState({ linecolorview2: lineColor }) }}
													onEndEditing={() => {}}
												/>
											</View>

											<TouchableOpacity onPress={() => this.submitOTP()}
												activeOpacity={0.70}
												style={styles.popupView}>
												<Text style={styles.popupText}>
													SUBMIT</Text>
											</TouchableOpacity>
										</View>
									</Dialog>

									<Dialog
										dialogStyle={dialogStyle}
										visible={this.state.Forgot_showDialog}
										supportedOrientations={['portrait', 'landscape']}
										onTouchOutside={() => this.setState({ Forgot_showDialog: false })}>
										<View style={{ marginTop: -10, }}>
											<View style={{ marginTop: 10, alignSelf: 'flex-end' }}>
												<TouchableOpacity onPress={() => this.setState({ Forgot_showDialog: false })}
													style={{ marginRight: 20 }}>
													<Image
														source={Images.cancel}
														style={{ width: 15, height: 15, tintColor: '#DFE4E8' }}
													/>
												</TouchableOpacity>
											</View>
											<View style={{ marginTop: 15, height: 1, backgroundColor: '#DFE4E8', marginLeft: 5, marginRight: 5 }} />
											<Text style={{ marginTop: 15, textAlign: 'center', fontSize: 17, color: '#878787', fontWeight: "bold" }}>Please enter the username.</Text>
											<View style={styles.SectionStylePopup}>
												<View style={styles.SectionStylePopupChild}>
													<Image
														source={Images.popupuser}
														style={{ width: 15, height: 15, tintColor: '#2CA9E1' }} />
												</View>
												<TextInput
													style={styles.inputFontPopup}
													secureTextEntry={false}
													underlineColorAndroid={'transparent'}
													placeholder="Enter Username"
													placeholderTextColor="#C5C5C5"
													selectionColor={Colors.blackColor}
													value={this.state.forgotPasswordUsername}
													onChangeText={(text) => this.setState({ forgotPasswordUsername: text })}
													returnKeyType={'go'}
													onFocus={() => this.setState({ linecolorview2: redlineColor })}
													onSubmitEditing={() => { this.setState({ linecolorview2: lineColor }) }}
													onEndEditing={() => {}}
												/>
											</View>

											<TouchableOpacity onPress={() => this.forgotPassword()}
												activeOpacity={0.70}
												style={styles.popupView}>
												<Text style={styles.popupText}>
													SUBMIT</Text>
											</TouchableOpacity>
										</View>
									</Dialog>

								</View>
							</View>
						</TouchableWithoutFeedback>
					</KeyboardAvoidingView>
                    <Toast ref="toast"/>
				</View>
			</ScrollView>
		)
	}
}
const styles = ScaledSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#064A94',
	},
	logoContainer: {
		justifyContent: 'center',
		flex: 1,
		paddingTop:'28%'
	},
	logo: {
		position: 'absolute',
		//left: '5@ms',
		top: '10@ms',
		width: '140@ms',
		height: '59@ms',
	},
	logo1: {
		position: 'absolute',
		left: '115@ms',
		top: '10@ms',
		width: '140@ms',
		height: '59@ms',
	},
	logo2: {
		position: 'absolute',
		right: '-25@ms',
		top: '10@ms',
		width: '140@ms',
		height: '59@ms',
	},
	logoLight: {
		position: 'absolute',
		left: moderateScale(-75, 0.4),
		top: moderateScale(-20, 0.4),
		width: '254@ms0.4',
		height: '191@ms0.4',
	},
	title: { textAlign: 'center', fontSize: '40@ms', color: '#FFF' },
	subtitle: { textAlign: 'center', fontSize: '35@ms', color: '#FFF' },
	loginContainer: {
		marginTop: '4%',
		marginLeft: 10,
		marginRight: 10
	},
	inputFont: {
		color: '#FFFFFF',
		height: '30@ms0.2',
		width: '75%',
		marginRight: 5,
		marginLeft: 15,
		padding: 0,
		fontSize: '14@ms',
	},
	inputFontPopup: {
		color: '#000',
		height: 40,
		width: '100%',
		fontSize: '14@ms',
	},
	forgotText: {
		fontSize: '16@ms',
		color: '#FFF'
	},
	clickHereText: {
		marginLeft: 5,
		fontSize: '15@ms',
		color: '#00A95D'
	},
	btnContainer: {
		flexDirection: 'row',
		marginTop: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},
	forgotView: {
		marginTop: 15,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	signinView: {
		marginTop: 20,
		alignSelf: 'center',
		justifyContent: 'center',
		width: '100%',
		maxWidth: 350,
		height: '55@ms0.2',
		backgroundColor: '#00A95D',
		borderRadius: 30
	},
	signinText: {
		fontFamily: Fonts.base,
		fontSize: '22@ms',
		color: '#FFF',
		textAlign: 'center'
	},
	popupView: {
		marginTop: 20,
		alignSelf: 'center',
		justifyContent: 'center',
		backgroundColor: '#2CA9E1',
		width: '100%',
		height: 55,
		borderRadius: 15
	},
	popupText: {
		fontFamily: Fonts.base,
		fontSize: '18@ms',
		margin: 8,
		color: '#FFF',
		textAlign: 'center',
		fontWeight: 'bold'
	},
	SectionStyle: {
		marginTop: 2,
		flexDirection: 'row',
		backgroundColor: '#0F4985',
		height: 65,
		marginBottom: 5,
		marginLeft: 5,
		marginRight: 5,
		alignItems: 'center'
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
	fullWidth: {
		width: '100%',
	},
}) 