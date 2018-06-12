package com.diabetesninjaapp;

import android.content.Context;
import android.graphics.PorterDuff;
import android.support.v4.content.ContextCompat;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.LinearLayout;
import android.graphics.Color;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.view.Gravity;
import android.util.TypedValue;

import com.facebook.react.ReactActivity;
import com.github.droibit.android.reactnative.customtabs.CustomTabsPackage;
import com.reactnativenavigation.controllers.SplashActivity;
public class MainActivity extends SplashActivity  {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    
    @Override
    public LinearLayout createSplashLayout() {

        LayoutInflater inflater = (LayoutInflater)getApplicationContext().getSystemService
        (Context.LAYOUT_INFLATER_SERVICE);

        View view = inflater.inflate(R.layout.splashlayout,null);
        LinearLayout splash = (LinearLayout) view.findViewById(R.id.splash);

        ProgressBar progress = (ProgressBar) view.findViewById(R.id.progressBar2);
        progress.getIndeterminateDrawable()
                .setColorFilter(ContextCompat.getColor(this, R.color.accent), PorterDuff.Mode.SRC_IN );



        return splash;
    }
}
