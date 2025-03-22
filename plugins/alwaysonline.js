import config from '../config.cjs';

const alwaysonlineCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === 'alwaysonline') {
    if (!isCreator) return m.reply("*📛 This command is restricted to the bot owner.*");
    let responseMessage;

    if (text === 'on') {
      config.ALWAYS_ONLINE = true;
      responseMessage = "Always Online mode has been activated.";
    } else if (text === 'off') {
      config.ALWAYS_ONLINE = false;
      responseMessage = "Always Online mode has been deactivated.";
    } else {
      responseMessage = "Usage:\n- `alwaysonline on`: Activate Always Online mode\n- `alwaysonline off`: Deactivate Always Online mode";
    }

    try {
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } catch (error) {
      console.error("Error processing the request:", error);
      await Matrix.sendMessage(m.from, { text: 'An error occurred while processing the request.' }, { quoted: m });
    }
  }
};

export default alwaysonlineCommand;
