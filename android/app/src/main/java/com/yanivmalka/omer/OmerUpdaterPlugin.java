package com.yanivmalka.omer;

import android.app.DownloadManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.database.Cursor;
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

/**
 * In-app updater: reports the installed version, downloads a new APK (DownloadManager)
 * and opens the system installer. The user confirms the install in Android's own dialog.
 */
@CapacitorPlugin(name = "OmerUpdater")
public class OmerUpdaterPlugin extends Plugin {
    private static final String FILE_NAME = "omer-app-update.apk";
    private final Handler main = new Handler(Looper.getMainLooper());
    private long downloadId = -1;

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

    /** Downloads the APK from {url} and opens the installer when done. */
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
        try {
            File dir = ctx.getExternalFilesDir(android.os.Environment.DIRECTORY_DOWNLOADS);
            if (dir == null) dir = ctx.getFilesDir();
            final File file = new File(dir, FILE_NAME);
            if (file.exists()) file.delete();

            final DownloadManager dm = (DownloadManager) ctx.getSystemService(Context.DOWNLOAD_SERVICE);
            DownloadManager.Request req = new DownloadManager.Request(Uri.parse(url));
            req.setTitle("ספירת העומר — עדכון");
            req.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE);
            req.setDestinationUri(Uri.fromFile(file));
            req.setMimeType("application/vnd.android.package-archive");
            downloadId = dm.enqueue(req);
            final long id = downloadId;

            final Runnable poll = new Runnable() {
                @Override
                public void run() {
                    DownloadManager.Query q = new DownloadManager.Query().setFilterById(id);
                    try (Cursor c = dm.query(q)) {
                        if (c == null || !c.moveToFirst()) { call.reject("download lost"); return; }
                        int status = c.getInt(c.getColumnIndexOrThrow(DownloadManager.COLUMN_STATUS));
                        long done = c.getLong(c.getColumnIndexOrThrow(DownloadManager.COLUMN_BYTES_DOWNLOADED_SO_FAR));
                        long total = c.getLong(c.getColumnIndexOrThrow(DownloadManager.COLUMN_TOTAL_SIZE_BYTES));
                        if (status == DownloadManager.STATUS_SUCCESSFUL) {
                            JSObject p = new JSObject(); p.put("percent", 100); notifyListeners("progress", p);
                            install(file);
                            call.resolve();
                            return;
                        }
                        if (status == DownloadManager.STATUS_FAILED) {
                            call.reject("download failed");
                            return;
                        }
                        JSObject p = new JSObject();
                        p.put("percent", total > 0 ? (int) (done * 100 / total) : 0);
                        notifyListeners("progress", p);
                    }
                    main.postDelayed(this, 400);
                }
            };
            main.post(poll);
        } catch (Exception e) {
            call.reject("download error: " + e.getMessage(), e);
        }
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
