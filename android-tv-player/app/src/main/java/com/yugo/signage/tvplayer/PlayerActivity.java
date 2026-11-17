package com.yugo.signage.tvplayer;

import android.app.Activity;
import android.graphics.Color;
import android.media.AudioManager;
import android.net.Uri;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.webkit.RenderProcessGoneDetail;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.webkit.WebMessageCompat;
import androidx.webkit.WebViewCompat;
import androidx.webkit.WebViewFeature;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Collections;

/** A small Android TV host for the existing DigitalSignage web player. */
public final class PlayerActivity extends Activity {
    private static final String PREFERENCES = "player";
    private static final String URL_KEY = "player_url";

    private FrameLayout root;
    private WebView webView;
    private View statusView;
    private String playerUrl;
    private boolean showingSetup;
    private boolean loadFailed;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        hideSystemUi();

        root = new FrameLayout(this);
        root.setBackgroundColor(Color.BLACK);
        setContentView(root);

        playerUrl = getSharedPreferences(PREFERENCES, MODE_PRIVATE).getString(URL_KEY, null);
        if (playerUrl == null) {
            showSetup(null);
        } else {
            showPlayer();
        }
    }

    private void hideSystemUi() {
        getWindow().getDecorView().setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_FULLSCREEN
                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
        );
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    private LinearLayout panel() {
        LinearLayout panel = new LinearLayout(this);
        panel.setOrientation(LinearLayout.VERTICAL);
        panel.setPadding(dp(32), dp(28), dp(32), dp(28));
        panel.setBackgroundColor(Color.rgb(17, 27, 43));
        FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(
            dp(680), ViewGroup.LayoutParams.WRAP_CONTENT, Gravity.CENTER
        );
        root.addView(panel, params);
        return panel;
    }

    private TextView text(String value, int size, int color) {
        TextView text = new TextView(this);
        text.setText(value);
        text.setTextSize(size);
        text.setTextColor(color);
        return text;
    }

    private Button button(String label, View.OnClickListener listener) {
        Button button = new Button(this);
        button.setText(label);
        button.setOnClickListener(listener);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT
        );
        params.topMargin = dp(12);
        button.setLayoutParams(params);
        return button;
    }

    private void destroyWebView() {
        if (webView != null) {
            root.removeView(webView);
            webView.stopLoading();
            webView.destroy();
            webView = null;
        }
    }

    private void showSetup(String validationError) {
        showingSetup = true;
        destroyWebView();
        root.removeAllViews();

        LinearLayout panel = panel();
        panel.addView(text(getString(R.string.setup_title), 30, Color.WHITE));

        TextView description = text(getString(R.string.setup_description), 17, Color.LTGRAY);
        LinearLayout.LayoutParams descriptionParams = new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT
        );
        descriptionParams.topMargin = dp(14);
        panel.addView(description, descriptionParams);

        EditText input = new EditText(this);
        input.setSingleLine(true);
        input.setInputType(android.text.InputType.TYPE_CLASS_TEXT | android.text.InputType.TYPE_TEXT_VARIATION_URI);
        input.setHint(R.string.setup_hint);
        input.setText(playerUrl);
        input.setSelectAllOnFocus(true);
        LinearLayout.LayoutParams inputParams = new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT
        );
        inputParams.topMargin = dp(18);
        panel.addView(input, inputParams);

        if (validationError != null) {
            panel.addView(text(validationError, 16, Color.rgb(255, 172, 122)));
        }

        panel.addView(button(getString(R.string.save_and_open), view -> {
            String normalized = normalizeUrl(input.getText().toString());
            if (normalized == null) {
                input.setError(getString(R.string.invalid_url));
                return;
            }
            playerUrl = normalized;
            getSharedPreferences(PREFERENCES, MODE_PRIVATE).edit().putString(URL_KEY, normalized).apply();
            showPlayer();
        }));

        if (playerUrl != null) {
            panel.addView(button(getString(R.string.resume), view -> showPlayer()));
        }
    }

    private String normalizeUrl(String value) {
        try {
            Uri uri = Uri.parse(value.trim());
            if (!"https".equalsIgnoreCase(uri.getScheme()) || uri.getHost() == null
                || uri.getHost().isEmpty() || uri.getUserInfo() != null) {
                return null;
            }
            return uri.buildUpon().path("/").clearQuery().fragment(null).build().toString();
        } catch (RuntimeException ignored) {
            return null;
        }
    }

    private boolean isPlayerPage(Uri uri) {
        Uri allowed = Uri.parse(playerUrl);
        String path = uri.getPath();
        return "https".equalsIgnoreCase(uri.getScheme())
            && allowed.getHost().equalsIgnoreCase(uri.getHost())
            && allowed.getPort() == uri.getPort()
            && ("/".equals(path) || "/player".equals(path));
    }

    private void installNativeBridge(WebView view) {
        if (!WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)) return;
        Uri allowed = Uri.parse(playerUrl);
        String origin = "https://" + allowed.getAuthority();
        WebViewCompat.addWebMessageListener(view, "YugoNative", Collections.singleton(origin),
            (sender, message, sourceOrigin, isMainFrame, replyProxy) -> {
                if (!isMainFrame || !"https".equalsIgnoreCase(sourceOrigin.getScheme())
                    || !allowed.getHost().equalsIgnoreCase(sourceOrigin.getHost())
                    || allowed.getPort() != sourceOrigin.getPort()
                    || sender.getUrl() == null || !isPlayerPage(Uri.parse(sender.getUrl()))
                    || message.getType() != WebMessageCompat.TYPE_STRING) return;

                String id = "";
                String status = "failed";
                try {
                    JSONObject command = new JSONObject(message.getData());
                    id = command.optString("id", "");
                    String kind = command.optString("kind", "");
                    if (id.length() > 0 && id.length() <= 100) {
                        AudioManager audio = (AudioManager) getSystemService(AUDIO_SERVICE);
                        if (audio == null || audio.isVolumeFixed()) {
                            status = "unsupported";
                        } else {
                            int direction;
                            switch (kind) {
                                case "volume_up": direction = AudioManager.ADJUST_RAISE; break;
                                case "volume_down": direction = AudioManager.ADJUST_LOWER; break;
                                case "mute": direction = AudioManager.ADJUST_TOGGLE_MUTE; break;
                                default: direction = AudioManager.ADJUST_SAME; status = "unsupported";
                            }
                            if (!"unsupported".equals(status)) {
                                audio.adjustStreamVolume(AudioManager.STREAM_MUSIC, direction, AudioManager.FLAG_SHOW_UI);
                                status = "applied";
                            }
                        }
                    }
                } catch (JSONException | SecurityException exception) {
                    status = "failed";
                }

                try {
                    replyProxy.postMessage(new JSONObject().put("id", id).put("status", status).toString());
                } catch (JSONException ignored) {
                    // JSONObject serialization should not fail for these strings.
                }
            });
    }

    private void showPlayer() {
        if (playerUrl == null) {
            showSetup(null);
            return;
        }
        showingSetup = false;
        loadFailed = false;
        destroyWebView();
        root.removeAllViews();

        webView = new WebView(this);
        webView.setBackgroundColor(Color.BLACK);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        installNativeBridge(webView);
        webView.setWebChromeClient(new WebChromeClient());
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return request.isForMainFrame() && !isPlayerPage(request.getUrl());
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame()) {
                    loadFailed = true;
                    showLoadError();
                }
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                if (!loadFailed && statusView != null) {
                    root.removeView(statusView);
                    statusView = null;
                }
            }

            @Override
            public boolean onRenderProcessGone(WebView view, RenderProcessGoneDetail detail) {
                loadFailed = true;
                destroyWebView();
                showLoadError();
                return true;
            }
        });

        root.addView(webView, new FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT
        ));
        statusView = text(getString(R.string.loading), 20, Color.WHITE);
        FrameLayout.LayoutParams loadingParams = new FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT, Gravity.CENTER
        );
        root.addView(statusView, loadingParams);
        webView.loadUrl(playerUrl);
    }

    private void showLoadError() {
        if (statusView != null) {
            root.removeView(statusView);
            statusView = null;
        }
        LinearLayout errorPanel = panel();
        errorPanel.addView(text(getString(R.string.load_error), 19, Color.WHITE));
        errorPanel.addView(button(getString(R.string.retry), view -> showPlayer()));
        errorPanel.addView(button(getString(R.string.settings), view -> showSetup(null)));
        statusView = errorPanel;
    }

    @Override
    public void onBackPressed() {
        if (showingSetup) {
            if (playerUrl != null) showPlayer();
        } else {
            showSetup(null);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (webView != null) webView.onResume();
        hideSystemUi();
    }

    @Override
    protected void onPause() {
        if (webView != null) webView.onPause();
        super.onPause();
    }

    @Override
    protected void onDestroy() {
        destroyWebView();
        super.onDestroy();
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) hideSystemUi();
    }
}
