export const prerender = false;

import * as Sentry from "@sentry/astro";
import type { APIRoute } from "astro";
import { db } from "~/db";
import { parentConsents } from "~/db/schema";

export const POST: APIRoute = async ({ request }) => {
    if (request.headers.get("Content-Type") !== "application/json") {
        return new Response(null, { status: 400 });
    }

    const data = await request.json();

    try {
        await db.insert(parentConsents).values({
            childIdentifier: data.childIdentifier,
            parentName: data.parentName,
            parentEmail: data.parentEmail,
            parentPhone: data.parentPhone,
            isRepresentative: data.isRepresentative ?? false,
            poaNumber: data.poaNumber ?? null,
            lang: data.lang,
        });

        return new Response("", { status: 200 });
    } catch (e: any) {
        console.error("Parent consent error:", e);
        Sentry.captureException(e);
        return new Response(JSON.stringify({ message: "Ошибка при сохранении. Попробуйте позже." }), { status: 500 });
    }
};