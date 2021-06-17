import { Client, ClientOptions } from "discord.js"
import { CommandData, Commands } from "./util/Constants"

declare type Types = "NUMBER" | "ANY" | "BOOLEAN" | "NONE" | "STRING"

declare type CommandTypes = "basicCommand" | "readyCommand"

declare type BDscriptErrors = "INVALID_COMMAND_TYPE" | "INVALID_EVENT_TYPE" | "EVENT_ALREADY_REGISTERED"

declare type EventTypes = "onReady" | "onMessage"

interface BotOptions {
    token?: string
    prefix: string[] | string; 
    client?: ClientOptions
}

export class Bot {
    events: EventTypes[];
    client: Client
    commands: Commands; 
    options: BotOptions;
    
    constructor(options: BotOptions)

    public login(token?: string)

    private _dispatchCommands()

    private _validateOptions(options: BotOptions)

    public command(data: CommandData): this; 

    public event(data: EventTypes | EventTypes[]): this; 
}