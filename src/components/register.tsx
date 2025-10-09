

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { cn } from "~/utils/cn";
import { getLangFromUrl, useTranslations } from "~/utils/i18n";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./atoms/form";
import { Input } from "./atoms/input";
import { Label } from "./atoms/label";
import { TabBar } from "./atoms/tab-bar";
import { TooltipForm } from "./atoms/tooltip";


// Phone number formatting function
const formatPhoneNumber = (phone: string): string => {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // If starts with 8, replace with +7
    if (digits.startsWith('8') && digits.length === 11) {
        return '+7' + digits.slice(1);
    }
    
    // If starts with 7, add +
    if (digits.startsWith('7') && digits.length === 11) {
        return '+' + digits;
    }
    
    // If already formatted correctly
    if (digits.startsWith('77') && digits.length === 11) {
        return '+' + digits;
    }
    
    return phone; // Return as is if can't format
};

// Dynamic grade validation based on league
const createGradeSchema = (league: "junior" | "senior") => {
    if (league === "junior") {
        return z.coerce.number().min(5).max(9);
    } else {
        return z.coerce.number().min(5).max(13);
    }
};

export const teamSchema = z.object({
    teamName: z
        .string()
        .min(1, "Название команды обязательно")
        .regex(/^[a-zA-Z0-9\s]+$/, "Только латинские буквы, цифры и пробелы")
        .max(20, "Максимум 20 символов"),
    league: z.enum(["junior", "senior"]).default("junior"),
    language: z.enum(["ru", "kz"]).default("ru"),
    leaderName: z.string().min(1, "Имя руководителя обязательно"),
    leaderEmail: z.string().email("Неверный формат email"),
    leaderPhone: z.string().min(1, "Телефон обязателен").transform(formatPhoneNumber),
    captainName: z.string().min(1, "Имя капитана обязательно"),
    captainSchool: z.string().min(1, "Школа капитана обязательна"),
    captainGrade: z.coerce.number().min(5).max(13),
    captainEmail: z.string().email("Неверный формат email"),
    captainPhone: z.string().min(1, "Телефон обязателен").transform(formatPhoneNumber),
    member1Name: z.string().min(1, "Имя участника обязательно"),
    member1School: z.string().min(1, "Школа участника обязательна"),
    member1Grade: z.coerce.number().min(5).max(13),
    member1Email: z.string().email("Неверный формат email"),
    member1Phone: z.string().min(1, "Телефон обязателен").transform(formatPhoneNumber),
    member2Name: z.string().min(1, "Имя участника обязательно"),
    member2School: z.string().min(1, "Школа участника обязательна"),
    member2Grade: z.coerce.number().min(5).max(13),
    member2Email: z.string().email("Неверный формат email"),
    member2Phone: z.string().min(1, "Телефон обязателен").transform(formatPhoneNumber),
    member3Name: z.string().optional(),
    member3School: z.string().optional(),
    member3Grade: z.union([z.coerce.number().min(5).max(13), z.nan()]).optional(),
    member3Email: z.string().email("Неверный формат email").optional().or(z.literal("")),
    member3Phone: z.string().optional().transform((phone) => phone ? formatPhoneNumber(phone) : phone),
}).refine((data) => {
    // Validate grades based on league
    const maxGrade = data.league === "junior" ? 9 : 13;
    const minGrade = 5;
    
    const grades = [data.captainGrade, data.member1Grade, data.member2Grade];
    if (data.member3Grade && !isNaN(data.member3Grade)) {
        grades.push(data.member3Grade);
    }
    
    for (const grade of grades) {
        if (grade < minGrade || grade > maxGrade) {
            return false;
        }
    }
    return true;
}, {
    message: "Класс не соответствует выбранной лиге",
    path: ["captainGrade"]
});

export type TeamSchema = z.infer<typeof teamSchema>;

// Emergency Modal Component
const EmergencyModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-red-600">Ошибка регистрации</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>
                <p className="text-gray-700 mb-4">
                    Произошла неожиданная ошибка. Пожалуйста, свяжитесь с нами для решения проблемы.
                </p>
                <div className="flex flex-col gap-2">
                    <a 
                        href="mailto:info@aphb.kz" 
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center"
                    >
                        Написать на info@aphb.kz
                    </a>
                    <button 
                        onClick={onClose}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
};

