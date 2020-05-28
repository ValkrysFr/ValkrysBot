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
const ytdl = require("ytdl-core");
const yts = require("yt-search");

bot.on('message', function(message){
    const list = bot.guilds.get("596754524392259584");
      
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
        var embed = new Discord.RichEmbed()
            .setTitle("Liste de commandes")
            .addField(":question: Pour afficher cette liste","/help")
            .addField(":desktop: Pour avoir accès au site","/site")
            .addField(":information_source: Pour avoir accès au wiki","/wiki")
            .addField(":mouse_three_button: Pour aller voter","/vote")
            .addField(":moneybag: Pour avoir accès à la boutique","/boutique")
            .addField(":earth_americas: Pour avoir accès à la dynmap","/dynmap")
            .addField(":joystick: Pour obtenir l'ip du serveur","/ip")
            .addField(":robot: Pour obtenir le lien du github","/github")
            .setColor("0x2ecc71")
   
        message.channel.send(embed)
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
                    var embed = new Discord.RichEmbed()
                        .setTitle(args[0])
                        .setFooter("Réagissez selon votre choix !")
                        .setColor([255,0,0])
                        .setAuthor("Sondage par "+message.author.username, message.author.avatarURL);
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
    else if(message.content === "/chris1"){
        let voiceChannel = message.member.voiceChannel;
        if(!voiceChannel){
            return message.reply("vous devez être dans un salon vocal !");
        }
        else{
            voiceChannel.join().then(function (connection) {
            connection.playFile('./ressources/sounds/Morceau_One.mp3')
            })
        }
        
    }
    else if(message.content === "/chris2"){
        let voiceChannel = message.member.voiceChannel;
        if(!voiceChannel){
            return message.reply("vous devez être dans un salon vocal !");
        }
        else{
            voiceChannel.join().then(function (connection) {
            connection.playFile('./ressources/sounds/Morceau_Two.mp3')
            })
        }
        
    }
    else if(message.content.startsWith('/play') || message.content.startsWith('/p ')){
        if(message.content.startsWith('/play')){
          var url = message.content.slice(6);  
        }
        else if(message.content.startsWith('/p ')){
            var url = message.content.slice(3); 
        }
        let voiceChannel = message.member.voiceChannel;
        if(!voiceChannel){
            return message.reply("vous devez être dans un salon vocal !");
        }
        else{
            voiceChannel.join().then(function (connection) {
            connection.playStream(ytdl(url, {filter: "audioonly"}));
            })
        }
    }
    else if(message.content.startsWith('/s')){
        var args = message.content.slice(3);
        yts(args, function(err, r){
            if(err) throw err;

            const videos = r.videos;
            message.channel.send(videos[0].title+" -- "+videos[0].url)
        })
    }
   

        })


    bot.on("guildMemberAdd", (member) => {
        if(member.user.username.toLowerCase().includes("discord.gg")){
            member.ban();
            bot.channels.get("644156102690209820").lastMessage.delete()
            bot.channels.get("624587022660665355").send("*BAN DE L'UTILISATEUR: <@"+member.user.id+">*");
        }
        else{
        const guild = member.guild;
        const defaultChannel = guild.channels.find(channel => channel.id === '644156102690209825');
        defaultChannel.send("Bienvenue <@"+member.id+"> !")
        defaultChannel.send("Pour avoir accès à tous le serveur merci de mettre un :thumbsup: sous le <#614482156001034270>")
        }
    });

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
                bot.channels.get("710089322111565874").send("*Idée du Jour n°"+actual+" proposée par* <@"+_author+">\n\n**"+_message+"**");
                bot.msgs ["actual"]= actual+1;
                fs.writeFile("./ressources/json/ideas.json", JSON.stringify(bot.msgs, null, 4), err =>{
                            if(err) throw err;
                         });
            }
        }
    }, 60000);




bot.login($discord_token)