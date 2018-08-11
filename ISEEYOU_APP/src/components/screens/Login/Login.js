import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
  NativeModules,
  ImageBackground
} from "react-native";

import Images from "@assets/images";
import firebase from "react-native-firebase";
import { AccessToken, LoginManager } from "react-native-fbsdk";
import { GoogleSignin } from "react-native-google-signin";
import { Button } from "react-native-material-ui";
import Icon from "react-native-vector-icons/FontAwesome";
import { SocialIcon } from "react-native-elements";

// const { RNTwitterSignIn } = NativeModules;

import DrawerWrapped from "@drawer";

import cFetch from "@lib/network/customFetch";
import APIS from "@lib/network/APIS";

import { connect } from "react-redux";
import ActionCreator from "@redux-yrseo/actions";
const { width, height } = Dimensions.get("window");
const config = {
  consumer_key: "8g79QC8WELru0UXAlzd7Sh8Z9",
  consumer_secret: "xcpxCxJuG3sIEim7sxsFb3DzPy3MaAwC0nMiObp4zOSuZJjBiB"
};

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
class Login extends React.Component {
  constructor(props) {
    super(props);
  }
  state = { email: "", password: "", errorMessage: null };
  componentDidMount() {}
  handleSignUp = () => {
    firebase
      .auth()
      .createUserAndRetrieveDataWithEmailAndPassword(
        this.state.email,
        this.state.password
      )
      .then(() => {
        this.props.navigation.navigate("Loading", {
          refresh: true
        });
      })
      .catch(error => this.setState({ errorMessage: error.message }));
  };

  handleLogin = () => {
    LoadingComponent = this;
    const { email, password } = this.state;
    firebase
      .auth()
      .signInAndRetrieveDataWithEmailAndPassword(email, password)
      .then(() => {
        this.props.navigation.navigate("Loading", {
          refresh: true
        });
      })
      .catch(error => this.setState({ errorMessage: error.message }));
  };
  kakaoTalk = async () => {
    try {
      var data = await KakaoLogin.login();
      console.log("kakao data", data);
    } catch (e) {
      // if(e.code === 'KAKAO_LOGIN_CANCEL'){//사용자가 취소
      // }
      // console.log('kakao error receive......', JSON.stringify(e) )
      console.log("kakao error receive......", e.code);
    }
  };
  googleLogin = async () => {
    try {
      // Add any configuration settings here:
      await GoogleSignin.configure();
      const data = {};
      try {
        data = await GoogleSignin.signIn();
      } catch (e) {
        console.log(e);
        return false;
      }

      // create a new firebase credential with the token
      const credential = firebase.auth.GoogleAuthProvider.credential(
        data.idToken,
        data.accessToken
      );
      // login with credential
      const currentUser = await firebase
        .auth()
        .signInAndRetrieveDataWithCredential(credential);

      console.info(JSON.stringify(currentUser.user.toJSON()));
      currentUser
        ? this.props.navigation.navigate("Loading")
        : //await this.authProc()
          alert("로그인이 실패하였습니다.");
    } catch (e) {
      console.error(e);
    }
  };
  facebookLogin = async () => {
    try {
      const result = await LoginManager.logInWithReadPermissions([
        "public_profile",
        "email"
      ]);
      // if (!result) {
      // }
      if (result.isCancelled) {
        console.log("User cancelled request"); // Handle this however fits the flow of your app
        return false;
      }
      console.log(
        `Login success with permissions: ${result.grantedPermissions.toString()}`
      );
      // get the access token
      const data = await AccessToken.getCurrentAccessToken();
      // if (!data) {
      // }
      if (!data) {
        throw new Error(
          "Something went wrong obtaining the users access token"
        ); // Handle this however fits the flow of your app
      }
      // create a new firebase credential with the token
      const credential = firebase.auth.FacebookAuthProvider.credential(
        data.accessToken
      );
      // if (!credential) {
      // }
      // login with credential
      const currentUser = await firebase
        .auth()
        .signInAndRetrieveDataWithCredential(credential);
      if (!currentUser) {
        console.info(JSON.stringify(currentUser.user.toJSON()));
      }

      console.log("facebookLogin end");
      currentUser
        ? this.props.navigation.navigate("Loading")
        : //this.authProc()
          alert("로그인이 실패하였습니다.");
    } catch (e) {
      console.error(e);
    }
  };

