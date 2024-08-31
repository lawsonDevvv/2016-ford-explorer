import { ActivityType, type Message } from "discord.js";
import { LawsonClient } from "./lib/LawsonClient";
import { PrismaClient } from "@prisma/client";
export const prisma: PrismaClient = new PrismaClient();
export const snipes = new Map<string, Message>();
export const editsnipes = new Map<string, Message[]>();
import "reflect-metadata";
import "@sapphire/plugin-logger/register";
import * as colorette from "colorette";
import { config } from "dotenv-cra";
import { inspect } from "util";
import * as noblox from 'noblox.js'

const client = new LawsonClient();

process.env.NODE_ENV ??= "development";

config();

// Set default inspection depth
inspect.defaultOptions.depth = 1;

colorette.createColors({ useColor: true });

async function main() {
  try {
    client.logger.info("Hitting the ignition...");
    prisma.$connect().then(_ => {
      client.logger.info("Connected to database server.")
    });
    await noblox.setCookie(process.env.ROBLOX_COOKIE ?? "0").then(_ => {
      client.logger.info(`Logged into the ROBLOX API as ${_.name}(${_.id})`);
    })
    await client.login(process.env.TOKEN ?? "0");
    client.user?.setActivity({
      name: "lawson.nyc",
      type: ActivityType.Listening
    });
    client.logger.info("Vroom vroom, bitch..");

    client.logger.info(`Loaded ${client.stores.size} stores.`);
  } catch (error) {
    client.logger.fatal(error);
  }
}

main();
