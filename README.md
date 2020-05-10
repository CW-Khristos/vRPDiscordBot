# vRP Discord Bot af oMarkez

# Installation:
1. Make a folder and call it whatever you want on your machine.
2. Copy the files from this repository to the folder.
3. Open a CMD and write "CD path-to-folder", ie you should CD where you have put the folder. eg "cd C:\vRPDiscordBot"
4. If you do not already have npm & nodejs; https://nodejs.org/en/ , then install it.
5. npm install discord.js
6. npm install mysql
7. Edit config.json; you should change the following values under "info" :

   "user", "password", and "db" for the "database" section
   
   "prefix" : "o" (if desired), "token" : "discordtokenhere" to your Discord Bot's Token, "lang" : "dan" ("dan" / "eng"; if desired)

        "info": {
            "database": {
                "host": "127.0.0.1",
                "user": "your-database-user",
                "password": "your-database-password",
                "database": "your-database"
            },
            "prefix": "your-desired-prefix",
            "token": "your-discord-bot-token-here",
            "lang": "your-desired-lang"
            },
    
  8. Done, open a CMD, CD where you have the folder, type "node main.js" and press enter
  
# Credits:
  oMarkez#6666 & Naelith#2639 & Khristos#8436
