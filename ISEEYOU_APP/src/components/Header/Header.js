import React from "react";
import {
  Button,
  View,
  Text,
  Image,
  Easing,
  Dimensions,
  TouchableHighlight,
  TouchableOpacity
} from "react-native";
import Images from "@assets/images";
import { connect } from "react-redux";
import ActionCreator from "@redux-yrseo/actions";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

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
    paddingLeft: 10
    // alignItems: "flex-end"
  },
  headerSecondTextContainer: {
    // paddingLeft: 10
  },
  headerThirdDelimeterContainer: {
    // paddingLeft: 10,
    alignItems: "flex-start"
  },
  headerFirstIcon: {
    width: 15,
    resizeMode: "contain"
  },
  headerSecondText: {
    fontSize: 10,
    color: "black",
    fontFamily: "NotoSans-Regular"
  },
  headerThirdDelimeter: {
    width: 1,
    resizeMode: "contain"
  }
};

function mapStateToProps(state) {
  return {
    USER_INFO: state.REDUCER_USER.user,
    EXERCISE_GOAL: state.REDUCER_EXERCISE.exerciseGoalCd,
    CHILD_STATUS: state.REDUCER_EXERCISE.childStatus
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setUserInfo: user => {
      dispatch(ActionCreator.setUserInfo(user));
    },
    setChildStatus: data => {
      dispatch(ActionCreator.setChildStatus(data));
    }
  };
}
class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log("Header");
    console.log(this.props.CHILD_STATUS);
    // this.setState({
    //   CHILD_STATUS: this.state.CHILD_STATUS
    // });
    const USER_INFO = this.props.USER_INFO;
    const EXERCISE_GOAL = this.props.EXERCISE_GOAL;
    const isBackForTab = this.props.isBack;
    const titleForTab = this.props.title;
    const { state, goBack } = this.props.navigation;
    const params = state.params || {};
    return (
      <View flex={1}>
        {isBackForTab ? (
          <View
            flexDirection="row"
            alignItems="center"
            justifyContent="flex-start"
            backgroundColor="#fcfcff"
            borderBottomColor="#e1e1e4"
            borderBottomWidth={1}
            flex={1}
          >
            <TouchableOpacity
              onPress={() => {
                if (this.props.refreshFnc) {
                  this.props.refreshFnc();
                }
                if (state.params && state.params.callBack) {
                  state.params.callBack();
                } else {
                  goBack(params.go_back_key);
                }
              }}
              style={styles.headerFirstIconContainer}
            >
              <MaterialIcons
                name="arrow-back"
                color="#000000"
                size={22}
                borderWidth={0}
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
            {titleForTab ? (
              <Text style={styles.headerSecondText}>{titleForTab}</Text>
            ) : null}
          </View>
        ) : (
          <View
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            backgroundColor="#fcfcff"
            borderBottomColor="#e1e1e4"
            borderBottomWidth={1}
            flex={1}
          >
            <View
              flex={1}
              justifyContent="flex-start"
              alignItems="flex-start"
              style={styles.headerFirstIconContainer}
            >
              <Image style={styles.headerFirstIcon} source={Images.HeaderBmi} />
            </View>
            <View flex={8} style={styles.headerSecondTextContainer}>
              <Text style={styles.headerSecondText}>
                {/* 우리아이가 방금 등원했어요. */}
                {this.props.CHILD_STATUS}
              </Text>
            </View>
            <View flex={1}>
              <View style={styles.headerMenuIconContainer}>
                <TouchableOpacity
                  style={styles.btn2}
                  //underlayColor="rgba(0,0,0,.1)"
                  onPress={this.props.hamburgerBtnClicked}
                >
                  <Image
                    style={styles.headerMenuIcon}
                    source={Images.HeaderMenuBtn}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
