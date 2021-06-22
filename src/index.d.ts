import { ApplicationCommandData, Client, ClientOptions, Collection } from "discord.js"
import { SqliteDatabase } from "sqlite_master.db"
import { ColumnData } from "sqlite_master.db/src/util/Constants"
import CommandAdapter from "./structures/CommandAdapter"
import { Commands } from "./util/Constants"

declare type Types = "NUMBER" | "ANY" | "BOOLEAN" | "NONE" | "STRING"

declare type CommandTypes = "basicCommand" | "readyCommand" | "slashCommand" | "buttonCommand"

declare type ResolveTypes = "MEMBER" |
    "TIME" |
    "GUILD" | 
    "USER" | 
    "REACTION" | 
    "MESSAGE" | 
    "CHANNEL" |
    "NUMBER" | 
    "STRING" | 
    "ROLE" | 
    "BOOLEAN"

declare type BDscriptErrors = "INVALID_COMMAND_TYPE" | "INVALID_EVENT_TYPE" | "EVENT_ALREADY_REGISTERED" |
    "SYNTAX_ERROR" | "SLASH_COMMAND_ALREADY_EXISTS"

declare type EventTypes = "onReady" | "onMessage" | "onInteraction"

interface BotOptions {
    token?: string
    prefix: string[] | string
    client?: ClientOptions 
    databasePath?: string 
}

export class CommandManager {
    bot: Bot

    constructor(bot: Bot)

    public load(path: string): this
    public refresh(): this 
}

interface CommandData {
    name?: string
    type: CommandTypes
    PATH_TO_FILE?: string 
    code: string 
    aliases?: Array<string>
}
export class Bot {
    events: EventTypes[]
    manager: CommandManager
    client: Client 
    db: SqliteDatabase
    variables: ColumnData[]
    commands: Commands
    options: BotOptions
    slash_commands: Collection<string, ApplicationCommandData>
    
    constructor(options: BotOptions)

    public login(token?: string): void

    private _dispatchCommands()

    private _validateOptions(options: BotOptions)

    public command(data: CommandData): CommandAdapter; 

    public variable(data: ColumnData | ColumnData[]): this; 

    public createSlashCommandData(data: ApplicationCommandData): this 

    public event(data: EventTypes | EventTypes[]): this; 
}