export const RegisterForm = ({
    lang,
}: {
    lang: ReturnType<typeof getLangFromUrl>;
}) => {
    const t = useTranslations('apply', lang);
    const [hasAdditionalMember, setHasAdditionalMember] = useState(false)
    const [loading, setLoading] = useState(false)
    const [personalDataChecked, setPersonalDataChecked] = useState(false)
    const [showEmergencyModal, setShowEmergencyModal] = useState(false)
    
    const form = useForm<TeamSchema>({
        resolver: zodResolver(teamSchema),
    });
    const registrationCloseDate = new Date("2025-10-19T23:59:00+05:00");
    
    const handleSubmit = async (data: TeamSchema) => {
        // reload the page if the registration is closed
        if (new Date() > registrationCloseDate) {
            location.reload()
        }
        setLoading(true)
        
        try {
            const res = await fetch("/api/form.json", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            if (res.ok) {
                toast.success(`Спасибо за вашу заявку. Ваша команда успешно зарегистрирована на отборочный этап APhB 2025!`, { duration: 100000 })
            } else {
                const errorData = await res.json()
                const errorMessage = errorData.message || "Неизвестная ошибка";
                
                // Try to identify which field has the error
                if (errorMessage.includes("team name") || errorMessage.includes("teamName")) {
                    form.setError("teamName", { message: errorMessage });
                } else if (errorMessage.includes("email")) {
                    // Try to identify which email field
                    if (errorMessage.includes("leader")) {
                        form.setError("leaderEmail", { message: errorMessage });
                    } else if (errorMessage.includes("captain")) {
                        form.setError("captainEmail", { message: errorMessage });
                    } else if (errorMessage.includes("member1")) {
                        form.setError("member1Email", { message: errorMessage });
                    } else if (errorMessage.includes("member2")) {
                        form.setError("member2Email", { message: errorMessage });
                    } else if (errorMessage.includes("member3")) {
                        form.setError("member3Email", { message: errorMessage });
                    } else {
                        // Generic email error - set on leader email as primary
                        form.setError("leaderEmail", { message: errorMessage });
                    }
                } else if (errorMessage.includes("phone")) {
                    // Try to identify which phone field
                    if (errorMessage.includes("leader")) {
                        form.setError("leaderPhone", { message: errorMessage });
                    } else if (errorMessage.includes("captain")) {
                        form.setError("captainPhone", { message: errorMessage });
                    } else if (errorMessage.includes("member1")) {
                        form.setError("member1Phone", { message: errorMessage });
                    } else if (errorMessage.includes("member2")) {
                        form.setError("member2Phone", { message: errorMessage });
                    } else if (errorMessage.includes("member3")) {
                        form.setError("member3Phone", { message: errorMessage });
                    } else {
                        // Generic phone error - set on leader phone as primary
                        form.setError("leaderPhone", { message: errorMessage });
                    }
                } else {
                    // Unknown error - show emergency modal
                    setShowEmergencyModal(true);
                }
            }
        } catch (error) {
            // Network or other unexpected error
            setShowEmergencyModal(true);
        }

        setLoading(false)
    };

    if (new Date() > registrationCloseDate) {
        return <div className="col-span-4 flex gap-4 flex-col">
            <div className="text-primary-500 font-bold text-6xl uppercase">{t("registrationClosed")}</div>
            <div className="text-primary-500 font-bold text-3xl uppercase">{t("seeYouSoon")}</div>
        </div>
    }

    return (

        <Form {...form}>
            <form
                className="flex flex-col gap-4 lg:col-span-6 col-span-4 lg:col-start-7 mb-6 md:px-5 md:py-2 md:mt-3 relative"
                onSubmit={form.handleSubmit(handleSubmit)}
            >
                <FormField
                    control={form.control}
                    name="teamName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="mb-1">{t("team.name")}</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder={t("team.name") + " (только на латинице)"}
                                    maxLength={20}
                                    pattern="[a-zA-z0-9 ]+"
                                    className="md:h-16 h-14 md:p-5 border-neutral-300 rounded-lg lg:text-lg placeholder:text-neutral-400"
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />


                <div className="flex flex-col lg:flex-row gap-5 flex-wrap">
                    <div className="flex flex-col gap-1 min-w-0">
                        <Label>{t("league.label")}</Label>
                        <TabBar

                            tabs={[
                                { label: `${t("league.junior")}, 5-9`, value: "junior" },
                                { label: `${t("league.senior")}, 5-13`, value: "senior" },
                            ]}
                            onChange={(value) =>
                                form.setValue("league", value as "junior" | "senior")
                            }
                        />
                    </div>

                    <div className="flex flex-col gap-1 min-w-0">
                        <Label>{t("language.label")}</Label>
                        <TabBar
                            tabs={[
                                { label: t("language.ru"), value: "ru" },
                                { label: t("language.kz"), value: "kz" },
                            ]}
                            onChange={(value) =>
                                form.setValue("language", value as "ru" | "kz")
                            }
                        />
                    </div>

                    <p className="text-sm font-medium text-destructive text-red-300">
                        {form.formState.errors.league?.message}
                    </p>
                    <p className="text-sm font-medium text-destructive text-red-300">
                        {form.formState.errors.language?.message}
                    </p>
                </div>

                <MemberForm prefix="leader" required={true} tooltip={t("leaderInfo")} lang={lang} />
                <MemberForm prefix="captain" required={true} tooltip={t("captainInfo")} lang={lang} />

                {
                    Array(3)
                        .fill(undefined)
                        .map((_, index) => (
                            <MemberForm key={`member${index + 1 as 1 | 2 | 3}`} prefix={`member${index + 1 as 1 | 2 | 3}`} lang={lang} required={index !== 2} className={`${index == 2 && !hasAdditionalMember && "hidden"}`} />
                        ))
                }
                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        checked={personalDataChecked}
                        onChange={(e) => setPersonalDataChecked(e.target.checked)}
                        className="w-4 h-4"
                    />
                    <Label className="ml-2"><div dangerouslySetInnerHTML={{ __html: t("personalData") }} /></Label>
                </div>
                <button
                    className={cn("border border-neutral-300 bg-white text-lg rounded-lg px-4 py-2 lg:grow-0 grow", hasAdditionalMember && "hidden")}
                    type="button"
                    onClick={() => setHasAdditionalMember(true)}
                >
                    Add More members
                </button>
                <div className="flex justify-end">
                    <button
                        className="bg-black text-white text-lg rounded-lg px-4 py-2 lg:grow-0 grow flex gap-1 items-center disabled:text-white/50"
                        type="submit"
                        disabled={!personalDataChecked || loading}
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t("register.team")}
                    </button>
                </div>
            </form>
            <EmergencyModal 
                isOpen={showEmergencyModal} 
                onClose={() => setShowEmergencyModal(false)} 
            />
        </Form>
    );
};


