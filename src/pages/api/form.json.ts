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
            console.log("Received registration data:", JSON.stringify(data, null, 2));
            
            // Map form data to database schema
            const dbData = {
                team: data.teamName,
                league: data.league,
                language: data.language,
                leaderName: data.leaderName,
                leaderEmail: data.leaderEmail,
                leaderPhone: data.leaderPhone,
                captainName: data.captainName,
                captainSchool: data.captainSchool,
                captainGrade: data.captainGrade,
                captainEmail: data.captainEmail,
                captainPhone: data.captainPhone,
                member1Name: data.member1Name,
                member1School: data.member1School,
                member1Grade: data.member1Grade,
                member1Email: data.member1Email,
                member1Phone: data.member1Phone,
                member2Name: data.member2Name,
                member2School: data.member2School,
                member2Grade: data.member2Grade,
                member2Email: data.member2Email,
                member2Phone: data.member2Phone,
                member3Name: data.member3Name || null,
                member3School: data.member3School || null,
                member3Grade: data.member3Grade || null,
                member3Email: data.member3Email || null,
                member3Phone: data.member3Phone || null,
                captainParentName: data.captainParent?.parentName,
                captainParentEmail: data.captainParent?.parentEmail,
                captainParentPhone: data.captainParent?.parentPhone,
                captainAutoproctorConsent: data.captainParent?.autoproctorConsent ?? false,
                member1ParentName: data.member1Parent?.parentName,
                member1ParentEmail: data.member1Parent?.parentEmail,
                member1ParentPhone: data.member1Parent?.parentPhone,
                member1AutoproctorConsent: data.member1Parent?.autoproctorConsent ?? false,
                member2ParentName: data.member2Parent?.parentName,
                member2ParentEmail: data.member2Parent?.parentEmail,
                member2ParentPhone: data.member2Parent?.parentPhone,
                member2AutoproctorConsent: data.member2Parent?.autoproctorConsent ?? false,
                member3ParentName: data.member3Parent?.parentName || null,
                member3ParentEmail: data.member3Parent?.parentEmail || null,
                member3ParentPhone: data.member3Parent?.parentPhone || null,
                member3AutoproctorConsent: data.member3Parent?.autoproctorConsent ?? null,
            };
            
            console.log("Mapped database data:", JSON.stringify(dbData, null, 2));
            
            await db.insert(teams).values(dbData);

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
            console.error("Registration error:", e);
            Sentry.captureException(e);
            
            // Better error handling
            const errorMessage = e?.detail || e?.message || "An error occurred. Please try again.";
            
            return new Response(JSON.stringify({
                message: makeErrorMessageHumanReadable(errorMessage),
                error: process.env.NODE_ENV === 'development' ? e?.message : undefined
            }), { status: 403 })
        }
    }

    return new Response(null, { status: 400 });

}