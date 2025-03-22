FROM node:lts-buster

# Met à jour les paquets et installe les dépendances nécessaires
RUN apt-get update && \
    apt-get install -y ffmpeg imagemagick webp && \
    apt-get upgrade -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copie le package.json et installe les dépendances npm
COPY package.json /app/package.json
WORKDIR /app
RUN npm install && npm install -g qrcode-terminal pm2

# Copie le reste du code source
COPY . .

# Expose le port utilisé par ton bot
EXPOSE 3000

# Démarre ton bot avec npm
CMD ["npm", "start"]
