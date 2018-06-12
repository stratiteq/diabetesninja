package com.diabetesninjaapp;

import com.wix.reactnativenotifications.RNNotificationsPackage;

import com.wix.reactnativenotifications.core.AppLaunchHelper;
import com.wix.reactnativenotifications.core.AppLifecycleFacade;
import com.wix.reactnativenotifications.core.JsIOHelper;
import android.content.Context;
import android.os.Bundle;

/**
 * Created by pmannerhult on 2018-01-17.
 */

public class CustomPushNotification extends com.wix.reactnativenotifications.core.notification.PushNotification {

    public CustomPushNotification(Context context, Bundle bundle, AppLifecycleFacade appLifecycleFacade, AppLaunchHelper appLaunchHelper, JsIOHelper jsIoHelper) {
        super(context, bundle, appLifecycleFacade, appLaunchHelper, jsIoHelper);
    }
}