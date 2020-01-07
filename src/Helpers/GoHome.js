import { NavigationActions } from 'react-navigation';

export default GoHome = (navigation) => {
    const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
            NavigationActions.navigate({ routeName: 'Homescreen'})
        ],
    });
    navigation.dispatch(resetAction);
};
