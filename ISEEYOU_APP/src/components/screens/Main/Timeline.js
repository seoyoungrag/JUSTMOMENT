import React, { Component } from "react";
import {
  View,
  ViewPropTypes,
  StyleSheet,
  FlatList,
  Dimensions,
  Text,
  TouchableOpacity,
  Image
} from "react-native";
import PropTypes from "prop-types";

import Icon from "react-native-vector-icons/FontAwesome";
import Images from "@assets/images";

const TIMESIZE = {
  WIDTH: 50,
  HEIGHT: 30
};
const BACKGROUND = ["#3f51b5", "#2196f3", "#03a9f4", "#00bcd4"];
const DEFAULTDOTCOLOR = "white";

export default class Timeline extends Component {
  constructor(props) {
    super(props);

    this._renderItem = this._renderItem.bind(this);
    this._margin = this.props.compactness ? this.props.compactness : 10;
  }

  getItemLayout(data, index) {
    let itemLength =
      this.props.timelineDirection === "row"
        ? this.props.itemWidth
        : this.props.itemHeight;
    return { length: itemLength, offset: itemLength * index, index };
  }

  scrollToIndex(options) {
    this.refs.flatListRef.scrollToIndex(options);
  }

  scrollToEnd(options) {
    this.refs.flatListRef.scrollToEnd(options);
  }

  scrollToOffset(options) {
    this.refs.flatListRef.scrollToOffset(options);
  }

  _renderTime(item, index) {
    var circleSize = item.circleSize ? item.circleSize : this.props.circleSize;
    return (
      <View
        style={[
          styles[this.props.timelineFormat].timeWrapper,
          styles[this.props.timelineDirection].timeContainer,
          this.props.timeContainerStyle,
          { marginBottom: 10 }
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("QRcodeScanner", {
              refreshFnc: this.props.refreshFnc,
              classDailyEventId: item.id,
              targetChildList: item.wholeChidList ? item.wholeChidList : [],
              targetEventCd: item.eventCd,
              destinyNm: item.destinyNm
            });
          }}
          disabled={false}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start"
            }}
          >
            <Text style={[styles.time, this.props.timeStyle]}>{item.time}</Text>
            <Icon
              name="camera-retro"
              size={circleSize - 2}
              color="white"
              style={{ backgroundColor: "transparent" }}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  _renderChild(item, index) {
    let lineWidth = item.lineWidth ? item.lineWidth : this.props.lineWidth;
    let isLast =
      this.props.datasource[this.props.datasource.length - 1] === item;
    let lineColor = item.lineColor ? item.lineColor : this.props.lineColor;

    var opStyle = null;
    switch (this.props.timelineDirection) {
      case "column":
        switch (this.props.timelineFormat) {
          case "time-show-forward":
            opStyle = {
              borderColor: lineColor,
              borderLeftWidth: lineWidth,
              borderRightWidth: 0,
              marginLeft: this._margin,
              paddingLeft: this._margin,
              height: item.itemHeight
                ? item.itemHeight
                : this.props.timelineItemHeight,
              justifyContent: "center",
              alignItems: "center"
            };
            break;
          case "time-show-afterward":
            opStyle = {
              borderColor: lineColor,
              borderLeftWidth: 0,
              borderRightWidth: lineWidth,
              marginRight: this._margin,
              paddingRight: this._margin,
              height: item.itemHeight
                ? item.itemHeight
                : this.props.timelineItemHeight,
              justifyContent: "center",
              alignItems: "center"
            };
            break;
        }
        break;
      case "row":
        switch (this.props.timelineFormat) {
          case "time-show-forward":
            opStyle = {
              borderColor: lineColor,
              // borderTopWidth: lineWidth,
              // borderBottomWidth: 0,
              // marginTop: this._margin,
              // paddingTop: this._margin,
              width: item.itemWidth
                ? item.itemWidth
                : this.props.timelineItemWidth,
              justifyContent: "center",
              alignItems: "center"
              // backgroundColor: "green"
            };
            break;
          case "time-show-afterward":
            opStyle = {
              borderColor: lineColor,
              // borderTopWidth: 0,
              // borderBottomWidth: lineWidth,
              marginBottom: this._margin,
              paddingBottom: this._margin,
              width: item.itemWidth
                ? item.itemWidth
                : this.props.timelineItemWidth,
              justifyContent: "center",
              alignItems: "center"
            };
            break;
        }
        break;
    }

    // _renderSeparator not show in 'row'
    return (
      <View style={[opStyle, { alignItems: "flex-start", paddingLeft: 20 }]}>
        <TouchableOpacity
          wtyle={{ width: "100%" }}
          disabled={this.props.onEventPress == null}
          onPress={() =>
            this.props.onEventPress ? this.props.onEventPress(item) : null
          }
        >
          <View
            style={{
              width: "100%",
              alignItems: "flex-start",
              justifyContent: "flex-start"
            }}
          >
            {this.props.renderChildren(item)}
          </View>
          {this.props.timelineDirection === "column"
            ? isLast
              ? null
              : this._renderSeparator()
            : null}
        </TouchableOpacity>
      </View>
    );
  }

