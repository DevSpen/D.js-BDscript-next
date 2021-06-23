import { AudioResource, PlayerSubscription, VoiceConnection } from "@discordjs/voice"
import { ApplicationCommandData, Client, ClientOptions, Collection, Status } from "discord.js"
import { SqliteDatabase } from "sqlite_master.db"
import { ColumnData } from "sqlite_master.db/src/util/Constants"
import CommandAdapter from "./structures/CommandAdapter"
import { Commands, StatusData, TrackData, VoiceData } from "./util/Constants"

declare type Types = "NUMBER" | "ANY" | "BOOLEAN" | "NONE" | "STRING"

declare type CommandTypes = "basicCommand" | "readyCommand" | "slashCommand" | "buttonCommand" | "musicEndCommand" | "musicStartCommand"

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

declare type EventTypes = "onReady" | "onMessage" | "onInteraction" | "onMusicStart" | "onMusicEnd"

export class StatusManager {
    bot: Bot
    current: number
    looping: boolean
    status: StatusData[]

    constructor(bot: Bot)

    public start(): boolean
    private cycle(): void 
    public add(status: StatusData | StatusData[]): this 
}


interface BotOptions {
    token?: string
    prefix: string[] | string
    client?: ClientOptions 
    databasePath?: string,
    debug: "LOG" | "NONE"
}

export class AudioManager {
    bot: Bot
    guilds: Collection<string, VoiceData>

    constructor(bot: Bot) 

    public queue(tracks: TrackData | TrackData[]): Promise<boolean | undefined | number> 
    public play(guildID: string): Promise<boolean | undefined | number> 
    public leaveVoice(guildID: string): boolean | undefined
    public joinVoice(guildID: string): ?VoiceConnection 
    public subscribe(guildID: string): PlayerSubscription

    private add(target: Object, source: Object): Object
}

export class Track {
    data: TrackData

    constructor(data: TrackData)

    public onFinish(guildID: string): void 
    public onStart(guildID: string): void
    public createAudioResource(url: string, options: any): Promise<AudioResource<this>>
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
    audio: AudioManager
    status: StatusManager
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