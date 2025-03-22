import config from '../config.cjs';

const autoFeatureCommand = async (m, Matrix) => {
    const botNumber = await Matrix.decodeJid(Matrix.user.id);
    const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();

    if (!isCreator) {
        await Matrix.sendMessage(m.from, { text: "*📛 THIS IS AN OWNER COMMAND*" }, { quoted: m });
        return;
    }

    const commands = {
        "auto_status_seen": "AUTO_STATUS_SEEN",
        "auto_status_reply": "AUTO_STATUS_REPLY",
        "auto_download": "AUTO_DL"
    };

    if (commands[cmd]) {
        if (text === "on") {
            config[commands[cmd]] = true;
            m.reply(`✅ *${cmd.replace('_', ' ')}* has been *enabled*.`);
        } else if (text === "off") {
            config[commands[cmd]] = false;
            m.reply(`❌ *${cmd.replace('_', ' ')}* has been *disabled*.`);
        } else {
            m.reply(`⚙️ Usage:\n*${prefix}${cmd} on/off*`);
        }
    }
};

export default autoFeatureCommand;
