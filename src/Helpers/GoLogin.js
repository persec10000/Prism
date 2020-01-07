import { NavigationActions } from 'react-navigation';

const GoLogin = (navigation) => {
    const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
            NavigationActions.navigate({ routeName: 'Login'})
        ],
    });
    navigation.dispatch(resetAction);
};

export default GoLogin;
