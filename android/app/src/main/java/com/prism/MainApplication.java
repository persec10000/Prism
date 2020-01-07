package com.prism;

import android.app.Application;

import com.BV.LinearGradient.LinearGradientPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.rnfs.RNFSPackage;
import ui.bottomactionsheet.RNBottomActionSheetPackage;
import com.github.yamill.orientation.OrientationPackage;
import org.wonday.pdf.RCTPdfView;
import com.RNFetchBlob.RNFetchBlobPackage;
// import com.keyee.pdfview.PDFView;
import com.zmxv.RNSound.RNSoundPackage;
import org.pgsqlite.SQLitePluginPackage;
import com.facebook.react.ReactApplication;
import io.github.elyx0.reactnativedocumentpicker.DocumentPickerPackage;
import com.bugsnag.BugsnagReactNative;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new DocumentPickerPackage(),
           new RNFSPackage(),
            new ReactVideoPackage(),
            new RNBottomActionSheetPackage(),
            new OrientationPackage(),
            new RCTPdfView(),
            new RNFetchBlobPackage(),
            // new PDFView(),
            new SQLitePluginPackage(),
            BugsnagReactNative.getPackage(),
            new RNSoundPackage(),
              new LinearGradientPackage()
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
    BugsnagReactNative.start(this);
    SoLoader.init(this, /* native exopackage */ false);
  }

 
}
