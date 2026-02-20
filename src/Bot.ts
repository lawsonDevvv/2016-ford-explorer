import {ActivityType, TextChannel, type Message} from "discord.js";
import { LawsonClient } from "./lib/LawsonClient";
import { PrismaClient } from "@prisma/client";
import "reflect-metadata";
import "@sapphire/plugin-logger/register";
import * as colorette from "colorette";
import { config } from "dotenv-cra";
import { inspect } from "util";
import * as noblox from 'noblox.js';
import {AuthenticatedUserData} from "noblox.js";

export const prisma: PrismaClient = new PrismaClient();

export const snipes = new Map<string, Message>();
export const editSnipes = new Map<string, Message[]>();

export const client = new LawsonClient();
export const apiUrl: string = process.env.API_URL && process.env.API_PORT ? `${process.env.API_URL}:${process.env.API_PORT}` : 'http://localhost:3000';
export const headers = { Authorization: process.env.API_KEY }

process.env.NODE_ENV ??= "development";

config();

// Set default inspection depth
inspect.defaultOptions.depth = 1;

colorette.createColors({ useColor: true });

(async function () {
    try {
        client.logger.info("Hitting the ignition...");

        await prisma.$connect();

        client.logger.info("Connected to database server.");
        if (!process.env.API_URL && !process.env.API_PORT) client.logger.warn("Environment variables API_URL and/or API_PORT is/are missing. Using default API URL (http://localhost:3000)");

        await client.login(process.env.TOKEN ?? "0");

        client.user?.setActivity({
            name: "lawson.nyc",
            type: ActivityType.Listening,
        });

        setInterval(async (): Promise<Message<true> | void> => {
            const n: number = Math.floor(Math.random() * 5000001);
            if (n == 6767) {
                const generalChannelId = "1200954798778896465";
                const channel = await client.channels.fetch(generalChannelId) as TextChannel;
                return await channel.send("@everyone hello how are you")
            } else return;
        }, 1000);

        client.logger.info("Vroom vroom, bitch..");
        client.logger.info(`Loaded ${client.stores.size} stores.`);
    } catch (error) {
        client.logger.fatal(error);
        process.exit(1);
    }
})();