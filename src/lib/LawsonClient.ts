import { SapphireClient } from "@sapphire/framework";

export class LawsonClient extends SapphireClient {
    public async login(token: string) {
        return super.login(token);
    }
  
    constructor() {
        super({
            intents: [
                "Guilds",
                "GuildMembers",
                "GuildBans",
                "GuildEmojisAndStickers",
                "GuildVoiceStates",
                "GuildMessages",
                "GuildMessageReactions",
                "DirectMessages",
                "DirectMessageReactions",
                "MessageContent"
            ],
        });
    }
  }