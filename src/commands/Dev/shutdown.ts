import {ApplyOptions} from "@sapphire/decorators";
import {ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior} from "@sapphire/framework";
import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {prisma} from "../../Bot";
import { scheduledJobs } from 'node-schedule';

@ApplyOptions<CommandOptions>({
    description: "Shuts down the bot. Will restart you run if process is run via PM2 like a normal person.",
    preconditions: ["Staff"]
})
export default class extends Command {
    public registerApplicationCommands(registry: ApplicationCommandRegistry) {
        const builder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description);

        registry.registerChatInputCommand(builder, {
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite
        });
    }

    public async chatInputRun(interaction: ChatInputCommandInteraction) {
        await interaction.reply('Restarting bot...');

        let dbDisconnected: boolean = false, jobsCanceled: boolean = false;

        /** Database disconnect **/
        try {
            await prisma.$disconnect()
            dbDisconnected = true;
        } catch (err) {
             this.container.logger.error(err);
        }

        /** Cancel all active cron jobs **/
        try {
            for (const job of Object.values(scheduledJobs)) {
                job.cancel();
            }
            jobsCanceled = true;
        } catch (err) {
            this.container.logger.error(err);
        }

        await interaction.editReply(
            `Prisma Disconnect: ${dbDisconnected ? ':thumbsup:' : ':thumbsdown:'}\n` +
            `Cron Jobs Cancelled: ${jobsCanceled ? ':thumbsup:' : 'thumbsdown:'}`
        );

        /** Discord Logout **/
        await this.container.client.destroy();

        /** Graceful exit **/
        process.exit(0);
    }
}
