import { Prisma } from "@prisma/client";
import {prisma} from "../../Bot";

export default async (id: number, data: Prisma.CaseUpdateInput) => {
    return prisma.case.update({
        where: { id },
        data: data
    });
}