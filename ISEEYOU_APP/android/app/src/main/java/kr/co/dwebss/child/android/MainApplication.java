package kr.co.dwebss.child.android;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.ninty.system.setting.SystemSettingPackage;
import com.sbugert.rnadmob.RNAdMobPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import io.xogus.reactnative.versioncheck.RNVersionCheckPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import org.reactnative.camera.RNCameraPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.oblador.vectoricons.VectorIconsPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage; 

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();
  
  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new SystemSettingPackage(),
            new RNAdMobPackage(),
            new RNSoundPackage(),
            new ReactNativePushNotificationPackage(),
            new RNVersionCheckPackage(),
            new RNGoogleSigninPackage(),
            new FBSDKPackage(mCallbackManager),
            new RNFirebasePackage(),
            new RNCameraPackage(),
            new RNFirebaseAuthPackage(),
            new VectorIconsPackage(),
            new RNFirebaseMessagingPackage(),
          new RNFirebaseNotificationsPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
        FacebookSdk.sdkInitialize(getApplicationContext());
        AppEventsLogger.activateApp(this);
  }
}
