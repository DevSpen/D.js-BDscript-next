# This is the rewrite version of D.js-BDscript #

## Rewrite Status ##
✔️ - Typings <br>
✔️ - Variables <br>
✔️ - Database <br>
❌ - All Functions <br>
❌ - Custom Prefixes <br>
✔️ - Status Manager <br>
✔️ - Slash Command Support <br>
❌ - All Condensed Functions <br>
🛠️ - Button Support <br>
🛠️ - Music Support <br>
✔️ - Command Manager
### Examples (Setting up a bot with eval) ###
```js
const { Bot } = require("d.js-bdscript")

const bot = new Bot({
    prefix: "prefix", //or array of prefixes
    token: "token" //optional, can also be passed to bot.login()
})

bot.command({
    name: "gay",
    type: "basicCommand",
    code: `
    $if[$authorID==$client[owners];
        $eval[$message]
    ;
        No permissions!
    ]`
})

bot.event("onMessage")

bot.login("token")
```

### Using the built-in command manager / handler ###
Supposing our commands are all located in `commands` folder (and sub-folders) and they look as follows:
```js
module.exports = {
    type: "basicCommand",
    name: "ping",
    code: `pong!`
}
```
We will use:
```js
//Loading commands
bot.manager.load("./commands/") 

//Refreshing commands loaded with command manager
//this can go in the command manager folder too.
bot.command({
    type: "basicCommand",
    name: "reload",
    code: `
    $if[$authorID==$client[owners];
        $updateCommands commands were updated!
    ;
        No permissions!
    ]
    `
})
```
### Creating variables and using them ###
This creates 2 variables:
```js
bot.variable([
    {
        name: "coins",
        default: 0,
        type: "INTEGER"
    },
    {
        name: "username",
        type: "TEXT"
    }
])
```
Setting and getting the value right after (you can paste this command in one of your codes):
```
$setVar[coins;15;$authorID;user]
$setVar[username;$user[$authorID;username];$authorID;user]

$getVar[username;$authorID;user] has $getVar[coins;$authorID;user] coins!
```
### Using slash commands ###
We first create the slash command data.
```js
bot.createSlashCommandData({
    name: "test",
    description: "simple test command",
    options: [
        {
            name: "target",
            type: "USER",
            required: false,
            description: "the user to mention!"
        }
    ]
})
```
Now we have to create it on Discord:
```js
//global slash command
bot.command({
    type: "readyCommand",
    code: `
    $createSlashCommand[global;test]
    `
})

//guild slash command
bot.command({
    type: "readyCommand",
    code: `
    $createSlashCommand[123456789012345678;test]
    `
})

//replying to them
bot.command({
    type: "slashCommand",
    code: `$reply hello $if[$slashOption[target]==;;<@$slashOption[target]>]`
})

//be sure to enable the slash command event
//skip this if you already did.
bot.event("onInteraction")
```
### Creating buttons and replying to them ###
Soon...