import config from '../config.cjs';

const gcEvent = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === 'welcome') {
    if (!m.isGroup) return m.reply("*🚫 THIS COMMAND CAN ONLY BE USED IN GROUPS*");
    
    const groupMetadata = await Matrix.groupMetadata(m.from);
    const participants = groupMetadata.participants;
    const botNumber = await Matrix.decodeJid(Matrix.user.id);
    const botAdmin = participants.find(p => p.id === botNumber)?.admin;
    const senderAdmin = participants.find(p => p.id === m.sender)?.admin;

    if (!botAdmin) return m.reply("*🚫 THE BOT MUST BE AN ADMIN TO USE THIS COMMAND*");
    if (!senderAdmin) return m.reply("*🚫 YOU MUST BE AN ADMIN TO USE THIS COMMAND*");

    let responseMessage;

    if (text === 'on') {
      config.WELCOME = true;
      responseMessage = "✅ Welcome and leave messages have been enabled.";
    } else if (text === 'off') {
      config.WELCOME = false;
      responseMessage = "❌ Welcome and leave messages have been disabled.";
    } else {
      responseMessage = "⚙️ Usage:\n- `WELCOME on` → Enable welcome and leave messages\n- `WELCOME off` → Disable welcome and leave messages";
    }

    try {
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } catch (error) {
      console.error("Error processing your request:", error);
      await Matrix.sendMessage(m.from, { text: "❌ Error processing your request." }, { quoted: m });
    }
  }
};

export default gcEvent;
