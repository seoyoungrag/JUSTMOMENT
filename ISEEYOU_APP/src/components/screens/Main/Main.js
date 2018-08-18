import React, { Component } from "react";

import {
  Alert,
  AppRegistry,
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  Button,
  ImageBackground,
  Linking,
  BackHandler,
  ScrollView,
  StyleSheet
} from "react-native";

import Images from "@assets/images";

import Header from "@header";

import DrawerWrapped from "@drawer";

import Moment from "moment";

import { connect } from "react-redux";
import ActionCreator from "@redux-yrseo/actions";

import cFetch from "@lib/network/customFetch";
import APIS from "@lib/network/APIS";

import Timeline from "./Timeline";

import ChildListItem from "./ChildListItem";

import PTRView from "react-native-pull-to-refresh";

import firebase from "react-native-firebase";

import type { Notification } from "react-native-firebase";
import { Platform } from "react-native";
function mapStateToProps(state) {
  return {
    USER_INFO: state.REDUCER_USER.user,
    WISE_SAYING: state.REDUCER_EXERCISE.wiseSaying,
    CHILD_STATUS: state.REDUCER_EXERCISE.childStatus
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setChildStatus: data => {
      dispatch(ActionCreator.setChildStatus(data));
    }
  };
}
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      WISE_SAYING: this.props.WISE_SAYING[
        Math.floor(Math.random() * this.props.WISE_SAYING.length)
      ].text,
      needRefresh: false,
      wholeChildList: []
    };
    this.handleBackButton = this.handleBackButton.bind(this);
    this._getChildInfo = this._getChildInfo.bind(this);
    this._refresh = this._refresh.bind(this);
  }

  _refresh() {
    return new Promise(resolve => {
      this._getChildInfo();
      setTimeout(() => {
        resolve();
      }, 100);
    });
  }

  componentWillUnmount() {
    this.notificationDisplayedListener();
    this.notificationListener();
    // this.messageListener();
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }

  handleBackButton() {
    Alert.alert(
      "앱을 종료합니다.",
      "종료하시겠습니까?",
      [
        {
          text: "아니오",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "네",
          onPress: () => BackHandler.exitApp()
        }
      ],
      {
        cancelable: false
      }
    );
    return true;
  }

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
          console.log("메시지수신1시작");
          console.log(this.props.setChildStatus);
          console.log(this.props.CHILD_STATUS);
          console.log(message._data.content);

          this.props.setChildStatus(message._data.content);
          console.log("1" + this.props.CHILD_STATUS);
          console.log("메시지수신1끝");
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

          console.log("메시지수신2시작");
          console.log(this.props.setChildStatus);
          console.log(notification.data);
          this.props.setChildStatus(notification.data);
          console.log(this.props.CHILD_STATUS);
          console.log("메시지수신1끝");
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
    this._getChildInfo();
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
  }
  _getChildInfo() {
    console.log("_getChildInfo in Main.js start");
    COM = this;
    PROPS = this.props;
    console.log("-------------");
    console.log(PROPS.USER_INFO);
    console.log("-------------");
    // cFetch(
    //   {
    //     url: "/k_child_parent/4",
    //     method: "GET"
    //   },
    //   // APIS.GET_CHILD_BY_CENTER_ID,
    //   [],{},
    //   {
    //     responseProc: function(res) {
    //       COM.setState({
    //         wholeChildList: res
    //       });
    //     },
    //     responseNotFound: function(res) {}
    //   }
    // );
    if (
      (PROPS.USER_INFO.userRoleCd == 100001 ||
        PROPS.USER_INFO.userRoleCd == 100002 ||
        PROPS.USER_INFO.userRoleCd == 100003 ||
        PROPS.USER_INFO.userRoleCd == 100005) &&
      PROPS.USER_INFO.centerId != null
    ) {
      //전체, 원장
      let centerId = PROPS.USER_INFO.centerId;
      cFetch(
        APIS.GET_CHILD_BY_CENTER_ID,
        [
          centerId
          //로그인한 사용자 user.user_id
        ],
        {},
        {
          responseProc: function(res) {
            COM.setState({
              wholeChildList: res
            });
          },
          responseNotFound: function(res) {}
        }
      );
      // } else if (PROPS.USER_INFO.userRoleCd == 100003) {
      //   // 선생님
      //   let teacherId = PROPS.USER_INFO.userId;
      //   cFetch(
      //     APIS.GET_CHILD_TEACHER_BY_UID_AND_DATE,
      //     [
      //       teacherId
      //       //로그인한 사용자 user.user_id
      //     ],
      //     {},
      //     {
      //       responseProc: function(res) {
      //         COM.setState({
      //           wholeChildList: res
      //         });
      //       },
      //       responseNotFound: function(res) {}
      //     }
      //   );
    } else {
      //100004, 100005 부모, 기타
      //100005는 제외 1000005는 운전기사등 스태프다.
      let parentId = PROPS.USER_INFO.userPhone;
      cFetch(
        APIS.GET_CHILD_PARENT_BY_UID_AND_DATE,
        [
          parentId
          //로그인한 사용자 user.user_phone
        ],
        {},
        {
          responseProc: function(res) {
            COM.setState({
              wholeChildList: res
            });
          },
          responseNotFound: function(res) {}
        }
      );
    }
    console.log("-------------");
    // console.log(this.state.wholeChildList);
    console.log("-------------");
    console.log("_getChildInfo in Main.js end");
  }
  static navigationOptions = {
    title: "메인"
  };
  render() {
    const { width, height } = Dimensions.get("window");
    const { classWithChildList, myChildList, realChildList } = this.state;
    const USER_INFO = this.props.USER_INFO;
    const header = <Header navigation={this.props.navigation} />;
    const childSet = new Set();
    let index = 0; //로깅에 자꾸 나와서 추가함, 로깅 안나오게 하는 법좀.. Warning: Each child in an array or iterator should have a unique "key" prop.
    this.state.wholeChildList.map(classList => {
      classList.classDailyEvent.forEach(classDailyEvent => {
        classDailyEvent.eventCheck.forEach(child => {
          childSet.add({
            classNm: classList.classNm,
            childId: child.childId,
            childNm: child.childNm
          });
        });
      });
    });
    const wholeChildList = Array.from(childSet);
    const lapsList =
      this.state.wholeChildList.length > 0 ? (
        this.state.wholeChildList.map(childList => {
          index++;
          return (
            <ChildListItem
              key={index}
              refreshFnc={this._getChildInfo}
              navigation={this.props.navigation}
              index={index} //로깅에 자꾸 나와서 추가함, 로깅 안나오게 하는 법좀.. Warning: Each child in an array or iterator should have a unique "key" prop.
              // class정보들, classDailyEvent(list):[클래스이벤트정보,체크청보(list):[아이]]
              data={childList}
              wholeChildList={wholeChildList}
            />
          );
        })
      ) : (
        <View
          style={{
            height: height * 0.753125,
            backgroundColor: "#00bcd4",
            alignItems: "center"
          }}
        >
          <Image
            source={Images.babyIcon}
            resizeMode="contain"
            style={{ width: "50%", height: "50%" }}
          />
          <Text
            style={{
              textShadowColor: "rgba(0,0,0,1)",
              color: "rgba(255,255,255,1)",
              fontFamily: "NotoSans-Regular",
              textAlign: "center",
              fontSize: 16,
              textShadowOffset: { width: -1, height: 1 },
              textShadowRadius: 1
            }}
          >
            데이터가 없습니다.
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "rgba(255,255,255,.5)",
              position: "absolute",
              bottom: 0
            }}
            onPress={() => {
              Linking.openURL(
                "https://cafe.naver.com/childrenneeds?iframe_url=/ArticleRead.nhn%3Fclubid=29481739%26articleid=11%26referrerAllArticles=true"
              );
            }}
          >
            <Text
              style={{
                textShadowColor: "rgba(0,0,0,1)",
                color: "rgba(255,255,255,1)",
                fontFamily: "NotoSans-Regular",
                fontWeight: "bold",
                textAlign: "center",
                fontSize: 16,
                padding: 40,
                textShadowOffset: { width: -1, height: 1 },
                textShadowRadius: 10
              }}
            >
              이 곳을 클릭하시면 앱의 사용법을 안내하는 페이지로 이동합니다.
            </Text>
          </TouchableOpacity>
        </View>
      );

    const content = (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          backgroundColor: "white"
        }}
      >
        <ImageBackground
          style={{
            flex: 10,
            width: "100%",
            // height: "100%",
            justifyContent: "center"
          }}
          resizeMode="stretch"
          source={Images.graphicImage}
        >
          <View
            style={[
              {
                backgroundColor: "rgba(255,255,255,.1)",
                width: "50%",
                height: "100%",
                justifyContent: "center",
                alignItems: "flex-start"
              }
            ]}
          >
            <Text
              style={{
                color: "rgba(255,255,255,1)",
                textShadowColor: "rgba(0,0,0,.1)",
                fontFamily: "NotoSans-Regular",
                fontWeight: "bold",
                textAlign: "left",
                fontSize: 16,
                paddingLeft: 20,
                // padding: 40,
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 1
              }}
            >
              {this.state.WISE_SAYING}
            </Text>
          </View>
        </ImageBackground>
        <View
          style={{
            flex: 48,
            alignItems: "center"
          }}
        >
          <PTRView
            style={{ width: "100%", height: "100%" }}
            onRefresh={this._refresh}
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              scrollDisabled
              style={{ width: "100%", height: "100%" }}
            >
              {lapsList}
            </ScrollView>
          </PTRView>
          <View style={{ flex: 2 }} />
        </View>
      </View>
    );
    return (
      <DrawerWrapped
        // refreshFnc={this._getChildInfo}
        refreshFnc={this.props.navigation.state.params.callBack}
        rightDisabled={true}
        navigation={this.props.navigation}
        header={header}
        // footer={footer}
        content={content}
        parentWidth={width}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);
