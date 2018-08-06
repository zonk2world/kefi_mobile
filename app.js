import React from 'react';
import {
  DrawerNavigator,
  StackNavigator
} from 'react-navigation';
import {withRkTheme} from 'react-native-ui-kitten';
import {AppRoutes} from './config/navigation/routesBuilder';
import * as Screens from './screens';
import {bootstrap} from './config/bootstrap';
import track from './config/analytics';
import {data} from './data'
import {AppLoading, Font,Asset} from 'expo';
import {View} from "react-native";
import * as firebase from "firebase";

firebase.initializeApp({
    apiKey: "AIzaSyCw9MFfv7BsCmOvY2yygunr9d4LDa-rQqE",
    authDomain: "kefiapp-3b67e.firebaseapp.com",
    databaseURL: "https://kefiapp-3b67e.firebaseio.com",
    projectId: "kefiapp-3b67e",
    storageBucket: "kefiapp-3b67e.appspot.com",
    messagingSenderId: "601298338747"
});

bootstrap();
data.populateData();

function getCurrentRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
}

let SideMenu = withRkTheme(Screens.SideMenu);
const KittenApp = StackNavigator({
  Home: {
    screen: DrawerNavigator({
        ...AppRoutes,
      },
      {
          drawerPosition: 'right',
         contentComponent: (props) => <SideMenu {...props}/>,
          drawerOpenRoute: 'DrawerOpen',
          drawerCloseRoute: 'DrawerClose',
          drawerToggleRoute: 'DrawerToggle',
      })
  }
}, {
  headerMode: 'none',
});

export default class App extends React.Component {
  state = {
    loaded: false
  };

  componentWillMount() {
      this._loadAssets();
      this._cacheResourcesAsync();
  }
    async _cacheResourcesAsync() {
        return Promise.all([
            Asset.loadAsync([
                require("./assets/images/Kefi_Designs/Splashbackground.jpg"),
                require("./assets/images/largeLogo.png"),
            ]),
        ]);
    }
  _loadAssets = async() => {
    await Font.loadAsync({
      'fontawesome': require('./assets/fonts/fontawesome.ttf'),
      // 'icomoon': require('./assets/fonts/icomoon.ttf'),
      // 'Righteous-Regular': require('./assets/fonts/Righteous-Regular.ttf'),
      // 'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
      // 'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
      //   'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
      //   'Roboto-Light': require('./assets/fonts/Roboto-Light.ttf'),
      'SF-UI': require('./assets/fonts/SF-UI-Display-Regular.ttf'),
    });
    this.setState({loaded: true});
  };

  render() {
    if (!this.state.loaded) {
      return <AppLoading />;
    }

    return (
      <View style={{flex: 1}}>
        <KittenApp
          onNavigationStateChange={(prevState, currentState) => {
            const currentScreen = getCurrentRouteName(currentState);
            const prevScreen = getCurrentRouteName(prevState);

            if (prevScreen !== currentScreen) {
              track(currentScreen);
            }
          }}
        />
      </View>
    );
  }
}

Expo.registerRootComponent(App);
