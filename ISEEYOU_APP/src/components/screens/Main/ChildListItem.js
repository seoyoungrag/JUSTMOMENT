import React, { Component } from "react";

import {
  AppRegistry,
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  Button,
  ImageBackground
} from "react-native";

import Images from "@assets/images";
import Timeline from "./Timeline";
import Icon from "react-native-vector-icons/Entypo";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { connect } from "react-redux";
import ActionCreator from "@redux-yrseo/actions";
import Moment from "moment";

const { width, height } = Dimensions.get("window");
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
function Unix_timestamp(t) {
  // var dt = new Date(0);
  // dt.setUTCSeconds(t);
  // var hr = "0" + dt.getHours();
  // var m = "0" + dt.getMinutes();
  // var s = "0" + dt.getSeconds();
  // console.log(t, hr.substr(-2) + ":" + m.substr(-2) + ":" + s.substr(-2));
  // return hr.substr(-2) + ":" + m.substr(-2) + ":" + s.substr(-2);
  return Moment(t)
    .subtract(9, "hours")
    .format("HH:mm");
}
function getTime(date) {
  var match = date.match(/^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/);
  var dt = new Date(
    match[1],
    match[2] - 1,
    match[3],
    match[4],
    match[5],
    match[6]
  );
  var hr = "0" + dt.getHours();
  var m = "0" + dt.getMinutes();
  var s = "0" + dt.getSeconds();
  return hr.substr(-2) + ":" + m.substr(-2) + ":" + s.substr(-2);
}
class ChildListItem extends Component {
  constructor(props) {
    super(props);
    this._renderChildren = this._renderChildren.bind(this);
  }
  _renderChildren(data) {
    // data.title.map(obj => {
    //   if (obj.eventCheckDt) {
    //     console.log(obj);
    //   }
    // });
    childEventList = data.title
      ? data.title.map(obj => (
          <View
            key={data.key + obj.childId + obj.eventCheckDt}
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            {/* {obj.eventCheckDt ? ( */}
            <Image
              source={Images.babyIcon}
              style={{ height: 10, width: 10 }}
              // resizeMode="center"
            />
            {/* ) : null} */}

            {/* {obj.eventCheckDt ? ( */}
            <Text
              style={{
                color: "white",
                fontFamily: "NotoSans-Regular",
                fontSize: 14
              }}
            >
              {obj.childNm}
              {obj.eventCheckDt
                ? "(" + Unix_timestamp(obj.eventCheckDt) + ")"
                : ""}
            </Text>
            {/* ) : null} */}
          </View>
        ))
      : null;
    return <View>{childEventList}</View>;
  }
  render() {
    const dataList = [];
    const wholeChidList = this.props.wholeChildList
      ? this.props.wholeChildList
      : [];
    this.props.data.classDailyEvent.forEach(data => {
      let eventNm = this.props.CODE.find(elem => {
        return elem.code == data.eventCd;
      }).codeNm;
      dataList.push({
        key:
          this.props.index +
          data.classDailyEventId +
          data.destinyNm +
          data.eventCd, //네이티브 FlatList API에서 key값을 필요로함(유니크)
        id: data.classDailyEventId, //클래스일일이벤트id
        title: data.eventCheck, //아이들
        time: eventNm
          ? data.destinyNm + " " + eventNm
          : data.destinyNm + " " + data.eventCd, //제목
        eventCd: data.eventCd,
        destinyNm: data.destinyNm,
        wholeChidList: wholeChidList //아이들
      });
    });
    return (
      <View
        style={{
          // borderWidth: 1, borderColor: "#aaaaaa",
          backgroundColor: "#fcfcff",
          padding: 10,
          paddingBottom: 30
        }}
      >
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <Text style={styles.text}>{this.props.data.classNm}</Text>
          </View>
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <Text
              style={[
                styles.text,
                {
                  fontSize: 14,
                  color: "#555555",
                  paddingRight: width / 15,
                  textAlign: "right"
                }
              ]}
            >
              {this.props.data.teacherNm} 선생님
            </Text>
          </View>
        </View>
        <Text>
          {/* <Icon
            name="phone"
            size={12}
            color="black"
            style={{ backgroundColor: "transparent" }}
          /> */}
        </Text>
        <Timeline
          refreshFnc={this.props.refreshFnc}
          navigation={this.props.navigation}
          // innerCircle="pic"
          // pic={Images.babyIcon}
          ref="timeLine"
          // picStyle={{ backgroundColor: "transparent" }}
          // circleStyle={{ backgroundColor: "transparent" }}
          // timelineFormat="time-show-afterward"
          renderChildren={this._renderChildren}
          // { time: "1:44", title: "Event 1" },
          datasource={dataList}
        />
        {/* <Button
          onPress={() => {
            this.refs.TestFather.scrollToIndex({ animated: true, index: 3 });
          }}
          title="맨뒤로"
        /> */}
      </View>
    );
  }
}

let styles = {
  text: {
    paddingLeft: width / 20,
    fontSize: 20,
    color: "black",
    fontFamily: "NotoSans-Regular"
  },
  todayListItemContainer: {
    marginLeft: width / 20,
    flex: 1
  },
  todayListItemIcon: {
    flex: 3,
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: width / 20
  },
  todayListItemMainText: {
    fontFamily: "NotoSans-Regular",
    fontWeight: "600",
    fontSize: 18
  },
  todayListItemSubText: {
    fontFamily: "NotoSans-Regular",
    fontSize: 12
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChildListItem);
