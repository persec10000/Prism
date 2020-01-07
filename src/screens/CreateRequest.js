import React, { Component } from "react";
import {
	View,
	Platform,
	AsyncStorage,
	ToastAndroid,
	AlertIOS,
	Image,
	Text,
	TextInput,
	BackHandler,
	Dimensions,
	TouchableOpacity,
	FlatList,
	ActivityIndicator
} from "react-native";
import { Icon } from 'react-native-elements';
import { Form, TextValidator } from 'react-native-validator-form';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import api from '../api'
import { WaitMessage, Header } from '../Components';
let ID, UserName, RoleID, FirstName, LastName, EmailID, Download, Upload, tempData;

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const PADDING = 20;
const C_WIDTH = DEVICE_WIDTH - PADDING * 2;
let isValidField = [] ;
export default class CreateRequest extends React.Component {
	static navigationOptions = {
		header: null
		//headerMode: 'none'
	};
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			isVisible: false,
			item: [],
			email: '',
			password: '',
			values: [],
			inputvalues: [],
			isSubmit: null,
			isActivity: false,
			isEmptyField: true,
			isValidField: [],
		};
	}

	handleBackButton = () => {
		this.props.navigation.navigate('Homescreen')
		return true;
	}
	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
		// if (this.timer) clearTimeout(this.timer);
	}

	async componentWillMount() {
		ID = await AsyncStorage.getItem('ID');
		UserName = await AsyncStorage.getItem('UserName');
		if (ID != null || ID != undefined || ID != '') {
			this.setState({
				ID: ID,
				UserName: UserName,
			});
			this.GetAllVDR();
		}
	}

	async GetAllVDR() {
		let params = this.props.navigation.state.params
		let item = params.item;
		console.log("first==>", item)
		console.log("first==>", this.state.ID)
		console.log("second==>", item.MetaDataID)
		let body = {
			MetaDataID: item.MetaDataID,
			DocumentID: item.ID,
			DocumentExtn: item.DocumentType,
			UserId: this.state.ID
		}
		await fetch(api.CreateRequest, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body)
		})
			.then(res => res.json())
			.then(res => {
				if (res.IsSuccess == "1") {
					this.setState({ isLoading: false, LoadingDialog: false })
					try {
						let message = JSON.parse(res.Message);
						console.log("message=======>", message)
						if (message.DATA) {
							this.setState({
								isLoading: false,
								isSubmit: true,
								dataSource: message.DATA,
							})
						}
						else {
							this.setState({
								isLoading: false,
								isSubmit: false,
								dataSource: message.FormFields,
							})
						}
					} catch (error) {
						this.setState({ isLoading: false, LoadingDialog: false })
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
					this.setState({ isLoading: false, LoadingDialog: false })
				}
				this.setState({ isLoading: false, LoadingDialog: false })
			})
		this.setState({ isLoading: false, LoadingDialog: false })
	}

	async submit() {
		let params = this.props.navigation.state.params
		let item = params.item;
		let IsCheck = 0;
		if (item.checked != false) {
			IsCheck = 1
		}
		ID = await AsyncStorage.getItem('ID');
		this.setState({ isLoading: true })
		let Fields = [];

		for (i = 0; i < this.state.inputvalues.length; i++) {
			Fields.push({
				"FieldId": i+1,
				"FieldValue": this.state.inputvalues[i]
			});
		}

		for (j=0; j<this.state.isValidField.length; j++){
			if (this.state.isValidField[j] == true){
				Platform.select({
					ios: () => { AlertIOS.alert("Please Input Correct Type"); },
					android: () => { ToastAndroid.show("Please Input Correct Type", ToastAndroid.SHORT); }
				})();
				return
			}
		}
				
		const pass_data = {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				DocumentID: item.ID,
				IsCheck: IsCheck,
				UserId: ID,
				Field: Fields
			}),
		}
		await fetch(api.CreateRequestSubmit, pass_data)
			.then(res => res.json())
			.then(res => {
				console.log("res==>",res)
				if (res.IsSuccess == "1") {
					this.setState({ isLoading: false });
					try {
						Platform.select({
							ios: () => { AlertIOS.alert('Submit Success'); },
							android: () => { ToastAndroid.show('Submit Success', ToastAndroid.SHORT); }
						})();
						this.setState({inputvalues:''})
					} catch (error) {
						this.setState({ isLoading: false })
						Platform.select({
							ios: () => { AlertIOS.alert(error + ' '); },
							android: () => { ToastAndroid.show(error + ' ', ToastAndroid.SHORT); }
						})();
					}
				} else {
					this.setState({ isLoading: false })
					Platform.select({
						ios: () => { AlertIOS.alert('Submit Error'); },
						android: () => { ToastAndroid.show('Submit Error', ToastAndroid.SHORT); }
					})();
				}
			}).catch((error) => {
				this.setState({ isLoading: false });
			})

	}

	async viewFile() {
		let params = this.props.navigation.state.params
		this.setState({ isVisible: !this.state.isVisible })
		let item = params.item;
		UserID = await AsyncStorage.getItem('ID');
		UserEmailID = await AsyncStorage.getItem('EmailID');
		if (item.DocumentType.toLowerCase() == ".mp3") {
			this.setState({
				showMp3Player: true,
				itemUrl: api.View_URL + "?FileName=" + item.DocumentGuid + "&Email=" + UserEmailID + "&UserId=" + UserID,
			});
		}
		else {
			if (item.DocumentType.toLowerCase() == ".mp4" || item.DocumentType.toLowerCase() == ".wma") {
				this.props.navigation.navigate("VideoPlayer", { DocumentGuid: item.DocumentName, DocumentType: item.DocumentType })
			} else {
				this.props.navigation.navigate("ViewFile", { DocumentGuid: item.DocumentGuid })
			}
		}
	}

	checkField = (FieldTypeID, checkvalue, index) => {
		console.log('FieldTypeID',FieldTypeID)
		if (FieldTypeID == 1) {
				let Textvalidate = /^[a-zA-Z ]*$/
				if (Textvalidate.test(checkvalue)){
				isValidField[index] = false
				this.setState({isValidField: isValidField});
			}
			else {
				isValidField[index] = true
				this.setState({isValidField: isValidField});
			}
		}
		else if (FieldTypeID == 2) {
			if (isNaN(checkvalue)) {
				isValidField[index] = true
				this.setState({isValidField: isValidField});
			}
			else {
				isValidField[index] = false
				this.setState({isValidField: isValidField});
			}
		}
		else if (FieldTypeID == 3) {
			let Datevalidate = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/
			if (Datevalidate.test(checkvalue)){
				isValidField[index] = false
				this.setState({isValidField: isValidField});
			}
			else {
				isValidField[index] = true
				this.setState({isValidField: isValidField});
			}
		}
		else if (FieldTypeID == 4 || FieldTypeID == 5 || FieldTypeID == 6 || FieldTypeID == 7 || FieldTypeID == 8 || FieldTypeID == 9 || FieldTypeID == 10) {
			let Datavalidate = /[^0-9a-zA-Z]/
			if (Datavalidate.test(checkvalue)){
				isValidField[index] = true
				this.setState({isValidField: isValidField});
			}
			else {
				isValidField[index] = false
				this.setState({isValidField: isValidField});
			}
		}
	
	}
	showActivity = () => {
		this.setState({
			isActivity: true
		});
	}

	hideActivity = () => {
		this.setState({
			isActivity: false
		});
	}
	
	changevalue = (item, index, value) => {
		let changedValues = [...this.state.values];
		let inputValues = [...this.state.inputvalues];
		inputValues[index] = value;
		changedValues[index] = item.FieldName;
		this.setState({ values: changedValues, inputvalues: inputValues });
		if (this.state.inputvalues[index]) {
			this.setState({
				isEmptyField: true
			});
		}
		else {
			this.setState({
				isEmptyField: false
			});
		}
		this.checkField(item.FieldDataTypeID, inputValues[index], index);
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				<Header type="back" title="Create Request" navigation={this.props.navigation} />
				<View style={styles.container}>
					<KeyboardAwareScrollView
						enableOnAndroid
						extraHeight={200}
						scrollEnabled={true}
						enableAutomaticScroll={true}
						style={styles.scroll_cotainer}>
						<View style={styles.contents}>
							{this.state.isSubmit == true ?
								<FlatList
									data={this.state.dataSource}
									keyExtractor={(item, index) => index.toString()}
									renderItem={({ item, index }) =>
										<View style={{ flexDirection: 'row', justifyContent: 'space-between',marginBottom: 10, alignItems: 'center', width: '100%' }}>
											<Text style={{ fontSize: 18, fontWeight: 'bold', justifyContent: 'center', alignItems: 'center' }}>{item.FieldName}</Text>
											<TextInput
												value={item.FieldData}
												autoFocus={false}
												autoCapitalize="none"
												autoCorrect={false}
												returnKeyType="next"
												ref={input => (this.emailInput = input)}
												onSubmitEditing={() => {
													// this.email = this.validateEmail(this.email);
													this.passwordInput.focus();
												}}
												style={styles.input_box}
											/>
										</View>
									} />
								:
								<View>
									<FlatList
										data={this.state.dataSource}
										extraData={this.state}
										renderItem={({ item, index }) =>
										<View>
											<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 10 }}>
												<Text style={{ fontSize: 18, fontWeight: 'bold', justifyContent: 'center', alignItems: 'center' }}>{item.FieldName}</Text>
												<View style={styles.input_container}>
													<TextInput
														onChangeText={(value) => this.changevalue(item, index, value)}
														value={this.state.inputvalues[index]}
														placeholder={"Enter "+item.FieldName}
														autoFocus={false}
														autoCapitalize="none"
														autoCorrect={false}
														keyboardType="default"
														returnKeyType="next"
														ref={input => (this.nickNameInput = input)}
														onSubmitEditing={() => {
															this.emailInput.focus();
														}}
														style={styles.input_left_box}
													/>
													{/* <View style={styles.icon_container}>
														{!this.state.isActivity && this.state.isValidField && !this.state.isEmptyField && <Icon name="done" type="material" color="#30ab02" size={25} />}
														{!this.state.isActivity && !this.state.isValidField && <Icon name="close" type="material" color="#a0a0a0" size={25} />}
														{this.state.isActivity && <ActivityIndicator size={16} color="#909090" />}
													</View> */}
												</View>
											</View>
												{this.state.isValidField[index] && <Text style={styles.error_message}> {this.state.values[index]} is not available </Text>}
										</View>	
										} keyExtractor={(item, index) => index.toString()} />
									<TouchableOpacity onPress={() => this.submit()} style={styles.btn_login} activeOpacity={0.5}>
										<Text style={styles.btn_login_text}> Submit </Text>
									</TouchableOpacity>
								</View>
							}
							<TouchableOpacity onPress={() => this.viewFile()} style={styles.btn_register} activeOpacity={0.5}>
								<Text style={styles.btn_register_text}> View Document </Text>
							</TouchableOpacity>
						</View>
					</KeyboardAwareScrollView>
				</View>

			</View>
		);
	}
}

