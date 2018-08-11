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
const USER_INFO = {};
const { width, height } = Dimensions.get("window");
class UserRegist extends Component {
  constructor(props) {
    super(props);
    USER_INFO = this.props.USER_INFO;

    this.handleBackButton = this.handleBackButton.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this._saveBtnPressed = this._saveBtnPressed.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onSubmitUserNm = this.onSubmitUserNm.bind(this);
    this.onSubmitUserPhone = this.onSubmitUserPhone.bind(this);

    this.userNmRef = this.updateRef.bind(this, "userNm");
    this.userPhoneRef = this.updateRef.bind(this, "userPhone");

    this.state = {
      //사용자정보
      userNm:
        this.props.USER_INFO.userNm != undefined
          ? this.props.USER_INFO.userNm
          : "",
      userPhone:
        this.props.USER_INFO.userPhone != undefined
          ? this.props.USER_INFO.userPhone.toString()
          : "",
      centers: [],
      query: "",
      selectedCenterId: 0
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

  //input box에 초점을 맞춤(몰라)
  onFocus() {
    let { errors = {} } = this.state;

    for (let name in errors) {
      let ref = this[name];

      // if (ref && ref.isFocused()) {
      //   delete errors[name];
      // }
    }

    this.setState({ errors });
  }
  onChangeText(text) {
    ["userNm", "userPhone"]
      .map(name => ({ name, ref: this[name] }))
      .forEach(({ name, ref }) => {
        if (ref.isFocused()) {
          this.setState({ [name]: text });
        }
      });
  }

  onSubmitUserNm() {
    this.userPhone.focus();
  }
  onSubmitUserPhone() {}

  _saveBtnPressed() {
    console.log("save btn pressed in userRegist.js start");
    var data = this.props.USER_INFO;
    console.log("before Data in userRgeist.js start--");
    console.log(data.toString());
    console.log("before Data in userRgeist.js end --");
    data.userNm = this.state.userNm;
    data.userPhone = this.state.userPhone;

    var phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{4}[-\s\.]?[0-9]{4,6}$/im;
    var body = JSON.stringify(data);
    const PROPS = this.props;
    const COM = this;
    if (!data.userNm) {
      alert("미입력된 정보가 있습니다. 확인해주세요.");
    } else if (!data.userPhone.match(phoneRegex)) {
      alert("전화번호 정보가 올바르지 않습니다.");
    } else {
      // 테스트 코드
      // let urlAndMethod =
      //   this.props.navigation.state.params.userStep == "regist"
      //     ? APIS.POST_USER
      //     : APIS.PUT_USER_BY_PHONE;
      // let param =
      //   this.props.navigation.state.params.userStep == "regist"
      //     ? []
      //     : [
      //         this.props.USER_INFO.id //테스트
      //       ];
      cFetch(APIS.PUT_USER_BY_PHONE, [this.props.USER_INFO.userPhone], body, {
        responseProc: function(res) {
          PROPS.setUserInfo(res);
          if (res && !isEmpty(res)) {
            cFetch(
              APIS.GET_CODE,
              [],
              {},
              {
                responseProc: function(res) {
                  PROPS.setCode(res.list ? res.list : res);
                  cFetch(
                    APIS.GET_CODE_CATEGORY,
                    [],
                    {},
                    {
                      responseProc: function(res) {
                        PROPS.setCodeCategory(res.list ? res.list : res);
                        console.log(
                          "go Main via Loading to go Loading in UserRegist.js"
                        );
                        console.log(PROPS.navigation.state.params);
                        if (
                          PROPS.navigation.state.params &&
                          PROPS.navigation.state.params.refreshFnc
                        ) {
                          console.log("refreshFnc in userRegist.js");
                          PROPS.navigation.state.params.refreshFnc();
                        }
                        PROPS.navigation.navigate("Loading");
                      }
                    }
                  );
                }
              }
            );
          }
        },
        //입력된 회원정보가 없음.
        responseNotFound: function(res) {
          alert("신규 유저 생성 및 유저 업데이트가 실패했습니다.");
          PROPS.navigation.navigate("Login");
          // APIS.PUT_SUER_BY_PHONE에서 사용자가 없으면 생성되어야 한다.
        }
      });
    }
    console.log("save btn pressed in userRegist.js end");
  }
  updateRef(name, ref) {
    this[name] = ref;
  }

  findCenter(query) {
    if (query === "") {
      return [];
    }
    const { centers } = this.state;
    const regex = new RegExp(`${query.trim()}`, "i");
    return centers.filter(center => center.value.search(regex) >= 0);
  }

  render() {
    const { query, selectedCenterId } = this.state;
    const centers = this.findCenter(query);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    let { errors = {}, secureTextEntry, ...data } = this.state;
    const header = (
      <Header
        isBack={true}
        title="회원정보를 입력합니다."
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
                이용자님 기본 정보를 입력해주세요.
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  paddingTop: 10,
                  paddingBottom: 30,
                  width: "95%"
                }}
              >
                <TextField
                  textColor="rgba(0,0,0,1)"
                  baseColor="rgba(0,0,0,.5)"
                  tintColor="rgba(0,0,0,.9)"
                  fontSize={styles.textFieldFontSize}
                  containerStyle={[styles.textFieldContainerStyle, { flex: 1 }]}
                  labelHeight={styles.textFieldLabelHeight}
                  labels
                  ref={this.userNmRef}
                  value={data.userNm}
                  autoCorrect={false}
                  enablesReturnKeyAutomatically={true}
                  onFocus={this.onFocus}
                  onChangeText={this.onChangeText}
                  onSubmitEditing={this.onSubmitUserNm}
                  returnKeyType="next"
                  label="이름"
                  error={errors.userNm}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  paddingTop: 10,
                  paddingBottom: 30,
                  width: "95%"
                }}
              >
                <TextField
                  keyboardType="numeric"
                  textColor="rgba(0,0,0,1)"
                  baseColor="rgba(0,0,0,.5)"
                  tintColor="rgba(0,0,0,.9)"
                  fontSize={styles.textFieldFontSize}
                  containerStyle={[styles.textFieldContainerStyle, { flex: 1 }]}
                  labelHeight={styles.textFieldLabelHeight}
                  ref={this.userPhoneRef}
                  value={data.userPhone}
                  autoCorrect={false}
                  enablesReturnKeyAutomatically={true}
                  onFocus={this.onFocus}
                  onChangeText={this.onChangeText}
                  onSubmitEditing={this.onSubmitUserPhone}
                  returnKeyType="next"
                  label="전화번호(예시: 01234567890)"
                  error={errors.userPhone}
                />
              </View>
              {/* <Text
                style={{
                  width: "100%",
                  alignSelf: "flex-start",
                  color: "white",
                  fontFamily: "NotoSans-Regular",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,.1)"
                }}
              >
                사용자가 선생님인 경우 원을 등록해주세요. {"\n"}
                (등록후 원의 관리자 승인이 필요합니다.)
              </Text>
              <Autocomplete
                renderTextInput={() => (
                  <TextInput
                    placeholder="원 검색"
                    placeholderTextColor="white"
                    underlineColorAndroid="white"
                    onChangeText={text => this.setState({ query: text })}
                    value={this.state.query}
                    style={{
                      textAlign: "center",
                      fontSize: 18,
                      color: "white",
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,.1)"
                    }}
                  />
                )}
                inputContainerStyle={[styles.inputContainerStyle]}
                inputContainerImgSrc={
                  this.state.query == "" ? undefined : undefined
                }
                autoCapitalize="none"
                autoCorrect={false}
                containerStyle={styles.autocompleteContainer}
                data={
                  centers.length === 1 && comp(query, centers[0].value)
                    ? []
                    : centers
                }
                defaultValue={this.state.query}
                onChangeText={text => this.setState({ query: text })}
                renderItem={({ value, centerId }) => (
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({
                        query: value,
                        selectedCenterId: centerId
                      })
                    }
                  >
                    <Text style={styles.itemText}>{value}</Text>
                  </TouchableOpacity>
                )}
              /> */}
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
