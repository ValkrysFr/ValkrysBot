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
    bot.user.setActivity('BreakerLand !')
    console.log('Connected');
})

const fs = require("fs");
bot.msgs = require("./ressources/json/ideas.json");
bot.polls =require("./ressources/json/polls.json");

const ffmpeg = require("ffmpeg");
const opus = require("opusscript");
const ytdl = require("ytdl-core-discord");
const yts = require("yt-search");
const config = require("./config.json")
const queue = new Map();

bot.on('message', function(message){
    const serverQueue = queue.get(message.guild.id);
    
    if (message.channel.id === "613684354421620766"){
        message.react("👎");
        message.react("👍");
        
        }
    else if (message.content === "/wiki"){
        message.channel.send(":information_source: Lien du wiki: https://breakerland.fr/wiki")
    }
    else if (message.content === "/vote"){
        message.channel.send(":mouse_three_button: Lien pour voter: https://breakerland.fr/vote")
    }
    else if (message.content === "/site"){
        message.channel.send(":desktop: Lien du site: https://breakerland.fr/")
    }
    else if (message.content === "/dynmap"){
        message.channel.send(":earth_americas: Dynmap survie : https://survie.breakerland.fr")
        message.channel.send(":earth_africa: Dynmap créatif : https://crea.breakerland.fr")
    }
    else if (message.content === "/ip"){
        message.channel.send(":joystick: IP du serveur: mc.breakerland.fr")
    }
    else if (message.content === "/boutique"){
        message.channel.send(":moneybag: Boutique du serveur: https://breakerland.fr/shop")
    }
    else if (message.content === "/github"){
        message.channel.send(":robot: Github du serveur: https://github.com/Breakerland")
    }
    else if (message.content === "/debug"){
        var date = new Date();
        date.setHours(date.getHours()+2);
         var actual = bot.msgs.actual;
        message.reply("[Date: "+date.getHours()+"h"+date.getMinutes()+"m] \n[Actual: "+actual+"] \n[User: "+message.author.username+"]")
        if(message.author.username.toLowerCase().includes('nitro')){
            message.channel.send("includes nitro");
        }else{ message.channel.send("not includes nitro"); }
    }
    else if (message.channel.id === "710089322111565874"){
        if(message.content=== "/next"){
                var actual = bot.msgs.actual
                if(actual > length(bot.msgs)-1){
                    actual = 1;
                }
                var _message = bot.msgs[actual.toString()].text;
                var _author = bot.msgs[actual.toString()].author;
                bot.channels.get("710089322111565874").send("Idée du Jour n°"+actual+" proposé par <@"+_author+">\n\n**"+_message+"**");
                bot.msgs ["actual"]= actual+1;
                fs.writeFile("./ressources/json/ideas.json", JSON.stringify(bot.msgs, null, 4), err =>{
                            if(err) throw err;
                });
        }
        else if(message.content.startsWith('/goto')){
            var newa = parseInt(message.content.slice(6),10);
            if(newa>length(bot.msgs)-1){
                newa = 1
            }
            bot.msgs ["actual"]= newa;
            fs.writeFile("./ressources/json/ideas.json", JSON.stringify(bot.msgs, null, 4), err =>{
                            if(err) throw err;
                });
            var actual = parseInt(bot.msgs.actual,10);
                if(actual > length(bot.msgs)-1){
                    actual = 1;
                }
                var _message = bot.msgs[actual.toString()].text;
                var _author = bot.msgs[actual.toString()].author;
                bot.channels.get("710089322111565874").send("Idée du Jour n°"+actual+" proposé par <@"+_author+">\n\n**"+_message+"**");
                bot.msgs ["actual"]= actual+1;
                fs.writeFile("./ressources/json/ideas.json", JSON.stringify(bot.msgs, null, 4), err =>{
                            if(err) throw err;
                });
        }
        else if(message.content === "/last"){
            bot.msgs ["actual"]= length(bot.msgs)-1;
            fs.writeFile("./ressources/json/ideas.json", JSON.stringify(bot.msgs, null, 4), err =>{
                            if(err) throw err;
            });
            message.channel.send("L'idée du jour de demain sera la dernière proposée (Idée n°"+bot.msgs["actual"]+")");
        }
    } 
    else if (message.content === "/help"){
        var embed = new Discord.MessageEmbed()
            .setTitle("Liste de commandes basiques")
            .addField(":question: Pour afficher cette liste","/help")
            .addField(":desktop: Pour avoir accès au site","/site")
            .addField(":information_source: Pour avoir accès au wiki","/wiki")
            .addField(":mouse_three_button: Pour aller voter","/vote")
            .addField(":moneybag: Pour avoir accès à la boutique","/boutique")
            .addField(":earth_americas: Pour avoir accès à la dynmap","/dynmap")
            .addField(":joystick: Pour obtenir l'ip du serveur","/ip")
            .addField(":robot: Pour obtenir le lien du github","/github")
            .setColor("0x2ecc71")
   
        message.channel.send(embed);
        var m_embed = new Discord.MessageEmbed()
            .setTitle("Liste des commandes de musique !")
            .addField(":musical_note: Pour lancer une musique", "/play (ou /p) + titre")
            .addField(":fast_forward: Pour passer à la musique suivante", "/skip (ou /s)")
            .addField(":stop_button: Pour arrêter la musique", "/stop")
            .addField(":pause_button: Pour mettre la musique en pause", "/pause")
            .addField(":play_pause: Pour remettre la musique", "/resume")
            .addField(":one: Pour le morceau n°1 de Christophe_", "/chris 1")
            .addField(":two: Pour le morceau n°2 de Christophe_", "/chris 2")
            .addField(":three: Pour le morceau n°3 de Christophe_", "/chris 3 (ou /chris akla)")
            .addField(":x: Pour faire partir le bot du salon", "/disconnect (ou /dc)")
            .setColor("0x2ecc71")
            message.channel.send(m_embed);
    }

    else if (message.channel.id === "710089289895247933"){
        if(message.author.id != "630021989494685696"){
            var nbr = length(bot.msgs);
                         bot.msgs [nbr.toString()] = {
                            text: message.content,
                            author: message.author.id
                         }
                         fs.writeFile("./ressources/json/ideas.json", JSON.stringify(bot.msgs, null, 4), err =>{
                            if(err) throw err;
                            var count = length(bot.msgs)-1;
                            message.reply("ton idée a bien été enregistrée ! (Idée n°"+count+")");
                            message.delete();
                         });
        }
    }
    else if(message.content.startsWith("/clear")){
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
    }
    else if(message.content.startsWith("/poll")){
        if(!message.member.hasPermission("CHANGE_NICKNAME")){
            return message.reply("Vous n'avez pas l'autorisation de faire ça...");
        } else {
            if(message.content.endsWith("/poll")){
                return message.channel.send("Utilisation de la commande: `/poll titre;choix 1$emoji;choix 2$emoji;...`")
            }
            else{
                var args = message.content.slice(6);
                args = args.split(";");
                if(args.length < 3){
                    return message.channel.send("Merci de rentrer au moins 2 choix !")
                }
                else{
                    var len = args.length;
                    var embed = new Discord.MessageEmbed()
                        .setTitle(args[0])
                        .setFooter("Réagissez selon votre choix !")
                        .setColor([255,0,0])
                        .setAuthor("Sondage par "+message.author.username, message.author.avatarURL());
                    for(let i = 1; i < len; i++){
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
                                                                for(let i = 1; i < len; i++){
                                                                var choice = args[i].split('$');
                                                                sent.react(choice[1]);
                                                                }
                                                                
                                                             });
                   
                    message.delete()
                }
            }
        }
    }
    else if (message.content.startsWith("/fight")){
        if(message.mentions.everyone){
            message.delete();
            return message.reply('merci de sélectionner un utilisateur précis !')
        }
        let p1 = message.author;
        let p2 = message.mentions.users.first();
        if(p2 === undefined){
            message.delete();
            return message.reply('merci de sélectionner un utilisateur précis !')
        }
        else if(p1 === p2){
            message.delete();
            return message.reply("t'es bête ou quoi")
        }
        let l1 = getRandomInt(getRandomInt(getRandomInt(100)));
        let l2 = getRandomInt(getRandomInt(getRandomInt(100)));
        if(l1<l2){
            return message.channel.send("Le vainqueur est <@"+p1.id+"> ! :trophy:");
        }
        else if(l2<l1){
            return message.channel.send("Le vainqueur est <@"+p2.id+"> ! :trophy:");
        }
        else{
            return message.channel.send("Égalité parfaite ! :pensive:");
        }
    }
    else if(message.content.startsWith('/chris')){
        let voiceChannel = message.member.voice.channel;
        let args = message.content.slice(7);
        if(!voiceChannel){
            return message.reply("vous devez être dans un salon vocal !");
        }
        else{
            if(!serverQueue){
                voiceChannel.join().then(function (connection) {
                    if(args === '1'){
                        connection.play('./ressources/sounds/Morceau_One.mp3');
                        var embed = new Discord.MessageEmbed()
                            .setTitle("Morceau N°1")
                            .setFooter("Duration: 03:41")
                            .setAuthor("Music asked by "+message.author.username, message.author.avatarURL)
                            .setThumbnail("https://cdn.discordapp.com/avatars/414102115301064706/d0e2e39e1a828c96b7ad9be60db80c73.png")
                            .setDescription("Musique produite par Christophe_");
                        message.channel.send(embed);
                    }else if (args === '2'){
                        connection.play('./ressources/sounds/Morceau_Two.mp3');
                        var embed = new Discord.MessageEmbed()
                        .setTitle("Morceau N°2")
                        .setFooter("Duration: 03:55")
                        .setAuthor("Music asked by "+message.author.username, message.author.avatarURL)
                        .setThumbnail("https://cdn.discordapp.com/avatars/414102115301064706/d0e2e39e1a828c96b7ad9be60db80c73.png")
                        .setDescription("Musique produite par Christophe_");
                    message.channel.send(embed);
                    }else if (args === '3' || args === 'akla'){
                        connection.play('./ressources/sounds/AKLA.mp3');
                        var embed = new Discord.MessageEmbed()
                        .setTitle("Morceau N°3 -- AKLA")
                        .setFooter("Duration: 04:35")
                        .setAuthor("Music asked by "+message.author.username, message.author.avatarURL)
                        .setThumbnail("https://cdn.discordapp.com/avatars/414102115301064706/d0e2e39e1a828c96b7ad9be60db80c73.png")
                        .setDescription("Musique produite par Christophe_");
                    message.channel.send(embed);
                    }else{
                        message.reply('notre chère christophe travail d\'arrache pied pour nous sortir de nouvelles musiques !');
                    }
                
                })
            }
            else{
                message.reply('je suis déjà en train de jouer de la musique !');
            }
            
        }
        
    }

    else if (message.content.startsWith('/play') || message.content.startsWith('/p ')) {
		execute(message, serverQueue);
		return;
	} else if (message.content.startsWith('/skip') || message.content.startsWith('/s')) {
		skip(message, serverQueue);
		return;
	} else if (message.content.startsWith('/stop')) {
		stop(message, serverQueue);
		return;
    }else if (message.content.startsWith('/pause')) {
        pause(message, serverQueue);
        return;
    }else if (message.content.startsWith('/resume')) {
        resume(message, serverQueue);
        return;
    }
    else if(message.content.startsWith('/disconnect')|| message.content.startsWith('/dc')){
        const voiceChannel = message.member.voice.channel;

        if(!voiceChannel){
            message.channel.send('Vous n\'êtes dans aucun salon !');
        }else{
            voiceChannel.leave();
            message.channel.send(':x: Deconnexion du salon !');
        }
    }
    else if(message.content === "/record"){
        const voiceChannel = message.member.voice.channel;

        if(!voiceChannel){
            message.channel.send('Vous n\'êtes dans aucun salon !');
        }else{
            record(voiceChannel);
        }
    }
    else if(message.content === "/strec"){
        const voiceChannel = message.member.voice.channel;

        if(!voiceChannel){
            message.channel.send('Vous n\'êtes dans aucun salon !');
        }else{
            stop_record(voiceChannel, message);
        }
    }
    else if(message.channel.parentID === '719313575193084025'){
        if(message.content.startsWith('/cv ')){
            const args = message.content.slice(4).split("¤");
            if(length(args) != 4){
                message.reply('vous avez du vous tromper quelque part !');
                return;
            }
            const embed = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.avatarURL())
                .setTitle("Candidature de: "+message.author.username)
                .addField("Présentation IRL:", args[0].replace('$^$', '\n'))
                .addField("Présentation in-game:", args[1].replace('$^$', '\n'))
                .addField("Poste demandé:", args[2].replace('$^$', '\n'))
                .addField("Motivation:", args[3].replace('$^$', '\n'))
                .setFooter("Candidature générer depuis breakerland.fr")
                .setColor("RANDOM");
            message.channel.send(embed).then(m => {
                m.react("👍");
                m.react("👎");
            });
            message.reply("refusé :x:");
            console.log(args);
            message.delete();

        }
    }

    })


    bot.on("guildMemberAdd", (member) => {
        if(member.user.username.toLowerCase().includes("discord.gg")){
            member.ban();
            bot.channels.cache.get("644156102690209820").lastMessage.delete()
            bot.channels.cache.get("624587022660665355").send("*BAN DE L'UTILISATEUR: <@"+member.user.id+">*");
        }
        else{
        const guild = member.guild;
        const defaultChannel = guild.channels.cache.get('644156102690209825');
        defaultChannel.send("Bienvenue <@"+member.id+"> !")
        defaultChannel.send("Pour avoir accès à tous le serveur merci de mettre un :thumbsup: sous le <#614482156001034270>")
        }
    });

    bot.on("channelCreate", (channel) => {
        if(channel.parentID == "719313575193084025"){
            const name = channel.name.split('-');
            channel.setName("candidature-"+name[1]);
            
        }
    })
    
    bot.on("channelUpdate", (oldChannel, newChannel) =>{
        if(newChannel.parentID === "719313575193084025"){
            if(!newChannel.name.startsWith('candidature')){
                const name = newChannel.name.split('-');
                newChannel.setName("candidature-"+name[1]);
            }
            
        }
    })

    setInterval(function(){
        var date = new Date();
        date.setHours(date.getHours()+2);
        var heure = date.getHours();
        var minute = date.getMinutes();
        if(heure === 10){
            if(minute == 00){
                var actual = bot.msgs.actual;
                if(actual > length(bot.msgs)-1){
                    actual = 1;
                }
                var _message = bot.msgs[actual.toString()].text;
                var _author = bot.msgs[actual.toString()].author;
                bot.channels.cache.get("710089322111565874").send("*Idée du Jour n°"+actual+" proposée par* <@"+_author+">\n\n**"+_message+"**");
                bot.msgs ["actual"]= actual+1;
                fs.writeFile("./ressources/json/ideas.json", JSON.stringify(bot.msgs, null, 4), err =>{
                            if(err) throw err;
                         });
            }
        }
    }, 60000);

    async function execute(message, serverQueue) {
        if(message.content.startsWith('/p')){
            var args = message.content.slice(3);
        }
        else if(message.content.startsWith('/play')){
            var args = message.content.slice(6);
        }
    
        const voiceChannel = message.member.voice.channel;
    
        yts(args, async function(err, r){
            if(err) throw err;
    
            else if(!voiceChannel){
                return message.reply("vous devez être dans un salon vocal !");
            }
            else{
                const videos = r.videos;
                const song = {
                    title: videos[0].title,
                    url: videos[0].url,
                };
                var embed = new Discord.MessageEmbed()
                        .setTitle(videos[0].title)
                        .setFooter("Duration: "+videos[0].timestamp)
                        .setAuthor("Music asked by "+message.author.username, message.author.avatarURL)
                        .setImage("https://img.youtube.com/vi/"+videos[0].videoId+"/mqdefault.jpg")
                        .setDescription(videos[0].description);
                message.channel.send(embed);
                if (!serverQueue) {
                    const queueContruct = {
                        textChannel: message.channel,
                        voiceChannel: voiceChannel,
                        connection: null,
                        songs: [],
                        volume: 1,
                        playing: true,
                    };
            
                    queue.set(message.guild.id, queueContruct);
            
                    queueContruct.songs.push(song);
            
                    try {
                        voiceChannel.join().then(connection => {
                            queueContruct.connection = connection;
                            play(message.guild, queueContruct.songs[0]);
                        });
                        
                    } catch (err) {
                        console.log(err);
                        queue.delete(message.guild.id);
                        return message.channel.send(err);
                    }
                } else {
                    serverQueue.songs.push(song);
                    console.log(serverQueue.songs);
                    return message.channel.send(`${song.title} à été ajouté à la liste d'attente!`);
                }
            
            }
        })
    }
            
    async function skip(message, serverQueue) {
        if (!message.member.voice.channel) return message.channel.send('Vous devez être dans un salon vocal pour passer la chanson!');
        if (!serverQueue) return message.channel.send('Il n\'y a pas de chanson à passer zebi!');
        serverQueue.connection.dispatcher.end();
        message.channel.send('La musique à été passé par <@'+message.author.id+'>, prochaine lecture → `'+serverQueue.songs[0].title+'`');
    }
    
    async function stop(message, serverQueue) {
        if (!message.member.voice.channel) return message.channel.send('Vous devez être dans un salon vocal pour arreter la musique!');
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
        message.channel.send('La musique à été arrêté par <@'+message.author.id+'>');
    }
   async function pause(message, serverQueue){
        if (!message.member.voice.channel) return message.channel.send('Vous devez être dans un salon vocal pour arreter la musique!');
        serverQueue.connection.dispatcher.pause();
        message.channel.send('La musique à été mis en pause par <@'+message.author.id+'>');
    }
   async function resume(message, serverQueue){
        if (!message.member.voice.channel) return message.channel.send('Vous devez être dans un salon vocal pour arreter la musique!');
        serverQueue.connection.dispatcher.pause();
        message.channel.send('La musique à été mis relancé par <@'+message.author.id+'>');
    }
    
    async function play(guild, song) {
        const serverQueue = queue.get(guild.id);
        console.log(song.url);
        if (!song) {
            serverQueue.voiceChannel.leave();
            queue.delete(guild.id);
            return;
        }
    
        const dispatcher = serverQueue.connection.play(await ytdl(song.url, {type : 'opus'}))
            .on('end', () => {
                serverQueue.songs.shift();
                play(guild, serverQueue.songs[0]);
            })
            .on('error', error => {
                console.log(error);
            });
        dispatcher.setVolume(serverQueue.volume);
    }
    async function record(voiceChannel, message){
        voiceChannel.join().then(connection => {
            const audio = connection.receiver.createStream(message.author, { mode: 'pcm', end: 'manual' });
            audio.pipe(fs.createWriteStream("./ressources/sounds/"+message.author.id+".pcm"))
        })
    }

bot.login(config.token);
