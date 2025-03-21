import dotenv from 'dotenv';
dotenv.config();

import {
    makeWASocket,
    Browsers,
    fetchLatestBaileysVersion,
    DisconnectReason,
    useMultiFileAuthState,
} from '@whiskeysockets/baileys';
import { Handler, Callupdate, GroupUpdate } from './data/index.js';
import express from 'express';
import pino from 'pino';
import fs from 'fs';
import { File } from 'megajs';
import NodeCache from 'node-cache';
import path from 'path';
import chalk from 'chalk';
import moment from 'moment-timezone';
import axios from 'axios';
import config from './config.cjs';
import pkg from './lib/autoreact.cjs';

const { emojis, doReact } = pkg;
const prefix = process.env.PREFIX || config.PREFIX;
const sessionName = "session";
const app = express();
const orange = chalk.bold.hex("#FFA500");
const lime = chalk.bold.hex("#32CD32");
let useQR = false;
let initialConnection = true;
const PORT = process.env.PORT || 3000;

const MAIN_LOGGER = pino({
    timestamp: () => `"time":"${new Date().toJSON()}"`
});
const logger = MAIN_LOGGER.child({});
logger.level = "trace";

const msgRetryCounterCache = new NodeCache();

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const sessionDir = path.join(__dirname, 'session');
const credsPath = path.join(sessionDir, 'creds.json');

if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
}

