import React from 'react';
import {TouchableOpacity, Image, View, Text} from 'react-native';
import {Header as NBHeader, Right} from "native-base";
import {ScaledSheet} from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import {GoHome} from '../Helpers';
import {Images} from '../themes';

const Header = (props) => {
	const {type = 'menu', title} = props;
	const buttons = {
		menu: (
	        <TouchableOpacity
	            onPress={() => props.navigation.toggleDrawer()}
	            style={styles.icon}>
	            <Image
	                source={Images.menu}
	                style={styles.image}
	            />
	        </TouchableOpacity>
		),
		back: (
	        <TouchableOpacity
	            onPress={() => props.navigation.goBack(null)}
	            style={styles.icon}>
	            <Image
	                source={Images.back}
	                style={styles.image}
	            />
	        </TouchableOpacity>
		),
		backto: (
	        <TouchableOpacity
	            onPress={() => props.navigation.navigate('Homescreen')}
	            style={styles.icon}>
	            <Image
	                source={Images.back}
	                style={styles.image}
	            />
	        </TouchableOpacity>
		)
	};
	const button = buttons[type];
	return (
        <NBHeader
            hasTabs
            style={{ backgroundColor: "#EEF3FA", justifyContent: 'center', padding: 0, margin: 0 }}
            androidStatusBarColor="#053A59"
            iosBarStyle="light-content"
        >
            <LinearGradient
                style={styles.container}
                start={{x: 0.0, y: 0.6}} end={{x: 1.0, y: 1.0}}
                colors={['#285A7F', '#FFF']}
			>
				{button}
				<TouchableOpacity
                    onPress={() => props.navigation.navigate('Homescreen')}
                    style={[styles.righticon]}
                    >
                    <Image
                        resizeMode='contain'
                        source={Images.logo}
                        style={styles.imageLogo}
                    />
                </TouchableOpacity>
                <Text numberOfLines={1} style={styles.title}>{title}</Text>

            </LinearGradient>
        </NBHeader>
	);
};

const styles = ScaledSheet.create({
	container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: "row",
		alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
        padding: 0
	},
	icon: {
		position: 'absolute',
		left: 5
	},
	righticon: {
		position: 'absolute',
        right: 0,
        top: 12
	},
	lefticon: {
		position: 'absolute',
        left: 20,
        top: 12
    },
    logoLight: {
		position: 'absolute',
        right: 0,
        top: 0,
		width: '30@ms0.3',
		height: '30@ms0.3',
    },
	image: {
		width: '30@ms0.3',
		height: '30@ms0.3',
	},
	imageLogo: {
		width: '60@ms0.3',
		height: '30@ms0.3',
	},
	imageLogo2: {
		width: '80@ms0.3',
		height: '30@ms0.3',
	},
	title: {
		fontWeight: 'bold',
		color: "#FFF",
		fontSize: '20@ms0.1',
		position: 'absolute',
		width:'230@ms0.3',

	}
});

export default Header;
