import { AppRegistry } from "react-native";
import App from "./App";
import { YellowBox } from "react-native";
import bgMessaging from "./src/bgMessaging";

YellowBox.ignoreWarnings([
  "Warning: isMounted(...) is deprecated",
  "Module RCTImageLoader",
  "Warning: Can't call setState",
  'Warning: Each child in an array or iterator should have a unique "key" prop',
  "Remote debugger is in a background tab which may cause apps to perform slowly.",
  "Warning: Encountered two children with the same key,"
]);
AppRegistry.registerComponent("App", () => App);
// 백그라운드 메세지 처리(data로 보내야 한다.)
AppRegistry.registerHeadlessTask(
  "RNFirebaseBackgroundMessage",
  () => bgMessaging
);
