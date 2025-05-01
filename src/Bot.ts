import { ActivityType, type Message } from "discord.js";
import { LawsonClient } from "./lib/LawsonClient";
import { PrismaClient } from "@prisma/client";
export const prisma: PrismaClient = new PrismaClient();
export const snipes = new Map<string, Message>();
export const editSnipes = new Map<string, Message[]>();
import "reflect-metadata";
import "@sapphire/plugin-logger/register";
import * as colorette from "colorette";
import { config } from "dotenv-cra";
import { inspect } from "util";
import * as noblox from 'noblox.js';

export const client = new LawsonClient();

process.env.NODE_ENV ??= "development";

config();

// Set default inspection depth
inspect.defaultOptions.depth = 1;

colorette.createColors({ useColor: true });

(async function main() {
    try {
        client.logger.info("Hitting the ignition...");

        await prisma.$connect();

        client.logger.info("Connected to database server.");

        const user = await noblox.setCookie(process.env.ROBLOX_COOKIE ?? "0");
        client.logger.info(`Logged into the ROBLOX API as ${user.name}(${user.id}).`);

        scheduleJob('Purge game logs', '* * 0 * *', async () => {
            const channel = await client.channels.fetch('1366276797137682547');
            if (!channel) return client.logger.error('Could not purge live logs, channel does not exist or I cannot see it');
            if (!(channel instanceof TextChannel)) return client.logger.error('Could not purge live logs, channel is not a TextChannel');

            await channel.bulkDelete(150);
            return client.logger.info('Purged live logs');
        })

        await client.login(process.env.TOKEN ?? "0");

        client.user?.setActivity({
            name: "lawson.nyc",
            type: ActivityType.Listening,
        });

        client.logger.info("Vroom vroom, bitch..");
        client.logger.info(`Loaded ${client.stores.size} stores.`);
    } catch (error) {
        client.logger.fatal(error);
        process.exit(1);
    }
})();