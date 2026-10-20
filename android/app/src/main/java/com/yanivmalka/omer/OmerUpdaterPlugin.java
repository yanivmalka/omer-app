package com.yanivmalka.omer;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;

import androidx.core.content.FileProvider;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * In-app updater: reports the installed version, downloads a new APK (HttpURLConnection)
 * and opens the system installer. The user confirms the install in Android's own dialog.
 */
@CapacitorPlugin(name = "OmerUpdater")
public class OmerUpdaterPlugin extends Plugin {
    private static final String FILE_NAME = "omer-app-update.apk";
    private final Handler main = new Handler(Looper.getMainLooper());

    @PluginMethod
    public void getVersion(PluginCall call) {
        try {
            Context ctx = getContext();
            PackageInfo pi = ctx.getPackageManager().getPackageInfo(ctx.getPackageName(), 0);
            JSObject r = new JSObject();
            r.put("versionName", pi.versionName);
            r.put("versionCode", Build.VERSION.SDK_INT >= 28 ? pi.getLongVersionCode() : pi.versionCode);
            call.resolve(r);
        } catch (Exception e) {
            call.reject("version unavailable", e);
        }
    }

    /** Opens a URL in the system browser (fallback when the in-app download fails). */
    @PluginMethod
    public void openUrl(PluginCall call) {
        String url = call.getString("url");
        if (url == null || !url.startsWith("https://")) { call.reject("bad url"); return; }
        try {
            Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(i);
            call.resolve();
        } catch (Exception e) {
            call.reject("open failed: " + e.getMessage(), e);
        }
    }

    /**
     * Downloads the APK from {url} on a background thread (plain HTTPS, follows GitHub's redirect to its CDN)
     * into the app cache, then opens the system installer. Progress is reported via the "progress" event.
     */
    @PluginMethod
    public void downloadAndInstall(final PluginCall call) {
        final String url = call.getString("url");
        if (url == null || !url.startsWith("https://")) {
            call.reject("bad url");
            return;
        }
        final Context ctx = getContext();
        // Android 8+: the user must allow this app to install packages (one-time switch in system settings).
        if (Build.VERSION.SDK_INT >= 26 && !ctx.getPackageManager().canRequestPackageInstalls()) {
            Intent s = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, Uri.parse("package:" + ctx.getPackageName()));
            s.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            ctx.startActivity(s);
            call.reject("NEED_PERMISSION");
            return;
        }
        new Thread(() -> {
            HttpURLConnection con = null;
            try {
                File dir = new File(ctx.getCacheDir(), "updates");
                if (!dir.exists() && !dir.mkdirs()) throw new Exception("cannot create cache dir");
                final File file = new File(dir, FILE_NAME);
                if (file.exists()) file.delete();

                String target = url;
                int code = 0;
                for (int hop = 0; hop < 6; hop++) { // follow redirects manually (GitHub -> CDN)
                    con = (HttpURLConnection) new URL(target).openConnection();
                    con.setInstanceFollowRedirects(false);
                    con.setConnectTimeout(20000);
                    con.setReadTimeout(30000);
                    con.setRequestProperty("Accept", "application/octet-stream");
                    con.setRequestProperty("User-Agent", "omer-app-updater");
                    code = con.getResponseCode();
                    if (code >= 300 && code < 400) {
                        String loc = con.getHeaderField("Location");
                        con.disconnect();
                        if (loc == null) throw new Exception("redirect without location");
                        target = new URL(new URL(target), loc).toString();
                        continue;
                    }
                    break;
                }
                if (code != 200) throw new Exception("HTTP " + code);

                long total = con.getContentLengthLong();
                long done = 0;
                int lastPct = -1;
                try (InputStream in = con.getInputStream(); FileOutputStream out = new FileOutputStream(file)) {
                    byte[] buf = new byte[64 * 1024];
                    int n;
                    while ((n = in.read(buf)) > 0) {
                        out.write(buf, 0, n);
                        done += n;
                        int pct = total > 0 ? (int) (done * 100 / total) : 0;
                        if (pct != lastPct) {
                            lastPct = pct;
                            JSObject p = new JSObject();
                            p.put("percent", pct);
                            notifyListeners("progress", p);
                        }
                    }
                }
                if (total > 0 && done != total) throw new Exception("incomplete download " + done + "/" + total);
                main.post(() -> {
                    try {
                        install(file);
                        call.resolve();
                    } catch (Exception e) {
                        call.reject("install failed: " + e.getMessage(), e);
                    }
                });
            } catch (Exception e) {
                call.reject("download failed: " + e.getMessage(), e);
            } finally {
                if (con != null) con.disconnect();
            }
        }).start();
    }

    private void install(File file) {
        Context ctx = getContext();
        Uri uri = FileProvider.getUriForFile(ctx, ctx.getPackageName() + ".fileprovider", file);
        Intent i = new Intent(Intent.ACTION_VIEW);
        i.setDataAndType(uri, "application/vnd.android.package-archive");
        i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
        ctx.startActivity(i);
    }
}
