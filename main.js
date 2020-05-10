/*              
  /     \  _____     __| _/  ____   \______   \ ___.__.   ____    /     \  _____   _______ |  | __  ____  ________
 /  \ /  \ \__  \   / __ | _/ __ \   |    |  _/<   |  |  /  _ \  /  \ /  \ \__  \  \_  __ \|  |/ /_/ __ \ \___   /
/    Y    \ / __ \_/ /_/ | \  ___/   |    |   \ \___  | (  <_> )/    Y    \ / __ \_ |  | \/|    < \  ___/  /    / 
\____|__  /(____  /\____ |  \___  >  |______  / / ____|  \____/ \____|__  /(____  / |__|   |__|_ \ \___  >/_____ \
        \/      \/      \/      \/          \/  \/                      \/      \/              \/     \/       \/
------------------------CREDITS------------------------
--   Copyright 2019 ©oMarkez. All rights reserved    --
-------------------------------------------------------
*/
/* DEPENDENCIES */
const Discord = require("discord.js");
const mysql = require("mysql");
const config = require("./config.json");
const bot = new Discord.Client();
const token = config.info.token
const prefix = config.info.prefix
const lang = config.info.lang

bot.login(token)

/* MYSQL CONNECTION */
var connection = mysql.createConnection({
    host     : config.info.database.host,
    user     : config.info.database.user,
    password : config.info.database.password,
    database : config.info.database.database
});
connection.connect();

/* COMMAND : SQL QUERY TYPES */
types = {
    "identity" : "SELECT * FROM vrp_user_identities WHERE user_id = ",
    "moneys" : "SELECT * FROM vrp_user_moneys WHERE user_id = ",
    "userdata" : "SELECT * FROM vrp_user_data WHERE user_id =",
    "biler" : "SELECT * FROM vrp_user_vehicles WHERE user_id =",
    "server" : "SELECT * FROM vrp_srv_data"
}

/* ADMIN COLLECTION */
admins = {
    "discordidhere" : "namehere"
}

/* REPLY TO NON-ADMIN */
function noAdmin(message, userid){
    const returnData = {
        color: 0x1207eb,
        author: {
            name: 'Server Statistik',
            icon_url: 'https://cdn.discordapp.com/avatars/264759509820506112/bc7c1c3908c4f794d0eeb4f596bccba0.png'
        },
        description: '',
        fields: [
            {
                name: "Access : ",
                value: "NO ADMIN",
            }
        ],
        timestamp: new Date(),
        footer: {
            text: config[lang].tag
        },
    };
    message.reply({embed: returnData})
}

/* QUERY MYSQL DATA */
function getData(type, userid, cb){
    if(types[type]){
        var sql = types[type]
        if (type != "server"){
            connection.query(sql + userid, function(err, result, fields){
            if(err) throw err;
            cb(result)
          })
        } else if (type == "server"){
            connection.query(sql, function(err, result, fields){
              if(err) throw err;
              cb(result)
            })
        }
    }
}

/* QUERY USER STATS */
function returnData(message,id){
    connection.query("SELECT * FROM vrp_user_ids WHERE identifier LIKE '%" + id.toString() + "';", function(error, result, fields){
        if(error) throw error;
        if(result[0]){
            var userid = result[0].user_id
            getData("moneys", userid, function(moneys){
                getData("identity", userid, function(identity){
                    getData("userdata", userid, function(usrdata){
                        var parsedData = JSON.parse(usrdata[0].dvalue)
                        const returnData = {
                            color: 0x1207eb,
                            author: {
                                name: config[lang].title,
                                icon_url: 'https://cdn.discordapp.com/avatars/264759509820506112/bc7c1c3908c4f794d0eeb4f596bccba0.png'
                            },
                            description: '',
                            fields: [
                                {
                                    name: config[lang].result.stats.name,
                                    value: identity[0].firstname + " " + identity[0].name,
                                },
                                {
                                    name: config[lang].result.stats.age,
                                    value: identity[0].age,
                                },
                                {
                                    name: config[lang].result.stats.registration,
                                    value: identity[0].registration,
                                },
                                {
                                    name: config[lang].result.stats.phone,
                                    value: identity[0].phone,
                                },
                                {
                                    name: config[lang].result.stats.moneywallet,
                                    value: moneys[0].wallet,
                                },
                                {
                                    name: config[lang].result.stats.moneybank,
                                    value: moneys[0].bank,
                                },
                                {
                                    name: config[lang].result.stats.health,
                                    value: parsedData.health / 2 + "%"
                                },
                                {
                                    name: config[lang].result.stats.drinkandfood,
                                    value: parsedData.thirst.toFixed(2) + "% " + config[lang].result.stats.and + " " + parsedData.hunger.toFixed(2) + "%"
                                },
                            ],
                            timestamp: new Date(),
                            footer: {
                                text: config[lang].tag
                            },
                        };
                        message.reply({embed: returnData})
                    })
                })
            })
        } else {
            message.reply(config[lang].error)
        }
    })
}

/* QUERY USER CARS */
function returnBiler(message, id){
    connection.query("SELECT * FROM vrp_user_ids WHERE identifier LIKE '%" + id.toString() + "';", function(error, result, fields){
        if(error) throw error;
        if(result[0]){
            var userid = result[0].user_id
            getData("biler", userid, function(bilerne){
                const fields = bilerne.map((enbil) => {
                    return {
                        name: enbil.vehicle,
                        value: config[lang].result.cars.type + enbil.veh_type + " \n" + config[lang].result.cars.plate + enbil.vehicle_plate
                    }
                });
                const returnData = {
                    color: 0x1207eb,
                    author: {
                        name: 'Server Statistik',
                        icon_url: 'https://cdn.discordapp.com/avatars/264759509820506112/bc7c1c3908c4f794d0eeb4f596bccba0.png'
                    },
                    description: '',
                    fields: fields,
                    timestamp: new Date(),
                    footer: {
                        text: config[lang].tag
                    },
                };
                message.reply({embed: returnData})

            })
        }
    })
}

