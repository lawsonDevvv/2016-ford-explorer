import { ApplyOptions } from "@sapphire/decorators";
import { PreconditionOptions, Precondition, ChatInputCommand } from "@sapphire/framework";
import { ChatInputCommandInteraction, GuildMemberRoleManager } from "discord.js";

@ApplyOptions<PreconditionOptions>({
    name: "HighRank",
})
export class HighRankPrecondition extends Precondition {
    public chatInputRun(interaction: ChatInputCommandInteraction, command: ChatInputCommand, _context: Precondition.Context): Precondition.Result {
        const roleManager = interaction.member?.roles as GuildMemberRoleManager;
        //  Ternary expression that checks for the Founder/CEO or Community Manager roles on a user
        return roleManager.cache.has("1200885193045717012") /* Founder/CEO */ || roleManager.cache.has("1272386008033263699") /* Community Manager */
            ? this.ok()
            : this.error({message: `User tried to run /${command.name}`})
        ;
    }
}

declare module "@sapphire/framework" {
    interface Preconditions {
        HighRank: never;
    }
}