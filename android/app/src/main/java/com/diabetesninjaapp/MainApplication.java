package com.diabetesninjaapp;

import android.app.Activity;
import android.app.Application;
import android.os.Bundle;
import android.view.WindowManager;

import com.reactnativenavigation.NavigationApplication;
import com.facebook.react.ReactApplication;
import com.github.droibit.android.reactnative.customtabs.CustomTabsPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.horcrux.svg.SvgPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;



import com.wix.reactnativenotifications.RNNotificationsPackage;
import com.wix.reactnativenotifications.core.AppLaunchHelper;
import com.wix.reactnativenotifications.core.AppLifecycleFacade;
import com.wix.reactnativenotifications.core.JsIOHelper;
import com.wix.reactnativenotifications.core.notification.INotificationsApplication;

import android.content.Context;
import android.os.Bundle;


public class MainApplication extends NavigationApplication implements INotificationsApplication {

    private NotificationsLifecycleFacade notificationsLifecycleFacade;

       @Override
       public boolean isDebug() {
           // Make sure you are using BuildConfig from your own application
           return BuildConfig.DEBUG;
       }

    @Override
    public com.wix.reactnativenotifications.core.notification.IPushNotification getPushNotification(Context context, Bundle bundle, AppLifecycleFacade defaultFacade, AppLaunchHelper defaultAppLaunchHelper) {
        return new CustomPushNotification(
                context,
                bundle,
                notificationsLifecycleFacade, // Instead of defaultFacade!!!
                defaultAppLaunchHelper,
                new JsIOHelper()
        );
    }

       protected List<ReactPackage> getPackages() {
           // Add additional packages you require here
           // No need to add RnnPackage and MainReactPackage
           return Arrays.<ReactPackage>asList(
            
            new LinearGradientPackage(),
            new SvgPackage(),
            new RNNotificationsPackage(MainApplication.this),
            new CustomTabsPackage()

           );
       }

    @Override
    public void onCreate() {

        super.onCreate();

         registerActivityLifecycleCallbacks(new ActivityLifecycleCallbacks() {
            @Override
            public void onActivityCreated(Activity activity, Bundle savedInstanceState) {
                activity.getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
            }

            @Override
            public void onActivityStarted(Activity activity) {

            }

            @Override
            public void onActivityResumed(Activity activity) {

            }

            @Override
            public void onActivityPaused(Activity activity) {

            }

            @Override
            public void onActivityStopped(Activity activity) {

            }

            @Override
            public void onActivitySaveInstanceState(Activity activity, Bundle outState) {

            }

            @Override
            public void onActivityDestroyed(Activity activity) {

            }
        });

        // Create an object of the custom facade impl
        notificationsLifecycleFacade = new NotificationsLifecycleFacade();
        // Attach it to react-native-navigation
        setActivityCallbacks(notificationsLifecycleFacade);


    }
  
       @Override
       public List<ReactPackage> createAdditionalReactPackages() {
           return getPackages();
       }
   }