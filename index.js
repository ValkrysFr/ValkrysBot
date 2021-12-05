const Discord = require('discord.js')
const bot = new Discord.Client()
'use strict';

function length(obj) {
    return Object.keys(obj).length;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

bot.on('ready', function(){
    bot.user.setActivity('Valkrys !')
    console.log('Connected');
})

const fs = require("fs");
const ffmpeg = require("ffmpeg");
const opus = require("opusscript");
const ytdl = require("ytdl-core-discord");
const yts = require("yt-search");
const config = require("./config.json")
const queue = new Map();

bot.on('message', function(message) {
    const serverQueue = queue.get(message.guild.id);
    
    if (message.channel.id === config.suggestion_channel_id) {
        message.react("👎");
        message.react("👍");
    } else if (message.content === "/vote") {
        message.channel.send(":mouse_three_button: Lien pour voter : " + config.vote_link)
    } else if (message.content === "/site") {
        message.channel.send(":desktop: Lien du site : " + config.site_link)
    } else if (message.content === "/dynmap") {
        message.channel.send(":earth_americas: Dynmap Survie : " + config.dynmap_link)
    } else if (message.content === "/ip") {
        message.channel.send(":joystick: IP du serveur : " + config.minecraft_link)
    } else if (message.content === "/boutique") {
        message.channel.send(":moneybag: Boutique du serveur : " + config.shop_link)
    } else if (message.content === "/github") {
        message.channel.send(":robot: Github du serveur : " + config.github_link)
    } else if (message.content === "/help"){
        var embed = new Discord.MessageEmbed()
            .setTitle("Liste de commandes basiques")
            .addField(":question: Pour afficher cette liste","/help")
            .addField(":desktop: Pour avoir accès au site","/site")
            .addField(":mouse_three_button: Pour aller voter","/vote")
            .addField(":moneybag: Pour avoir accès à la boutique","/boutique")
            .addField(":earth_americas: Pour avoir accès à la dynmap","/dynmap")
            .addField(":joystick: Pour obtenir l'ip du serveur","/ip")
            .addField(":robot: Pour obtenir le lien du github","/github")
            .setColor("0x2ecc71")
    } else if (message.content.startsWith("/clear")) {
      const args = message.content.split(' ').slice(1);
      const amount = args.join(' ');
        if (message.deletable) {
            message.delete();
        }
        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            return message.reply("Vous n'avez pas l'autorisation de faire ça...").then(m => m.delete(5000));
        }
        if (isNaN(amount) || parseInt(amount) <= 0) {
            return message.reply("Met un nombre > 0 et pas de lettres").then(m => m.delete(5000));
        }
        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
            return message.reply("Il me manque des permissions !").then(m => m.delete(5000));
        }

        let deleteAmount = parseInt(amount) + 1;

        if (deleteAmount > 100) {
            deleteAmount = 100;
        }

        message.channel.bulkDelete(deleteAmount, true)
            .then(deleted => message.channel.send(` \`${deleted.size}\` messages ont été supprimés.`))
            .catch(err => message.reply(`Oops... ${err}`));
    } else if (message.content.startsWith("/poll")) {
        if (!message.member.hasPermission("CHANGE_NICKNAME")) {
            return message.reply("Vous n'avez pas l'autorisation de faire ça...");
        } else {
            if (message.content.endsWith("/poll")) {
                return message.channel.send("Utilisation de la commande: `/poll titre;choix 1$emoji;choix 2$emoji;...`")
            } else {
                var args = message.content.slice(6);
                args = args.split(";");
                if (args.length < 3) {
                    return message.channel.send("Merci de rentrer au moins 2 choix !")
                } else {
                    var len = args.length;
                    var embed = new Discord.MessageEmbed()
                        .setTitle(args[0])
                        .setFooter("Réagissez selon votre choix !")
                        .setColor([255,0,0])
                        .setAuthor("Sondage par " + message.author.username, message.author.avatarURL());

                    for (let i = 1; i < len; i++) {
                        var choice = args[i].split('$');
                        embed.addField("----", choice[1]+" : "+choice[0])
                    }

                    message.channel.send(embed).then(sent => {
                        bot.polls [sent.id] = {
                            title: args[0],
                            author: message.author.username
                        }
                        fs.writeFile("./ressources/json/polls.json", JSON.stringify(bot.polls, null, 4), err =>{
                            if(err) throw err;
                        });
                        for (let i = 1; i < len; i++) {
                            var choice = args[i].split('$');
                            sent.react(choice[1]);
                        }
                    });
                    message.delete()
                }
            }
        }
    } else if(message.content.startsWith('/disconnect')|| message.content.startsWith('/dc')) {
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) {
            message.channel.send('Vous n\'êtes dans aucun salon !');
        } else {
            voiceChannel.leave();
            message.channel.send(':x: Deconnexion du salon !');
        }
    } else if (message.content === "/record") {
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) {
            message.channel.send('Vous n\'êtes dans aucun salon !');
        } else{
            record(voiceChannel);
        }
    } else if (message.content === "/strec") {
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) {
            message.channel.send('Vous n\'êtes dans aucun salon !');
        } else {
            stop_record(voiceChannel, message);
        }
    } else if (message.content.startsWith("/debug ")) {
        if (message.content.includes('roles')) {
            var answer = "Debug menu for roles:";
            message.guild.roles.cache.forEach(r => {
                answer += "\n\n" + r.name.replace('@', '') + " : `" + r.id + "`";
            })
            message.channel.send(answer);
        } else if (message.content.includes('emojis')) {
            var answer = "Debug menu for emojis :";
            message.guild.emojis.cache.forEach(emoji => {
                if(answer.length > 1000){
                    message.channel.send(answer);
                    answer = ""
                }
                answer += "\n\n<:" + emoji.name + ":" + emoji.id + "> -> " + emoji.name.replace('_', '\_') + " : `" + emoji.id + "`";
            })
        }
    }
})

bot.on("guildMemberAdd", (member) => {
    if (member.user.username.toLowerCase().includes("discord.gg")) {
        member.ban();
        bot.channels.cache.get("836602700447219773").lastMessage.delete()
        bot.channels.cache.get("900445774746361879").send("*BAN DE L'UTILISATEUR: <@"+member.user.id+">*");
    } else {
        const defaultChannel =  member.guild.channels.cache.get('836602700447219773');

        defaultChannel.send("Bienvenue <@" + member.id + "> !")
        defaultChannel.send("Pour avoir accès à tous le serveur merci de mettre un " + config.message_rules_react + " sous le <# " + config.message_rules_id + ">")
    }
});

async function record(voiceChannel, message){
    voiceChannel.join().then(connection => {
        const audio = connection.receiver.createStream(message.author, { mode: 'pcm', end: 'manual' });
        audio.pipe(fs.createWriteStream("./ressources/sounds/"+message.author.id+".pcm"))
    })
}

bot.login(config.token);