  // twitterLogin = async () => {
  //   RNTwitterSignIn.init(config.consumer_key, config.consumer_secret);
  //   let twitterTokensObject;
  //   let loginData;
  //   //get credentials

  //   try {
  //     loginData = await RNTwitterSignIn.logIn();
  //     console.log("Twitter login data", loginData);
  //   } catch (err) {
  //     console.log("Error with twitter login result", err);
  //   }

  //   //link to react native firebase

  //   try {
  //     const { authToken, authTokenSecret } = loginData;

  //     const credential = firebase.auth.TwitterAuthProvider.credential(
  //       authToken,
  //       authTokenSecret
  //     );
  //     //오류남  버그 수정 중임..
  //     // https://github.com/invertase/react-native-firebase/issues/1249
  //     // const currentUser = await firebase
  //     //   .auth()
  //     //   .signInAndRetrieveDataWithCredential(credential);
  //     //   console.info(JSON.stringify(currentUser.user.toJSON()));
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };
  render() {
    const content = (
      <ImageBackground
        source={Images.loginLoadingBack}
        style={styles.container}
      >
        {/* <Text>이메일 로그인 입력</Text>
        {this.state.errorMessage && (
          <Text style={{ color: "red" }}>{this.state.errorMessage}</Text>
        )}
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <Button title="이메일 가입" onPress={this.handleSignUp} />
        <Button title="이메일 로그인" onPress={this.handleLogin} /> */}
        {/* <Button
          raised
          onPress={this.facebookLogin}
          title="페이스북"
          //icon="facebook"
        /> */}
        {/* <Button
          raised
          onPress={this.googleLogin}
          title="구글"
          //icon="google"
          color="white"
        /> */}
        {/* <Button onPress={this.twitterLogin} title="트위터" color="#3c50e8" /> */}
        {/* <Button onPress={this.KakaoLogin} title="카카오톡" color="#3c50e8" /> */}

        {/* <Button
          title="Already have an account? Login"
          onPress={() => this.props.navigation.navigate("Login")}
        /> */}
        <View
          style={[
            styles.rowContainer,
            {
              backgroundColor: "rgba(255,255,255,0.8)",
              borderRadius: 10,
              elevation: 1,
              // margin: 10
              padding: 20

              // shadowColor: "#000000",
              // shadowOpacity: 0.8,
              // shadowRadius: 2,
              // shadowOffset: {
              //   height: 1,
              //   width: 0
              // }
            }
          ]}
        >
          <View
            style={[
              styles.button,
              {
                borderBottomWidth: 2,
                borderBottomColor: "#4b4d5b",
                marginLeft: 0,
                marginRight: 0,
                marginBottom: 10
              }
            ]}
          >
            <Text
              style={{
                color: "#4b4d5b",
                fontFamily: "NotoSans-Regular",
                fontWeight: "bold",
                textAlign: "left",
                paddingBottom: 10,
                fontSize: 16,
                textShadowColor: "rgba(0,0,0,0.1)",
                // textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 10
              }}
            >
              로그인
            </Text>
            {/* <Button primary text="Accept" icon="done" /> */}
          </View>
          <View style={styles.button}>
            {/* <Icon.Button
              backgroundColor="#3b5998"
              name="facebook-official"
              onPress={this.facebookLogin}
            >
              페이스북 로그인
            </Icon.Button> */}

            <SocialIcon
              title="페이스북으로 로그인하기"
              button
              type="facebook"
              onPress={this.facebookLogin}
            />
            {/* <Button primary text="Accept" icon="done" /> */}
          </View>
          <View style={styles.button}>
            {/* <Icon.Button
              name="google"
              backgroundColor="white"
              color="black"
              onPress={this.googleLogin}
            >
              구글 로그인
            </Icon.Button> */}

            <SocialIcon
              title="구글계정으로 로그인하기"
              button
              type="google-plus-official"
              onPress={this.googleLogin}
            />
            {/* <Button accent text="Dismiss" icon="clear" /> */}
          </View>
        </View>
      </ImageBackground>
    );
    return (
      <DrawerWrapped
        rightDisabled={true}
        navigation={this.props.navigation}
        content={content}
        parentWidth={width}
      />
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  textInput: {
    height: 40,
    width: "90%",
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 8
  },
  rowContainer: {
    width: "90%",
    //flexDirection: "row",
    justifyContent: "center"
  },
  button: {
    marginHorizontal: 8
    // margin: 10
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
