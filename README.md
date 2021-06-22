# This is the next version after D.js-BDscript v5.0.0 (or v5) #

## Rewrite Status ##
✔️ - Typings <br>
🛠️ - Full Slash Command Support <br>
🛠️ - All Condensed Functions <br>
❌ - Button Support
### Examples ###
```js
const { Bot } = require("d.js-bdscript")

const bot = new Bot({
    prefix: "prefix" //or array of prefixes
    token: "token" //optional, can also be passed to bot.login()
})

bot.command({
    name: "gay",
    type: "basicCommand",
    code: `
    $if[$authorID==YourID;
        $eval[$message]
    ;
        no!
    ]`
})

bot.event("onMessage")

bot.login("token")
```