interface MemberFormProps {
    prefix: `member${1 | 2 | 3}` | "captain" | "leader";
    className?: string;
    required?: boolean;
    tooltip?: string;
    lang: ReturnType<typeof getLangFromUrl>;

}

const MemberForm = ({ lang, prefix, className, required, tooltip }: MemberFormProps) => {
    const { control, watch } = useFormContext<TeamSchema>()
    const t = useTranslations("apply", lang);
    const league = watch("league");
    
    // Generate grade options based on league
    const getGradeOptions = () => {
        const minGrade = 5;
        const maxGrade = league === "junior" ? 9 : 13;
        const grades = [];
        for (let i = minGrade; i <= maxGrade; i++) {
            grades.push(i);
        }
        return grades;
    };
    return (
        <div className={cn("flex flex-col gap-4 my-3", className)} >
            <FormField
                control={control}
                name={`${prefix}Name`}
                render={({ field }) => (
                    <FormItem>
                        <Label className="mb-1 flex gap-1">
                            {t(`${prefix}Name`)}
                            {tooltip && <TooltipForm content={tooltip} />}
                        </Label>
                        <FormControl>
                            <Input
                                placeholder={t(`${prefix}Name`) +
                                    " (ex: Константин Константинов Константинопольский)"}
                                className="md:h-16 h-14 md:p-5 border-neutral-300 rounded-lg lg:text-lg placeholder:text-neutral-400"

                                {...field}
                            />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name={`${prefix}Email`}
                render={({ field }) => (
                    <FormItem>
                        <Label className="mb-1">
                            {t(`${prefix}Email`)}
                        </Label>
                        <FormControl>
                            <Input
                                placeholder={t(`${prefix}Email`)}
                                className="md:h-16 h-14 md:p-5 border-neutral-300 rounded-lg lg:text-lg placeholder:text-neutral-400"
                                {...field}
                            />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name={`${prefix}Phone`}
                render={({ field }) => (
                    <FormItem>
                        <Label className="mb-1">
                            {t(`${prefix}Phone`)}
                        </Label>
                        <FormControl>
                            <Input
                                placeholder="+77752146221"
                                className="md:h-16 h-14 md:p-5 border-neutral-300 rounded-lg lg:text-lg placeholder:text-neutral-400"
                                type="tel"
                                {...field}
                                onChange={(e) => {
                                    const formatted = formatPhoneNumber(e.target.value);
                                    field.onChange(formatted);
                                }}
                            />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                )}
            />


            {
                prefix !== "leader" && (
                    <>

                        <FormField
                            control={control}
                            name={`${prefix}Grade`}
                            render={({ field }) => (
                                <FormItem>
                                    <Label className="mb-1">
                                        {t(`${prefix}Grade`)}
                                    </Label>
                                    <FormControl>
                                        <select
                                            className="md:h-16 h-14 md:p-5 border-neutral-300 rounded-lg lg:text-lg placeholder:text-neutral-400 w-full border"
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        >
                                            <option value="">Выберите класс</option>
                                            {getGradeOptions().map((grade) => (
                                                <option key={grade} value={grade}>
                                                    {grade} класс
                                                </option>
                                            ))}
                                        </select>
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name={`${prefix}School`}
                            render={({ field }) => (
                                <FormItem>
                                    <Label className="mb-1">
                                        {t(`${prefix}School`)}
                                    </Label>
                                    <FormControl>
                                        <Input
                                            placeholder={t(`${prefix}School`) + " (ex: НИШ ФМН г. Тараз)"}
                                            className="md:h-16 h-14 md:p-5 border-neutral-300 rounded-lg lg:text-lg placeholder:text-neutral-400"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                    </>
                )
            }
        </div>
    )
}
