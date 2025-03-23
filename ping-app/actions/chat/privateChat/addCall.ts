"use server"

import { db } from "@/lib/db";
import { CallType } from "@prisma/client";

export async function makeCall(callerId: string, receiverId: string, callType: CallType) {
    return await db.callHistory.create({
        data: {
            callerId,
            receiverId,
            callType,
            callStatus: "OUTGOING",
            duration: "0"
        }
    })
}