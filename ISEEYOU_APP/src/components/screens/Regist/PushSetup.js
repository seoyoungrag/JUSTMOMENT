import React, { Component } from "react";
import {
  Alert,
  AppRegistry,
  ScrollView,
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ImageBackground,
  Slider,
  Picker,
  BackHandler
} from "react-native";
import Images from "@assets/images";
import { TextField } from "react-native-material-textfield";
import {
  COLOR,
  ThemeProvider,
  Checkbox,
  Button
} from "react-native-material-ui";

import Autocomplete from "@lib/autocomplete";

import DrawerWrapped from "@drawer";
import { connect } from "react-redux";
import ActionCreator from "@redux-yrseo/actions";

import cFetch from "@lib/network/customFetch";
import APIS from "@lib/network/APIS";
import Header from "@header";

import ToggleSwitch from "toggle-switch-react-native";

function mapStateToProps(state) {
  return {
    USER_INFO: state.REDUCER_USER.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setUserInfo: user => {
      dispatch(ActionCreator.setUserInfo(user));
    },
    setCode: data => {
      dispatch(ActionCreator.setCode(data));
    },
    setCodeCategory: data => {
      dispatch(ActionCreator.setCodeCategory(data));
    }
  };
}
function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}
const { width, height } = Dimensions.get("window");
class UserRegist extends Component {
  constructor(props) {
    super(props);

    this.handleBackButton = this.handleBackButton.bind(this);
    this._saveBtnPressed = this._saveBtnPressed.bind(this);

    this.alarmNormalYnRef = this.updateRef.bind(this, "alarmNormalYnRef");
    this.alarmEmergencyYnRef = this.updateRef.bind(this, "alarmEmergencyYnRef");

    this.state = {
      //사용자정보
      alarmNormalYn:
        this.props.USER_INFO.alarmNormalYn != undefined
          ? this.props.USER_INFO.alarmNormalYn == "Y"
            ? true
            : false
          : true,
      alarmEmergencyYn:
        this.props.USER_INFO.alarmEmergencyYn != undefined
          ? this.props.USER_INFO.alarmEmergencyYn == "Y"
            ? true
            : false
          : false
    };
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }
  handleBackButton() {
    return true;
  }
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
    const COM = this;
  }

  _saveBtnPressed() {
    console.log("save btn pressed in PushSetup.js start");
    var data = this.props.USER_INFO;
    console.log("before Data in PushSetup.js start--");
    console.log(JSON.stringify(data));
    console.log("before Data in PushSetup.js end --");
    data.alarmNormalYn = this.state.alarmNormalYn ? "Y" : "N";
    data.alarmEmergencyYn = this.state.alarmEmergencyYn ? "Y" : "N";
    var body = JSON.stringify(data);
    const PROPS = this.props;
    const COM = this;
    cFetch(APIS.PUT_USER_BY_PHONE, [this.props.USER_INFO.userPhone], body, {
      responseProc: function(res) {
        PROPS.setUserInfo(res);
        console.log(PROPS.navigation.state.params);
        if (
          PROPS.navigation.state.params &&
          PROPS.navigation.state.params.refreshFnc
        ) {
          console.log("refreshFnc in PushSetup.js");
          PROPS.navigation.state.params.refreshFnc();
        }
        PROPS.navigation.navigate("Loading");
      },
      //입력된 회원정보가 없음.
      responseNotFound: function(res) {
        console.log("유저 업데이트가 실패했습니다.");
        PROPS.navigation.navigate("Loading");
        // APIS.PUT_SUER_BY_PHONE에서 사용자가 없으면 생성되어야 한다.
      }
    });
    console.log("save btn pressed in PushSetup.js end");
  }
  updateRef(name, ref) {
    this[name] = ref;
  }

  render() {
    const header = (
      <Header
        isBack={true}
        title="알림여부를 입력합니다."
        navigation={this.props.navigation}
      />
    );

    const content = (
      <ImageBackground
        style={[styles.container]}
        source={Images.EmptyBackground} //화면 배경 이미지
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          scrollDisabled
          style={{ width: "100%" }}
        >
          <View style={{ flex: 20 }} />

          <View
            style={{
              flex: 65,
              marginVertical: width * 0.0625,
              margin: width * 0.0625,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(255,255,255,.9)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,.8)"
              }}
            >
              <Text
                style={{
                  width: "100%",
                  alignSelf: "flex-start",
                  color: "rgba(0,0,0,1)",
                  fontFamily: "NotoSans-Regular",
                  borderBottomWidth: 1,
                  borderColor: "rgba(0,0,0,.1)"
                }}
              >
                이용자님의 알림 여부를 설정하세요.
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  paddingTop: 10,
                  paddingBottom: 30,
                  width: "95%",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <ToggleSwitch
                  isOn={this.state.alarmNormalYn}
                  onColor="green"
                  offColor="silver"
                  label="일반 알림을 수신합니다."
                  labelStyle={{ color: "black", fontWeight: "900" }}
                  size="large"
                  onToggle={isOn =>
                    this.setState({ alarmNormalYn: !this.state.alarmNormalYn })
                  }
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  paddingTop: 10,
                  paddingBottom: 30,
                  width: "95%",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <ToggleSwitch
                  isOn={this.state.alarmEmergencyYn}
                  onColor="green"
                  offColor="silver"
                  label="긴급 알림을 수신합니다."
                  labelStyle={{ color: "black", fontWeight: "900" }}
                  size="large"
                  onToggle={isOn =>
                    this.setState({
                      alarmEmergencyYn: !this.state.alarmEmergencyYn
                    })
                  }
                />
              </View>
            </View>
            <View
              style={{
                width: "100%"
              }}
            >
              <Button
                style={{
                  backgroundColor: "rgba(0,0,0,0.1)",
                  borderColor: "#afa8a1",
                  borderWidth: 1,
                  borderRadius: 100,
                  width: "100%"
                }}
                icon="check"
                raised
                text="저장"
                onPress={this._saveBtnPressed}
              />
            </View>
          </View>

          <View style={{ flex: 15 }} />
        </ScrollView>
      </ImageBackground>
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

let styles = {
  autocompleteContainer: {
    width: "95%",
    //height: "30%",
    borderWidth: 0,
    borderColor: "rgba(0,0,0,0)",
    backgroundColor: "rgba(0,0,0,0)",
    paddingTop: 10,
    paddingBottom: 50
  },
  itemText: {
    fontSize: 15,
    margin: 2
  },
  inputContainerStyle: {
    borderWidth: 0,
    borderColor: "rgba(0,0,0,0)",
    backgroundColor: "rgba(0,0,0,0)"
    //backgroundColor: "blue"
  },
  container: {
    flex: 1
  },
  textFieldContainerStyle: {
    width: 80,
    marginTop: 0,
    marginBottom: 0,
    paddingTop: 0
  },
  textFieldLabelStyle: {
    width: 80,
    marginTop: 0,
    marginBottom: 0,
    paddingTop: 0
  },
  textFieldFontSize: 14,
  textFieldLabelHeight: 20
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserRegist);