  _renderCircle(item, index) {
    var circleSize = item.circleSize ? item.circleSize : this.props.circleSize;
    var circleColor = item.circleColor
      ? item.circleColor
      : this.props.circleColor;
    var lineWidth = item.lineWidth ? item.lineWidth : this.props.lineWidth;

    var circleStyle = null;
    switch (this.props.timelineDirection) {
      case "column":
        switch (this.props.timelineFormat) {
          case "time-show-forward":
            circleStyle = {
              width: circleSize,
              height: circleSize,
              borderRadius: circleSize / 2,
              backgroundColor: circleColor,
              left:
                TIMESIZE.WIDTH +
                this._margin -
                circleSize / 2 +
                (lineWidth - 1) / 2
            };
            break;
          case "time-show-afterward":
            circleStyle = {
              width: circleSize,
              height: circleSize,
              borderRadius: circleSize / 2,
              backgroundColor: circleColor,
              right:
                TIMESIZE.WIDTH +
                this._margin -
                circleSize / 2 +
                (lineWidth - 1) / 2
            };
            break;
        }
        break;
      case "row":
        switch (this.props.timelineFormat) {
          case "time-show-forward":
            circleStyle = {
              width: circleSize,
              height: circleSize,
              borderRadius: circleSize / 2,
              backgroundColor: circleColor,
              top:
                TIMESIZE.HEIGHT +
                this._margin -
                circleSize / 2 +
                (lineWidth - 1) / 2
            };
            break;
          case "time-show-afterward":
            circleStyle = {
              width: circleSize,
              height: circleSize,
              borderRadius: circleSize / 2,
              backgroundColor: circleColor,
              bottom:
                TIMESIZE.HEIGHT +
                this._margin -
                circleSize / 2 +
                (lineWidth - 1) / 2
            };
            break;
        }
        break;
    }

    var innerCircle = null;
    switch (this.props.innerCircle) {
      case "dot":
        let dotStyle = {
          height: circleSize / 2,
          width: circleSize / 2,
          borderRadius: circleSize / 4,
          backgroundColor: item.dotColor
            ? item.dotColor
            : this.props.dotColor
              ? this.props.dotColor
              : DEFAULTDOTCOLOR
        };
        innerCircle = <View style={[styles.dot, dotStyle]} />;
        break;
      case "icon":
        let iconSource = item.icon ? item.icon : this.props.icon;
        let iconColor = item.iconColor ? item.iconColor : this.props.iconColor;
        innerCircle = (
          <Icon
            name={iconSource}
            size={circleSize - 2}
            color={iconColor}
            style={{ backgroundColor: "transparent" }}
          />
        );
        break;
      case "pic":
        let picSource = item.pic ? item.pic : this.props.pic;
        let picStyle = {
          width: "100%"
        };
        innerCircle = (
          <Image
            source={picSource}
            style={[picStyle, this.props.picStyle]}
            resizeMode="center"
          />
        );
        break;
    }
    return (
      <View
        style={[
          styles.circle,
          circleStyle,
          this.props.circleStyle,
          { width: "50%", height: 100 }
        ]}
      >
        {innerCircle}
      </View>
    );
  }

  _renderSeparator() {
    if (this.props.showSeparator)
      return (
        <View
          style={[
            styles[this.props.timelineDirection].separator,
            this.props.separatorStyle
          ]}
        />
      );
    else return null;
  }