const styles = ScaledSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	scroll_cotainer: {
		flex: 1,
	},
	error_message: {
		width: C_WIDTH,
		marginLeft: 70,
		color: '#f6522f'
	},
	contents: {
		width: DEVICE_WIDTH,
		height: DEVICE_HEIGHT * 0.8,
		alignItems: 'center',
		padding: PADDING
	},
	text: {
		color: '#959ea7'
	},
	input_left_box: {
		width: C_WIDTH - 42,
		height: 50,
		paddingLeft: 10,
		paddingRight: 10,
	},
	input_container: {
		width: "80%",
		flexDirection: 'row',
		alignItems: 'center',
		height: 50,
		backgroundColor: '#FFF',
		borderRadius: 3
	},
	icon_container: {
		width: 42,
		height: 50,
		alignItems: 'center',
		justifyContent: 'center'
	},
	input_box: {
		width: "80%",
		height: 50,
		paddingLeft: 10,
		paddingRight: 10,
		backgroundColor: '#FFF',
		borderRadius: 3
	},
	btn_login: {
		width: C_WIDTH,
		height: 42,
		//marginTop: 32,
		marginBottom: 70,
		backgroundColor: '#1976d3',
		borderRadius: 3,
		alignItems: 'center',
		justifyContent: 'center'
	},
	btn_login_text: {
		fontSize: 20,
		color: '#ffffff'
	},
	btn_register: {
		flex: 1,
		width: C_WIDTH,
		position: 'absolute',
		bottom: 0,
		height: 42,
		//marginTop: 60,
		backgroundColor: 'transparent',
		borderWidth: 1,
		borderColor: '#1976d3',
		borderRadius: 3,
		alignItems: 'center',
		justifyContent: 'center'
	},
	btn_register_text: {
		fontSize: 20,
		color: '#1976d3'
	},
});

