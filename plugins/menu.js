import moment from 'moment-timezone';
import fs from 'fs';
import os from 'os';
import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;
import config from '../config.cjs';

// Obtenir la mémoire totale et la mémoire libre en octets
const totalMemoireOctets = os.totalmem();
const memoireLibreOctets = os.freemem();

// Définir les conversions d'unités
const octetEnKB = 1 / 1024;
const octetEnMB = octetEnKB / 1024;
const octetEnGB = octetEnMB / 1024;

// Fonction pour formater les octets en un format lisible
function formatOctets(octets) {
  if (octets >= Math.pow(1024, 3)) {
    return (octets * octetEnGB).toFixed(2) + ' GB';
  } else if (octets >= Math.pow(1024, 2)) {
    return (octets * octetEnMB).toFixed(2) + ' MB';
  } else if (octets >= 1024) {
    return (octets * octetEnKB).toFixed(2) + ' KB';
  } else {
    return octets.toFixed(2) + ' octets';
  }
}

// Temps de fonctionnement du bot
const tempsFonctionnement = process.uptime();
const jours = Math.floor(tempsFonctionnement / (24 * 3600)); 
const heures = Math.floor((tempsFonctionnement % (24 * 3600)) / 3600);
const minutes = Math.floor((tempsFonctionnement % 3600) / 60);
const secondes = Math.floor(tempsFonctionnement % 60);

// Message d'uptime
const messageUptime = `*Je suis en ligne depuis ${jours}j ${heures}h ${minutes}m ${secondes}s*`;
const messageFonctionnement = `*☀️ ${jours} Jour*\n*🕐 ${heures} Heure*\n*⏰ ${minutes} Minutes*\n*⏱️ ${secondes} Secondes*\n`;

// Obtenir l'heure et la date
const heureActuelle = moment.tz("Asia/Colombo").format("HH:mm:ss");
const dateActuelle = moment.tz("Asia/Colombo").format("DD/MM/YYYY");
const heure2 = moment().tz("Asia/Colombo").format("HH:mm:ss");

let salutation = "";

if (heure2 < "05:00:00") {
  salutation = `Bonjour 🌄`;
} else if (heure2 < "11:00:00") {
  salutation = `Bonjour 🌄`;
} else if (heure2 < "15:00:00") {
  salutation = `Bon après-midi 🌅`;
} else if (heure2 < "18:00:00") {
  salutation = `Bonsoir 🌃`;
} else if (heure2 < "19:00:00") {
  salutation = `Bonsoir 🌃`;
} else {
  salutation = `Bonne nuit 🌌`;
}

const test = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const mode = config.MODE === 'public' ? 'public' : 'privé';
  
  const commandesValides = ['list', 'help', 'menu'];

  if (commandesValides.includes(cmd)) {
    const str = `╭━━━〔 *DRACULA-MD* 〕━━━┈⊷
┃☠╭──────────────
┃☠│ Propriétaire : *PHAROUK*
┃☠│ Utilisateur : *${m.pushName}*
┃☠│  BOT : WHATSAPP 
┃☠│ Type : *NodeJs*
┃☠│ Mode : *${mode}*
┃☠│ Plateforme : *${os.platform()}*
┃☠│ Préfixe : ${prefix}
┃☠│ Version : *1.0.0*
┃☠╰──────────────
╰━━━━━━━━━━━━━━━┈⊷ 
> Hey ${m.pushName} ${salutation}
╭━❮ 𝙲𝙾𝙽𝚅𝙴𝚁𝚃𝙴𝚄𝚁 ❯━╮
┃♨ ${prefix}𝙰𝚃𝚃𝙿
┃♨ ${prefix}𝙴𝙼𝙾𝙹𝙸𝙼𝙸𝚇
┃♨ ${prefix}𝙼𝙿3
╰━━━━━━━━━━━━━━━⪼
╭━❮ 𝙰𝙸 ❯━╮
┃♨ ${prefix}𝙰𝚒
┃♨ ${prefix}𝙶𝚙𝚝
┃♨ ${prefix}𝙳𝚊𝚕𝚕𝚎
╰━━━━━━━━━━━━━━━⪼
╭━❮ 𝙶𝚁𝙾𝚄𝙿 ❯━╮
┃♨ ${prefix}𝙰𝚓𝚘𝚞𝚝𝚎𝚛
┃♨ ${prefix}𝙴𝚡𝚙𝚞𝚕𝚜𝚎𝚛
┃♨ ${prefix}𝙶𝚛𝚘𝚞𝚙𝚎
╰━━━━━━━━━━━━━━━⪼
╭━❮ 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳 ❯━╮
┃♨ ${prefix}𝚈𝚝𝚖𝚙3
┃♨ ${prefix}𝙵𝚊𝚌𝚎𝚋𝚘𝚘𝚔
┃♨ ${prefix}𝙿𝚕𝚊𝚢
╰━━━━━━━━━━━━━━━⪼
╭━❮ 𝙿𝚁𝙸𝙽𝙲𝙸𝙿𝙰𝙻 ❯━╮
┃♨ ${prefix}𝙿𝚒𝚗𝚐
┃♨ ${prefix}𝙼𝚎𝚗𝚞
┃♨ ${prefix}𝙸𝚗𝚏𝚘𝙱𝚘𝚝
╰━━━━━━━━━━━━━━━⪼`;

    await Matrix.sendMessage(m.from, {
      image: fs.readFileSync('./media/b7067cdf56110dbbdd154b2cf600d888.jpg'),
      caption: str,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '',
          newsletterName: "Draculaxx",
          serverMessageId: 143
        }
      }
    }, {
      quoted: m
    });

    // Envoyer un audio après le menu
    await Matrix.sendMessage(m.from, {
      audio: { url: '' },
      mimetype: '',
      ptt: true
    }, { quoted: m });
  }
};

export default test;
