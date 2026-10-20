package com.yanivmalka.omer;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(OmerUpdaterPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
