import React, { Component } from "react";
import {
  Button,
  View,
  Text,
  Image,
  Easing,
  Dimensions,
  TouchableHighlight,
  NativeModules
} from "react-native";
import { createStackNavigator } from "react-navigation";
import UserRegist from "@screens/Regist";
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
import type { Notification } from "react-native-firebase";

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
    QRcodeScanner: QRcodeScanner
  },
  {
    headerMode: "none",
    initialRouteName: "Loading"
  }
);
export default class App extends React.Component {
  componentDidMount() {
    const channel = new firebase.notifications.Android.Channel(
      "justmoment",
      "방금",
      firebase.notifications.Android.Importance.Max
    ).setDescription("방금의 노티피케이션 채널");
    firebase.notifications().android.createChannel(channel);

    this.messageListener = firebase
      .messaging()
      .onMessage((message: RemoteMessage) => {
        console.log("foreground onMessage", message);
        if (Platform.OS === "android") {
          const localNotification = new firebase.notifications.Notification({
            sound: "default",
            show_in_foreground: true
          })
            .setNotificationId(message._messageId)
            //.setTitle(message._data.title)
            .setTitle("방금")
            // .setSubtitle(message.subtitle)
            .setBody(message._data.content)
            // .setData(message.data)
            .android.setChannelId("justmoment") // e.g. the id you chose above
            .android.setSmallIcon("ic_stat_ic_stat_smallicon") // create this icon in Android Studio
            // .android.setColor("#000000") // you can set a color here
            .android.setPriority(firebase.notifications.Android.Priority.High);

          firebase
            .notifications()
            .displayNotification(localNotification)
            .catch(err => console.error(err));
        } else if (Platform.OS === "ios") {
          const localNotification = new firebase.notifications.Notification()
            .setNotificationId(message._messageId)
            .setTitle("방금")
            //.setTitle(message._data.title)
            .setSubtitle(message.subtitle)
            .setBody(message._data.content)
            .setData(message.data)
            .ios.setBadge(message.ios.badge);

          firebase
            .notifications()
            .displayNotification(localNotification)
            .catch(err => console.error(err));
        }
      });

    //notification으로 올때\
    //onNotifiaction 이후 발생한다.
    this.notificationDisplayedListener = firebase
      .notifications()
      .onNotificationDisplayed((notification: Notification) => {
        // Process your notification as required
        // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
      });

    //notification 올때
    this.notificationListener = firebase
      .notifications()
      .onNotification((notification: Notification) => {
        if (Platform.OS === "android") {
          const localNotification = new firebase.notifications.Notification({
            sound: "default",
            show_in_foreground: true
          })
            .setNotificationId(notification.notificationId)
            .setTitle("방금")
            .setSubtitle(notification.subtitle)
            .setBody(notification.body)
            .setData(notification.data)
            .android.setChannelId("justmoment") // e.g. the id you chose above
            .android.setSmallIcon("ic_stat_ic_stat_smallicon") // create this icon in Android Studio
            // .android.setColor("#000000") // you can set a color here
            .android.setPriority(firebase.notifications.Android.Priority.High);

          firebase
            .notifications()
            .displayNotification(localNotification)
            .catch(err => console.error(err));
        } else if (Platform.OS === "ios") {
          const localNotification = new firebase.notifications.Notification()
            .setNotificationId(notification.notificationId)
            .setTitle("방금")
            .setSubtitle(notification.subtitle)
            .setBody(notification.body)
            .setData(notification.data)
            .ios.setBadge(message.ios.badge);

          firebase
            .notifications()
            .displayNotification(localNotification)
            .catch(err => console.error(err));
        }
      });
  }

  componentWillUnmount() {
    this.notificationDisplayedListener();
    this.notificationListener();
    // this.messageListener();
  }

  render() {
    return (
      <Provider store={createStore(reducers)}>
        <ThemeContext.Provider value={getTheme(uiTheme)}>
          <RootStack />
        </ThemeContext.Provider>
      </Provider>
    );
  }
}
