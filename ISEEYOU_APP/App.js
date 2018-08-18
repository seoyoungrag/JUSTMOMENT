import React, { Component } from "react";
import {
  Button,
  View,
  Text,
  Image,
  Easing,
  Dimensions,
  TouchableHighlight,
  NativeModules,
  TouchableOpacity,
  StyleSheet,
  BackHandler
} from "react-native";
import { createStackNavigator } from "react-navigation";
import UserRegist from "@screens/Regist";
import PushSetup from "@screens/Regist/PushSetup";
import Main from "@screens/Main";

import Loading from "@screens/Login/Loading";
import Login from "@screens/Login";
import QRcodeScanner from "@screens/Main/QRcodeScanner";

import Images from "@assets/images";

import { COLOR, ThemeContext, getTheme } from "react-native-material-ui";

import { createStore } from "redux";
import { Provider } from "react-redux";
import reducers from "@redux-yrseo/reducers";

import firebase from "react-native-firebase";
import { Platform } from "react-native";
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded
} from "react-native-admob";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
const Banner = ({ children, ...props }) => <View>{children}</View>;

const uiTheme = {
  palette: {
    // primaryColor: COLOR.white,
    // secondaryColor: COLOR.white,
    // accentColor: COLOR.pink500
  },
  icon: {
    // color: COLOR.white
  },
  // drawer를 위해서 사용
  listItem: {
    primaryText: {
      color: "silver",
      fontSize: 8,
      fontFamily: "NotoSans-Regular"
    },
    container: {
      backgroundColor: "red"
    },
    // icon: {
    //   color: "rgba(255,255,255,1)"
    // },
    // label: {
    //   color: "rgba(255,255,255,1)"
    // },
    //각 item을 감싸는 View
    contentViewContainer: {
      backgroundColor: "silver",
      borderWidth: 1
    },
    // drawer메뉴의 각 메뉴 좌측 아이콘 뷰를 감싸는 뷰
    leftElementContainer: {
      alignItems: "flex-end",
      paddingRight: 10
    },
    // 좌측 아이콘을 감싸는 뷰
    leftElement: {
      // color: "rgba(255,255,255,1)",
      height: 8
    },
    centerElementContainer: {
      backgroundColor: "silver"
    },
    textViewContainer: {
      backgroundColor: "yellow"
    }
  }
};
const RootStack = createStackNavigator(
  {
    Regist: UserRegist,
    Login: Login,
    Loading: Loading,
    Main: Main,
    QRcodeScanner: QRcodeScanner,
    PushSetup: PushSetup
  },
  {
    headerMode: "none",
    initialRouteName: "Loading"
  }
);
export default class App extends React.Component {
  componentWillMount() {
    AdMobInterstitial.setTestDevices([AdMobInterstitial.simulatorId]);
    AdMobInterstitial.setAdUnitID("ca-app-pub-3705279151918090/7160757575");
    //AdMobInterstitial.setAdUnitID("ca-app-pub-3940256099942544/5224354917");

    AdMobInterstitial.addEventListener("adLoaded", () =>
      console.log("AdMobInterstitial adLoaded")
    );
    AdMobInterstitial.addEventListener("adFailedToLoad", error =>
      console.warn(error)
    );
    AdMobInterstitial.addEventListener("adOpened", () =>
      console.log("AdMobInterstitial => adOpened")
    );
    AdMobInterstitial.addEventListener("adClosed", () => {
      console.log("AdMobInterstitial => adClosed");
    });
    AdMobInterstitial.addEventListener("adLeftApplication", () => {
      console.log("AdMobInterstitial => adLeftApplication");
    });

    AdMobInterstitial.requestAd().catch(error => console.warn(error));
  }
  componentDidMount() {}

  componentWillUnmount() {
    AdMobInterstitial.removeAllListeners();
  }
  showInterstitial() {
    setTimeout(() => {
      AdMobInterstitial.removeAllListeners();
      BackHandler.exitApp();
    }, 1000);
    // BackHandler.exitApp();
    AdMobInterstitial.showAd().catch(error => console.warn(error));
    // AdMobInterstitial.removeAllListeners();
  }

  render() {
    return (
      <Provider store={createStore(reducers)}>
        <ThemeContext.Provider value={getTheme(uiTheme)}>
          <RootStack />

          <Banner>
            <TouchableOpacity
              onPress={this.showInterstitial}
              style={styles.headerFirstIconContainer}
            >
              <MaterialIcons
                name="exit-to-app"
                color="#000000"
                size={35}
                borderWidth={0}
                style={{ marginRight: 10 }}
              />
              <View style={styles.headerSecondTextContainer}>
                <Text style={styles.headerSecondText}>광고보고 종료하기</Text>
              </View>
            </TouchableOpacity>
            {/* <Button title="광고보고 종료하기" onPress={this.showInterstitial} /> */}
          </Banner>
        </ThemeContext.Provider>
      </Provider>
    );
  }
}

let styles = {
  headerMenuIconContainer: {
    alignItems: "flex-end",
    paddingRight: 10
  },
  headerMenuIcon: {
    width: 15,
    resizeMode: "contain"
  },
  headerFirstIconContainer: {
    paddingLeft: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    height: 70,
    borderColor: "black",
    borderWidth: 1
  },
  headerSecondTextContainer: {
    paddingLeft: 10
  },
  headerThirdDelimeterContainer: {
    paddingLeft: 10,
    alignItems: "flex-start"
  },
  headerFirstIcon: {
    width: 15,
    resizeMode: "contain"
  },
  headerSecondText: {
    fontSize: 22,
    color: "black",
    fontFamily: "NotoSans-Regular"
  },
  headerThirdDelimeter: {
    width: 1,
    resizeMode: "contain"
  }
};
