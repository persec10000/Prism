import { moderateScale } from 'react-native-size-matters';

export {default as Colors} from './Colors';  
export {default as Fonts} from './Fonts';
export {default as Images} from './Images'; 

const dialogStyle = {
    borderWidth: 0,
    borderRadius: 11,
    maxWidth: moderateScale(400, 0.2),
    alignSelf: 'center',
};
export {dialogStyle};