/* QUERY USER INVENTORY */
function returnInventory(message, id){
    connection.query("SELECT * FROM vrp_user_ids WHERE identifier LIKE '%" + id.toString() + "';", function(error, result, fields){
        if(error) throw error;
        if(result[0]){
            var userid = result[0].user_id
            getData("userdata", userid, function(data){
                parsedData = JSON.parse(data[0].dvalue)
                var weaponkeys = Object.keys(parsedData.weapons)
                let allWeapons = ""
                for(i = 0; i < weaponkeys.length; i++){
                    var navn = weaponkeys[i].replace("WEAPON_", "")
                    allWeapons = allWeapons + navn[0] + navn.slice(1).toLocaleLowerCase() + " ｜ " + parsedData.weapons[weaponkeys[i]].ammo + "\n"
                }
                var itemKeys = Object.keys(parsedData.inventory)
                let allItems = ""
                for(i = 0; i < itemKeys.length; i++){
                    allItems = allItems + itemKeys[i][0].toUpperCase() + itemKeys[i].slice(1) + " ｜ " + parsedData.inventory[itemKeys[i]].amount + "\n"
                }
                const returnData = {
                    color: 0x1207eb,
                    author: {
                        name: 'Server Statistik',
                        icon_url: 'https://cdn.discordapp.com/avatars/264759509820506112/bc7c1c3908c4f794d0eeb4f596bccba0.png'
                    },
                    description: '',
                    fields: [
                        {
                            name: config[lang].result.inventory.weapons,
                            value: allWeapons
                        },
                        {
                            name: config[lang].result.inventory.items,
                            value: allItems
                        }
                    ],
                    timestamp: new Date(),
                    footer: {
                        text: config[lang].tag
                    },
                };
                message.reply({embed: returnData})
            })
        }
    })
}

/* QUERY SERVER STATUS */
function returnServer(message, id){
    connection.query("SELECT * FROM vrp_srv_data;", function(error, result, fields){
        if(error){
          const returnData = {
              color: 0x1207eb,
              author: {
                  name: 'Server Statistik',
                  icon_url: 'https://cdn.discordapp.com/avatars/264759509820506112/bc7c1c3908c4f794d0eeb4f596bccba0.png'
              },
              description: '',
              fields: [
                  {
                      name: config[lang].result.server.server,
                      value: "Offline"
                  }
              ],
              timestamp: new Date(),
              footer: {
                  text: config[lang].tag
              },
          };
          message.reply({embed: returnData})          
          throw error;
        }
        if(result[0]){
          const returnData = {
              color: 0x1207eb,
              author: {
                  name: 'Server Statistik',
                  icon_url: 'https://cdn.discordapp.com/avatars/264759509820506112/bc7c1c3908c4f794d0eeb4f596bccba0.png'
              },
              description: '',
              fields: [
                  {
                      name: config[lang].result.server.server,
                      value: "Online"
                  }
              ],
              timestamp: new Date(),
              footer: {
                  text: config[lang].tag
              },
          };
          message.reply({embed: returnData})
        }
    })
}

/* WRITE TO BOT CONSOLE */
function writeConsole(message){
    /* ASSIGN DISCORD USER ID */
    if(!message.mentions.users.first()){
        try{
            var userid = message.member.user.id
        }
        catch(e){
        }
    } else{
        try{
          var userid = message.mentions.users.first().id
        }
        catch(e){
        }
    }
    /* USER IS ADMIN */
    if (admins[userid]){
        console.log("Query From : ADMIN : " + admins[userid])
    /* USER IS NOT ADMIN */
    } else{
        console.log("Query From : USER : " + message.member.user.username)
    }
    /* WRITE TO BOT CONSOLE */
    console.log("Message Text : " + message.content)
}

/* BOT EVENTS */
bot.on("ready", () => {
  console.log('Bot is now Connected.')
})

bot.on("message", function(message){
    /* ASSIGN DISCORD USER ID */
    if(!message.mentions.users.first()){
        try{
            var userid = message.member.user.id
        }
        catch(e){
        }
    } else{
        try{
          var userid = message.mentions.users.first().id
        }
        catch(e){
        }
    }
    /* USER IS ADMIN */
    if (admins[userid]){
        /* STATS */
        if(message.content.startsWith(prefix + config[lang].commands.stats)){
            writeConsole(message)
            returnData(message, userid)
        /* CARS */
        } else if(message.content.startsWith(prefix + config[lang].commands.cars)){
            writeConsole(message)
            returnBiler(message, userid)
        /* INVENTORY */
        } else if(message.content.startsWith(prefix + config[lang].commands.inventory)){
            writeConsole(message)
            returnInventory(message, userid)
        /* SERVER */
        } else if(message.content.startsWith(prefix + config[lang].commands.server)){
            writeConsole(message)
            returnServer(message, userid)
        }
    /* USER IS NOT ADMIN */
    } else{
        if(message.content.startsWith(prefix + config[lang].commands.server)){
            writeConsole(message)
            returnServer(message, userid)
        } else if(message.content.startsWith(prefix)){
            writeConsole(message)
            noAdmin(message, userid)
        }
    }
})
