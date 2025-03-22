import config from '../config.cjs';

const promouvoir = async (m, gss) => {
  try {
    const numeroBot = await gss.decodeJid(gss.user.id);
    const prefixe = config.PREFIX;
    const cmd = m.body.startsWith(prefixe) ? m.body.slice(prefixe.length).split(' ')[0].toLowerCase() : '';
    const texte = m.body.slice(prefixe.length + cmd.length).trim();

    const commandesValides = ['promote', 'admin', 'toadmin'];
    if (!commandesValides.includes(cmd)) return;

    if (!m.isGroup) return m.reply("*🚫 CETTE COMMANDE PEUT SEULEMENT ÊTRE UTILISÉE DANS LES GROUPES*");
    
    const infosGroupe = await gss.groupMetadata(m.from);
    const participants = infosGroupe.participants;
    const botAdmin = participants.find(p => p.id === numeroBot)?.admin;
    const expediteurAdmin = participants.find(p => p.id === m.sender)?.admin;

    if (!botAdmin) return m.reply("*🚫 LE BOT DOIT ÊTRE ADMIN POUR UTILISER CETTE COMMANDE*");
    if (!expediteurAdmin) return m.reply("*🚫 VOUS DEVEZ ÊTRE ADMIN POUR UTILISER CETTE COMMANDE*");

    if (!m.mentionedJid) m.mentionedJid = [];
    if (m.quoted?.participant) m.mentionedJid.push(m.quoted.participant);

    const utilisateurs = m.mentionedJid.length > 0
      ? m.mentionedJid
      : texte.replace(/[^0-9]/g, '').length > 0
      ? [texte.replace(/[^0-9]/g, '') + '@s.whatsapp.net']
      : [];

    if (utilisateurs.length === 0) {
      return m.reply("*🚫 VEUILLEZ MENTIONNER OU CITER UN UTILISATEUR À PROMOUVOIR*");
    }
    console.log('utilisateurs: ', utilisateurs);
    
    const utilisateursValides = utilisateurs.filter(Boolean);

    const nomsUtilisateurs = await Promise.all(
      utilisateursValides.map(async (utilisateur) => {
        console.log('utilisateur: ', utilisateur);
        try {
          const contact = await gss.getContact(utilisateur);
          console.log('contact: ', contact);
          return contact.notify || contact.pushname || utilisateur.split('@')[0];
        } catch (erreur) {
          return utilisateur.split('@')[0];
        }
      })
    );
    console.log('nomsUtilisateurs: ', nomsUtilisateurs);

    await gss.groupParticipantsUpdate(m.from, utilisateursValides, 'promote')
      .then(() => {
        const nomsPromus = nomsUtilisateurs.map(nom => `@${nom}`).join(', ');
        m.reply(`*Utilisateurs ${nomsPromus} promus avec succès dans le groupe ${infosGroupe.subject}.*`);
      })
      .catch(() => m.reply('Échec de la promotion des utilisateurs dans le groupe.'));
  } catch (erreur) {
    console.error('Erreur:', erreur);
    m.reply('Une erreur est survenue lors du traitement de la commande.');
  }
};

export default promouvoir;
