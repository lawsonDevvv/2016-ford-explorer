import {ChatInputCommand, Precondition, PreconditionOptions} from "@sapphire/framework";
import {ChatInputCommandInteraction, GuildMemberRoleManager} from "discord.js";
import {ApplyOptions} from "@sapphire/decorators";

@ApplyOptions<PreconditionOptions>({
    name: "Staff",
})
export class StaffPrecondition extends Precondition {
    public chatInputRun(interaction: ChatInputCommandInteraction, _command: ChatInputCommand, _context: Precondition.Context): Precondition.Result {
        return (interaction.member?.roles as GuildMemberRoleManager).cache.has("1238455317860323338")
            ? this.ok()
            : this.error({message: `User tried to run /${command.name}`})
        ;
    }
}

declare module "@sapphire/framework" {
    interface Preconditions {
        Staff: never;
    }
}