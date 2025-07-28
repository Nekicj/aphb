export const prerender = false;

import * as Sentry from "@sentry/astro";
import type { APIRoute } from "astro";
import { db } from "~/db";
import { teams } from "~/db/schema";
import { sendAfterRegister } from "~/lib/resend/register";

function makeErrorMessageHumanReadable(error: string) {
    const matches = /Key \(([^)]+)\)=\(([^)]+)\) already exists/.exec(error);
    if (matches && matches.length === 3) {
        const key = matches[1].replace(/_/g, " ");
        const value = matches[2];
        return `The ${key} '${value}' is already in use. Please choose a different ${key}.`;
    }
    return "An error occurred. Please try again.";
}

export const POST: APIRoute = async ({ request, redirect }) => {
    if (request.headers.get("Content-Type") === "application/json") {
        const data = await request.json();

        try {
            await db.insert(teams).values({ ...data, team: data.teamName });

            await sendAfterRegister({
                lang: data.language,
                leaderEmail: data.leaderEmail,
                participantsEmail: [
                    data.captainEmail,
                    data.member1Email,
                    data.member2Email,
                ],
                team: data.teamName,
            });

            const homepageUrl = new URL("/", request.url);
            homepageUrl.searchParams.set("status", "registered");

            return new Response("", { status: 200 })
        } catch (e: any) {
            Sentry.captureException(e);
            return new Response(JSON.stringify({
                message: makeErrorMessageHumanReadable(e?.detail)
            }), { status: 403 })
        }
    }

    return new Response(null, { status: 400 });

}
