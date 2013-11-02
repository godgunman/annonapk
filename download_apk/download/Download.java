import com.gc.android.market.api.MarketSession;
import com.gc.android.market.api.model.Market.AppsRequest;
import com.gc.android.market.api.model.Market.AppsResponse;
import com.gc.android.market.api.model.Market.ResponseContext;
import com.gc.android.market.api.MarketSession.Callback;
import com.gc.android.market.api.model.Market.GetAssetResponse.*;
import java.io.*;
import java.net.*;

public class Download {

    public static void main(String[] argv){
        try {
            String email = "";
            String password = "";
            String myAndroidId = "";
            String assetId;
            String pkgname;

            if (argv.length < 2) {
                System.out.println("Please specify app id and package name.");
            }
            assetId = argv[0];
            pkgname = argv[1];

            MarketSession session = new MarketSession(true);
            session.login(email,password, myAndroidId);

            InstallAsset ia = session.queryGetAssetRequest(assetId).getInstallAsset(0);
            String cookieName = ia.getDownloadAuthCookieName();
            String cookieValue = ia.getDownloadAuthCookieValue();

            URL url = new URL(ia.getBlobUrl());

            HttpURLConnection conn = (HttpURLConnection)url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("User-Agent", "Android-Market/2 (sapphire PLAT-RC33); gzip");
            conn.setRequestProperty("Cookie", cookieName + "=" + cookieValue);

            InputStream inputstream =  (InputStream) conn.getInputStream();
            String fileToSave = pkgname + ".apk";
            System.out.println("Downloading " + fileToSave);
            BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(fileToSave));
            byte buf[] = new byte[1024];
            int k = 0;
            for(long l = 0L; (k = inputstream.read(buf)) != -1; l += k )
                stream.write(buf, 0, k);
            inputstream.close();
            stream.close();
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }
}
