import {ChatInputCommand, Precondition, PreconditionOptions} from "@sapphire/framework";
import {ApplyOptions} from "@sapphire/decorators";
import {ChatInputCommandInteraction, GuildMemberRoleManager} from "discord.js";

@ApplyOptions<PreconditionOptions>({
    name: "Developer"
})
export default class extends Precondition {
    public chatInputRun(interaction: ChatInputCommandInteraction, command: ChatInputCommand, _context: Precondition.Context): Precondition.Result {
        return (interaction.member?.roles as GuildMemberRoleManager).cache.has("1213277947780407366")
            ? this.ok()
            : this.error({message: `User tried to run /${command.name}`})
            ;
    }
}

declare module "@sapphire/framework" {
    interface Preconditions {
        Developer: never
    }
}