import moment from 'moment';

export {default as AppAlert} from './AppAlert';
export {default as GoLogin} from './GoLogin';
export {default as GoHome} from './GoHome';
export {default as CheckAllowedFormat} from './CheckAllowedFormat';
export {default as Toast} from './Toast';

const CurrentDateTime = () => (moment().format('l') +' '+ moment().format('LT'));
export {CurrentDateTime};

const ToString = (param) => (param ? param.toString() : '');
export const ellipsis = txt=>{
    if (txt.length > 35) {
        return txt.substring(0, 29)+'...'+txt.slice(-3)
    }
    return txt
}
export {ToString};
