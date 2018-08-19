import React, { Component } from "react";

import {
  AppRegistry,
  StyleSheet,
  Text,
  Vibration,
  TouchableOpacity,
  Linking,
  Dimensions,
  View,
  ActivityIndicator
} from "react-native";

import QRCodeScanner from "@lib/qrcodeScanner";
import Header from "@header";
import DrawerWrapped from "@drawer";
import { connect } from "react-redux";
import ActionCreator from "@redux-yrseo/actions";

import GridView from "react-native-super-grid";

import cFetch from "@lib/network/customFetch";
import APIS from "@lib/network/APIS";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import firebase from "react-native-firebase";
import LocalNotifService from "@lib/LocalNotifService";

var Sound = require("react-native-sound");
Sound.setCategory("Playback");

var whoosh = new Sound(
  require("./camera-shutter-click-08.mp3"),
  Sound.MAIN_BUNDLE,
  error => {
    if (error) {
      console.log("failed to load the sound", error);
      return;
    }
    // loaded successfully
    console.log(
      "duration in seconds: " +
        whoosh.getDuration() +
        "number of channels: " +
        whoosh.getNumberOfChannels()
    );
  }
);

function mapStateToProps(state) {
  return {
    USER_INFO: state.REDUCER_USER.user,
    CODE: state.REDUCER_CODE.code,
    CODE_CATEGORY: state.REDUCER_CODE.codeCategory
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}
const BACKGROUND = [
  "#1abc9c",
  "#2ecc71",
  "#3498db",
  "#9b59b6",
  "#34495e",
  "#16a085",
  "#27ae60",
  "#2980b9",
  "#8e44ad",
  "#2c3e50"
];
const DUMMY = [
  "소원석",
  "윤재훈",
  "최범진",
  "금시훈",
  "변나현",
  "이성오",
  "최성민",
  "강한나",
  "최제원",
  "송진선"
];
const DUMMYID = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
function leadingZeros(n, digits) {
  var zero = "";
  n = n.toString();

  if (n.length < digits) {
    for (i = 0; i < digits - n.length; i++) zero += "0";
  }
  return zero + n;
}

function getTime() {
  var d = new Date();
  var s =
    leadingZeros(d.getFullYear(), 4) +
    "-" +
    leadingZeros(d.getMonth() + 1, 2) +
    "-" +
    leadingZeros(d.getDate(), 2) +
    " " +
    leadingZeros(d.getHours(), 2) +
    ":" +
    leadingZeros(d.getMinutes(), 2) +
    ":" +
    leadingZeros(d.getSeconds(), 2);

  return s;
}
class QRcodeScanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      senderId: "538231083703",
      loadingShow: false
    };
    // this.notif = new LocalNotifService(
    //   this.onRegister.bind(this),
    //   this.onNotif.bind(this)
    // );
    // this.notiWithRemove = this.notiWithRemove.bind(this);
    this._saveAllChild = this._saveAllChild.bind(this);
  }

  onRegister(token) {
    // Alert.alert("Registered !", JSON.stringify(token));
    // console.log(token);
    // this.setState({ registerToken: token.token, gcmRegistered: false });
  }

  onNotif(notif) {
    console.log(notif);
    // Alert.alert(notif.title, notif.message);
  }

  handlePerm(perms) {
    //Alert.alert("Permissions", JSON.stringify(perms));
  }

  notiWithRemove(title, message) {
    return new Promise(resolve => {
      this.notif.localNotif({
        title: title,
        message: message
      });
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  }
  _saveAllChild() {
    return new Promise(resolve => {
      let eventNm = this.props.CODE.find(elem => {
        return elem.code == this.props.navigation.state.params.targetEventCd;
      }).codeNm;
      let destinyNm = this.props.navigation.state.params.destinyNm;
      let classDailyEventId = this.props.navigation.state.params
        .classDailyEventId;
      let targetEventCd = this.props.navigation.state.params.targetEventCd;
      var date = new Date();
      //인서트시간이나 서버시간찍어도 됨..
      const items = [...this.state.items];
      let processingId = 0;
      for (let i = 0; i < items.length; i++) {
        let data = {
          classDailyEventId: classDailyEventId,
          childId: items[i].id,
          checkerUserId: this.props.USER_INFO.userId
        };
        let formDate = getTime();
        data.eventStartDt = formDate;
        // if (targetEventCd == 300001) {
        //   data.eventStartDt = formDate;
        // } else {
        //   data.eventEndDt = formDate;
        // }
        let body = JSON.stringify(data);
        const COM = this;
        cFetch(APIS.POST_CHILD_EVENT, [], body, {
          responseProc: function(res) {
            processingId++;
          },
          responseNotFound: function(res) {
            processingId++;
            console.log("qrcode not f ", res);
            alert("입력이실패했습니다.\n관리자에게 확인해주세요");
          },
          responseError: function(res) {
            processingId++;
            console.log("qrcode err ", res);
          }
        });
      }
      resolve();
    });
  }
  componentDidMount() {
    // this.notiWithRemove("어린이1", "어린이2")
    //   .then(() => {
    //     this.notif.cancelAll();
    //   })
    //   .catch(error => {
    //     console.log(err);
    //   });
    // let checkedList = [];
    // this.props.navigation.state.params.targetChildList.forEach(checkInfo => {
    //   if (checkInfo.eventCheckDt) {
    //     checkedList.push({
    //       id: checkInfo.childId,
    //       name: checkInfo.childNm,
    //       code: BACKGROUND[checkedList.length % BACKGROUND.length],
    //       check: true
    //     });
    //   }
    // });
    // this.setState({ items: checkedList });
  }
  //동작안하네..
  _closeScreen = () => {
    this.setState({
      loadingShow: true
    });
    this._saveAllChild().then(() => {
      this.setState({
        loadingShow: false
      });
      this.props.navigation.state.params.refreshFnc();
      this.props.navigation.navigate("Main");
    });
  };
  _removeChild = id => {
    return new Promise(resolve => {
      const items = [...this.state.items];
      var index = items
        .map(x => {
          return x.id;
        })
        .indexOf(id);
      items.splice(index, 1);
      this.setState({ items: items });
      resolve();
    });
  };
  _addChild = (id, nm) => {
    return new Promise(resolve => {
      const items = [...this.state.items];
      let isExists = false;
      for (let i = 0; i < items.length; i++) {
        if (id.indexOf(items[i].id) > -1) {
          isExists = true;
          break;
        }
      }
      if (!isExists && nm) {
        items.push({
          id: id,
          name: nm,
          code: BACKGROUND[items.length % BACKGROUND.length],
          check: true
        });
      }
      this.setState({ items: items });
      resolve();
    });
  };
  onSuccess(e) {
    console.log(e);
    let url = "http://child.dwebss.co.kr";
    let code = this.props.CODE.find(elem => {
      return elem.code == 900001;
    });
    url = code ? code.codeNm : url;
    let targetChildList = this.props.navigation.state.params.targetChildList;
    let childId = "";
    let childNm = "";
    let classNm = "";
    let isNew = true;
    // let childId = DUMMYID[this.state.items.length % DUMMYID.length]; //test코드 주석하면된다.
    // let childNm = DUMMY[this.state.items.length % DUMMY.length]; //test코드 주석하면된다.
    // this._addChild(childId, childNm); //test코드 주석하면된다.
    if (e.data.indexOf(url) > -1) {
      childId = e.data.substr(e.data.lastIndexOf("/") + 1);
      targetChildList.forEach(data => {
        if (data.childId == childId) {
          // console.log(data.childId, childId, data.childNm);
          childNm = data.childNm;
          classNm = data.classNm;
        }
      });
      this.state.items.forEach(item => {
        if (childId == item.id) {
          isNew = false;
        }
      });
      // let urlWithChildId = url.substr(0, url.length - childId - 1);
      // childNm = urlWithChildId.substr(urlWithChildId.lastIndexOf("/") + 1);
      if (isNew) {
        this._addChild(childId, childNm)
          .then(() => {
            whoosh.play(success => {
              if (success) {
                console.log("successfully finished playing");
              } else {
                console.log("playback failed due to audio decoding errors");
                // reset the player to its uninitialized state (android only)
                // this is the only option to recover after an error occured and use the player again
                whoosh.reset();
              }
            });
            Vibration.vibrate();
          })
          .catch(error => {
            console.log(error);
          });
      }
    } else {
      // Linking.openURL(e.data).catch(err => {
      //   alert(
      //     "에러가 발생했습니다.\n잘못된 QR코드입니다.\n관리자에게 문의해주세요." +
      //       e.data
      //   );
      // });
    }
  }

  render() {
    const { width, height } = Dimensions.get("window");
    const content = (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {this.state.loadingShow ? (
          <View
            style={{
              padding: 10,
              margin: 10,
              backgroundColor: "white",
              borderColor: "silver",
              borderWidth: 1
            }}
          >
            <Text style={{ color: "black" }}>아이들 정보를 입력중입니다.</Text>
            <ActivityIndicator color="black" size="large" />
          </View>
        ) : (
          <QRCodeScanner
            vibrate={false}
            reactivate={true}
            reactivateTimeout={2}
            containerStyle={{ height: (height * 80) / 100, flex: 1 }}
            topContent={
              <Text style={(styles.centerText, { backgroundColor: "white" })}>
                아이의{" "}
                <Text style={(styles.textBold, { backgroundColor: "white" })}>
                  QR CODE
                </Text>
                를 인식해주세요.
              </Text>
            }
            topViewStyle={{
              // flex: undefined,
              // height: (height * 5) / 100,
              backgroundColor: "white",
              justifyContent: "center",
              alignItems: "center",
              padding: 0,
              margin: 0
            }}
            // containerStyle={{ height: 400 }}
            cameraStyle={{
              height: (height * 40) / 100,
              alignItems: undefined,
              justifyContent: undefined,
              flex: undefined
            }}
            onRead={this.onSuccess.bind(this)}
            bottomViewStyle={{
              width: width,
              height: (height * 30) / 100,
              flex: undefined
            }}
            bottomContent={
              <TouchableOpacity style={styles.buttonTouchable}>
                <GridView
                  itemDimension={50}
                  items={this.state.items}
                  style={styles.gridView}
                  renderItem={item => (
                    <TouchableOpacity
                      style={[
                        styles.itemContainer,
                        {
                          backgroundColor: item.code,
                          borderColor: item.code,
                          borderWidth: 1
                        }
                      ]}
                      onPress={this._removeChild}
                    >
                      <View
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          padding: 3,
                          borderColor: "silver",
                          borderWidth: 1,
                          backgroundColor: "white"
                        }}
                      >
                        <Text style={styles.itemX}>X</Text>
                      </View>
                      <Text style={styles.itemName}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity
                  style={
                    (styles.buttonTouchable,
                    {
                      paddingTop: 0,
                      paddingBottom: 20
                    })
                  }
                  onPress={() => {
                    this._closeScreen();
                  }}
                >
                  <Text style={styles.buttonText}>완료</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            }
          />
        )}
      </View>
    );
    const header = (
      <Header
        isBack={true}
        title="아이의 QR 코드를 인식합니다."
        navigation={this.props.navigation}
        refreshFnc={this.props.navigation.state.params.refreshFnc}
      />
    );

    return (
      <DrawerWrapped
        rightDisabled={true}
        navigation={this.props.navigation}
        content={content}
        parentWidth={width}
        header={header}
      />
    );
  }
}

const styles = StyleSheet.create({
  centerText: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    fontSize: 18,
    color: "#777"
  },
  textBold: {
    fontWeight: "500",
    color: "#000"
  },
  buttonText: {
    alignSelf: "center",
    borderColor: "silver",
    borderWidth: 1,
    fontSize: 21,
    color: "black",
    backgroundColor: "white",
    padding: 5
  },
  buttonTouchable: {
    width: "100%",
    padding: 16,
    paddingTop: 0,
    paddingBottom: 0
  },
  itemContainer: {
    //justifyContent: "flex-end",
    justifyContent: "center",
    alignItems: "center",
    //borderRadius: 5,
    //padding: 8,
    height: 50
  },
  itemName: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600"
  },
  itemX: {
    fontSize: 8,
    color: "#000"
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QRcodeScanner);
