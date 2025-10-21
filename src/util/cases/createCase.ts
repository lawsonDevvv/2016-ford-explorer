import {Guild, User} from "discord.js";
import {CaseStatus, CaseType} from '../types/Cases'
import {prisma} from "../../Bot";
import {Case} from "@prisma/client";

export default async (guild: Guild, user: User, staffMember: User, type: CaseType, reason?: string): Promise<Case> => {
    if (type satisfies CaseType) {
        const existingBlacklist = await prisma.case.findFirst({
            where: {
                guild: guild.id,
                user: user.id,
                status: CaseStatus.Open
            }
        });

        if (existingBlacklist?.status === CaseStatus.Open) throw new Error('You cannot blacklist a user twice, that would be silly!');
    }

    return prisma.case.create({
        data: {
            guild: guild.id,
            user: user.id,
            type,
            reason,
            staffMember: staffMember.id
        }
    });
}