async function downloadSessionData() {
    console.log("Debugging SESSION_ID:", config.SESSION_ID);

    if (!config.SESSION_ID) {
        console.error('❌ Please add your session to SESSION_ID env !!');
        return false;
    }

    const sessdata = config.SESSION_ID.split("DRACULA~")[1];

    if (!sessdata || !sessdata.includes("#")) {
        console.error('Invalid SESSION_ID format! It must contain both file ID and decryption key.');
        return false;
    }

    const [fileID, decryptKey] = sessdata.split("#");

    try {
        console.log("Downloading Session...");
        const file = File.fromURL(`https://mega.nz/file/${fileID}#${decryptKey}`);

        const data = await new Promise((resolve, reject) => {
            file.download((err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });

        await fs.promises.writeFile(credsPath, data);
        console.log("Session Successfully Loaded !!");
        return true;
    } catch (error) {
        console.error('Failed to download session data:', error);
        return false;
    }
}

let reconnectAttempts = 0;  // Ajout d'une variable pour limiter les tentatives de reconnexion

async function start() {
    try {
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
        const { version, isLatest } = await fetchLatestBaileysVersion();
        console.log(`DRACULA-MD using WhatsApp v${version.join('.')}, isLatest: ${isLatest}`);

        const Matrix = makeWASocket({
            version,
            logger: pino({ level: 'silent' }),
            printQRInTerminal: useQR,
            browser: ["DRACULA-MD", "safari", "3.3"],
            auth: state,
        });

        Matrix.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === 'close') {
                // Si la déconnexion est volontaire (par exemple, déconnexion de l'utilisateur), ne pas tenter de redémarrer
                if (lastDisconnect.error?.output?.statusCode === DisconnectReason.loggedOut) {
                    console.log(chalk.red('Déconnecté ! Vous êtes déconnecté du compte.'));
                    return;
                }

                // Limiter le nombre de tentatives de reconnexion à 5
                if (reconnectAttempts < 5) {
                    reconnectAttempts++;
                    console.log(chalk.yellow(`Tentative de reconnexion ${reconnectAttempts}/5...`));
                    start();  // Tentative de redémarrer
                } else {
                    console.log(chalk.red('Limite de tentatives de reconnexion atteinte. Arrêt du bot.'));
                }
            } else if (connection === 'open') {
                if (initialConnection) {
                    console.log(chalk.green("Connected Successfully DRACULA-MD ⚪"));
                    Matrix.sendMessage(Matrix.user.id, {
                        image: { url: "https://files.catbox.moe/hbos7n.jpg" },
                        caption: `𝚜𝚊𝚕𝚞𝚝 𝚓𝚎 𝚜𝚞𝚒𝚜  𝙳𝚁𝙰𝙲𝚄𝙻𝙰-𝙼𝙳 𝚝𝚘𝚗 𝚋𝚘𝚝 𝚊𝚜𝚜𝚒𝚜𝚝𝚊𝚗𝚝👋🏻

𝚂𝚒𝚖𝚙𝚕𝚎, 𝚍𝚒𝚛𝚎𝚌𝚝, 𝚖𝚊𝚒𝚜 𝚌𝚑𝚊𝚛𝚐é 𝚍𝚎 𝚏𝚘𝚗𝚌𝚝𝚒𝚘𝚗𝚗𝚊𝚕𝚒𝚝é𝚜 🎊.  𝚁𝚎𝚗𝚌𝚘𝚗𝚝𝚛𝚎𝚣 𝚕𝚎 𝚋𝚘𝚝 𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙 𝙳𝚁𝙰𝙲𝚄𝙻𝙰-𝙼𝙳.

🔧 𝙲𝚘𝚗𝚏𝚒𝚐𝚞𝚛𝚊𝚝𝚒𝚘𝚗:
𝙰𝚞𝚝𝚘 𝚂𝚝𝚊𝚝𝚞𝚜 𝚂𝚎𝚎𝚗: ${config.AUTO_STATUS_SEEN ? '✅' : '❌'}
𝙰𝚞𝚝𝚘 𝚂𝚝𝚊𝚝𝚞𝚜 𝚁𝚎𝚙𝚕𝚢: ${config.AUTO_STATUS_REPLY ? '✅' : '❌'}
𝙰𝚞𝚝𝚘 𝙳𝚕: ${config.AUTO_DL ? '✅' : '❌'}
𝙰𝚕𝚠𝚊𝚢𝚜 𝙾𝚗𝚕𝚒𝚗𝚎: ${config.ALWAYS_ONLINE ? '✅' : '❌'}

 𝙲𝚘𝚖𝚖𝚊𝚗𝚍 𝙿𝚛𝚎𝚏𝚒𝚡: ${prefix}

> créé par Pharouk`
                    });
                    initialConnection = false;
                } else {
                    console.log(chalk.blue("♻️ Connection reestablished after restart."));
                }
            }
        });

        Matrix.ev.on('creds.update', saveCreds);

        Matrix.ev.on("messages.upsert", async chatUpdate => await Handler(chatUpdate, Matrix, logger));
        Matrix.ev.on("call", async (json) => await Callupdate(json, Matrix));
        Matrix.ev.on("group-participants.update", async (messag) => await GroupUpdate(Matrix, messag));

        if (config.MODE === "public") {
            Matrix.public = true;
        } else if (config.MODE === "private") {
            Matrix.public = false;
        }

        // Auto-reaction
        Matrix.ev.on('messages.upsert', async (chatUpdate) => {
            try {
                const mek = chatUpdate.messages[0];
                if (!mek.key.fromMe && config.AUTO_REACT) {
                    if (mek.message) {
                        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                        await doReact(randomEmoji, mek, Matrix);
                    }
                }
            } catch (err) {
                console.error('Error during auto reaction:', err);
            }
        });

        // Auto-status seen & reply
        Matrix.ev.on('messages.upsert', async (chatUpdate) => {
            try {
                const mek = chatUpdate.messages[0];
                const fromJid = mek.key.participant || mek.key.remoteJid;
                if (!mek || !mek.message) return;
                if (mek.key.fromMe) return;
                if (mek.message?.protocolMessage || mek.message?.ephemeralMessage || mek.message?.reactionMessage) return;

                if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_SEEN) {
                    await Matrix.readMessages([mek.key]);

                    if (config.AUTO_STATUS_REPLY) {
                        const customMessage = config.STATUS_READ_MSG || '✅ Auto Status Seen Bot By DRACULA';
                        await Matrix.sendMessage(fromJid, { text: customMessage }, { quoted: mek });
                    }
                }
            } catch (err) {
                console.error('Error handling messages.upsert event:', err);
            }
        });

    } catch (error) {
        console.error('Critical Error:', error);
        process.exit(1);
    }
}

async function init() {
    if (fs.existsSync(credsPath)) {
        console.log("Session file found, proceeding without QR code.");
        await start();
    } else {
        const sessionDownloaded = await downloadSessionData();
        if (sessionDownloaded) {
            console.log("Session downloaded, starting bot.");
            await start();
        } else {
            console.log("No session found or downloaded, QR code will be printed for authentication.");
            useQR = true;
            await start();
        }
    }
}

init();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
