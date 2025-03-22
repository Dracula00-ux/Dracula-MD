import config from '../config.cjs';

const commandeMode = async (m, Matrix) => {
    const numeroBot = await Matrix.decodeJid(Matrix.user.id);
    const estCreateur = [numeroBot, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
    const prefixe = config.PREFIX;
    const cmd = m.body.startsWith(prefixe) ? m.body.slice(prefixe.length).split(' ')[0].toLowerCase() : '';
    const texte = m.body.slice(prefixe.length + cmd.length).trim();

    if (cmd === 'mode') {
        if (!estCreateur) {
            await Matrix.sendMessage(m.from, { text: "*📛 CETTE COMMANDE EST RÉSERVÉE AU PROPRIÉTAIRE*" }, { quoted: m });
            return;
        }

        if (['public', 'private'].includes(texte)) {
            if (texte === 'public') {
                Matrix.public = true;
                config.MODE = "public";
                m.reply('Le mode a été changé en public.');
            } else if (texte === 'private') {
                Matrix.public = false;
                config.MODE = "private";
                m.reply('Le mode a été changé en privé.');
            } else {
                m.reply("Utilisation :\n.mode public/private");
            }
        } else {
            m.reply("Mode invalide. Veuillez utiliser 'public' ou 'private'.");
        }
    }
};

export default commandeMode;