  _renderItem(item, index) {
    var circleStyle = null;
    switch (this.props.timelineFormat) {
      case "time-show-forward":
        content = (
          <View
            style={[
              styles[this.props.timelineDirection].rowContainer,
              {
                justifyContent: "flex-start",
                backgroundColor: BACKGROUND[index % BACKGROUND.length],
                borderColor: "white",
                borderWidth: 1,
                paddingTop: 15,
                paddingBottom: 20,
                minHeight: 200
                // borderRadius: 10,
              },
              this.props.rowContainerStyle
            ]}
          >
            {this._renderTime(item, index)}
            {/* {this._renderCircle(item, index)} */}
            <Image
              source={Images.babyIcon}
              resizeMode="center"
              style={{
                width: "100%",
                height: "100%",
                opacity: 0.1,
                position: "absolute",
                bottom: 0,
                borderColor: undefined,
                width: 150,
                justifyContent: "center",
                alignItems: "center"
              }}
            />
            {this._renderChild(item, index)}
          </View>
        );
        break;
      case "time-show-afterward":
        content = (
          <View
            style={[
              styles[this.props.timelineDirection].rowContainer,
              {
                justifyContent: "flex-end",
                backgroundColor: BACKGROUND[index % BACKGROUND.length],
                borderColor: "white",
                borderWidth: 1,
                paddingTop: 15,
                paddingBottom: 20
              }
              // this.props.rowContainerStyle
            ]}
          >
            {this._renderChild(item, index)}
            {this._renderTime(item, index)}
            {this._renderCircle(item, index)}
          </View>
        );
        break;
    }
    return content;
  }

  render() {
    const { datasource } = this.props;
    return (
      <View style={[styles.container, this.props.timelineStyle]}>
        <FlatList
          ref="flatListRef"
          style={[styles.flatlist]}
          data={datasource}
          horizontal={this.props.timelineDirection !== "row" ? false : true}
          renderItem={({ item, index }) => this._renderItem(item, index)}
          keyExtractor={item => item.time}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }
}

Timeline.defaultProps = {
  // timelineDirection: 'column',
  // timelineFormat: 'time-show-forward',
  // compactness: 20,
  // timelineItemHeight: 50,
  timelineDirection: "row",
  timelineFormat: "time-show-forward",
  compactness: 10,
  timelineItemWidth: 150,
  circleSize: 18,
  circleColor: "#007AFF",
  lineWidth: 1,
  showSeparator: false,
  innerCircle: "dot",
  icon: "hand-stop-o",
  iconColor: "black",
  datasource: [
    { time: "1:44", title: "Event 1" },
    { time: "10:45", title: "Event 2" },
    { time: "12:00", title: "Event 3" },
    { time: "14:00", title: "Event 4" },
    { time: "16:30", title: "Event 5" }
  ]
};

Timeline.propTypes = {
  datasource: PropTypes.array,
  timelineStyle: ViewPropTypes.style,
  timelineDirection: PropTypes.oneOf(["row", "column"]),
  timelineFormat: PropTypes.oneOf(["time-show-forward", "time-show-afterward"]),
  rowContainerStyle: ViewPropTypes.style,
  timeContainerStyle: ViewPropTypes.style,
  timeStyle: ViewPropTypes.style,
  circleSize: PropTypes.number,
  circleColor: PropTypes.string,
  lineWidth: PropTypes.number,
  innerCircle: PropTypes.string,
  showSeparator: PropTypes.bool,
  renderChildren: PropTypes.func,
  lineWidth: PropTypes.number,
  onEventPress: PropTypes.func,
  compactness: PropTypes.number,
  timelineItemWidth: PropTypes.number,
  timelineItemHeight: PropTypes.number
};

const styles = {
  column: StyleSheet.create({
    rowContainer: {
      // flex: 1,
      flexDirection: "row",
      alignItems: "center"
    },
    timeContainer: {
      // minWidth: TIMEWIDTH,
      width: TIMESIZE.WIDTH
    },
    separator: {
      height: 1,
      backgroundColor: "#aaa",
      marginTop: 10,
      marginBottom: 10
    }
  }),
  row: StyleSheet.create({
    rowContainer: {
      // flex: 1,
      flexDirection: "column",
      alignItems: "center"
    },
    timeContainer: {
      // minWidth: TIMEWIDTH,
      height: TIMESIZE.HEIGHT
    },
    separator: {
      width: 1,
      backgroundColor: "#aaa",
      marginLeft: 1,
      marginRight: 1
    }
  }),

  "time-show-forward": StyleSheet.create({
    timeWrapper: {
      alignItems: "flex-end"
    }
  }),
  "time-show-afterward": StyleSheet.create({
    timeWrapper: {
      alignItems: "flex-start"
    }
  }),

  container: {
    alignItems: "center",
    justifyContent: "center"
  },
  flatlist: {
    minHeight: 100,
    minWidth: 100
  },
  time: {
    textAlign: "center",
    // backgroundColor: "#ff9797",
    color: "white",
    padding: 5,
    borderRadius: 13,
    overflow: "hidden",
    minWidth: 46.5,
    fontSize: 16,
    fontFamily: "NotoSans-Regular"
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 10,
    // position: "absolute",
    alignItems: "center",
    justifyContent: "center"
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "white"
  }
};
