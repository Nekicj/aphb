

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

// Transliteration function for team names
const transliterate = (text: string): string => {
    const cyrillicToLatin: { [key: string]: string } = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
        'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
        'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts',
        'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
        'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo', 'Ж': 'Zh',
        'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O',
        'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts',
        'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch', 'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya',
        // Kazakh specific characters
        'ә': 'a', 'ғ': 'gh', 'қ': 'q', 'ң': 'ng', 'ө': 'o', 'ұ': 'u', 'ү': 'u', 'һ': 'h', 'і': 'i',
        'Ә': 'A', 'Ғ': 'Gh', 'Қ': 'Q', 'Ң': 'Ng', 'Ө': 'O', 'Ұ': 'U', 'Ү': 'U', 'Һ': 'H', 'І': 'I'
    };
    
    return text.split('').map(char => cyrillicToLatin[char] || char).join('');
};

// Dynamic grade validation based on league
const createGradeSchema = (league: "junior" | "senior") => {
    if (league === "junior") {
        return z.coerce.number().min(5).max(9);
    } else {
        return z.coerce.number().min(5).max(13);
    }
};

// Create schema with proper error messages based on language
const createTeamSchema = (lang: string) => {
    const messages = {
        ru: {
            teamNameRequired: "Название команды обязательно",
            teamNameTooLong: "Максимум 20 символов",
            nameRequired: "Имя обязательно",
            emailInvalid: "Неверный формат email",
            phoneRequired: "Телефон обязателен",
            schoolRequired: "Школа обязательна",
            gradeRequired: "Выберите класс",
            gradeInvalid: "Класс должен быть числом от 5 до 13",
            gradeNotInLeague: "Класс не соответствует выбранной лиге"
        },
        en: {
            teamNameRequired: "Team name is required",
            teamNameTooLong: "Maximum 20 characters",
            nameRequired: "Name is required",
            emailInvalid: "Invalid email format",
            phoneRequired: "Phone is required",
            schoolRequired: "School is required",
            gradeRequired: "Please select grade",
            gradeInvalid: "Grade must be a number from 5 to 13",
            gradeNotInLeague: "Grade doesn't match selected league"
        },
        kz: {
            teamNameRequired: "Команда атауы міндетті",
            teamNameTooLong: "Максимум 20 символ",
            nameRequired: "Аты міндетті",
            emailInvalid: "Email форматы дұрыс емес",
            phoneRequired: "Телефон міндетті",
            schoolRequired: "Мектеп міндетті",
            gradeRequired: "Сыныпты таңдаңыз",
            gradeInvalid: "Сынып 5-тен 13-ке дейінгі сан болуы керек",
            gradeNotInLeague: "Сынып таңдалған лигаға сәйкес келмейді"
        }
    };
    
    const msg = messages[lang as keyof typeof messages] || messages.ru;
    
    return z.object({
        teamName: z
            .string()
            .min(1, msg.teamNameRequired)
            .max(20, msg.teamNameTooLong)
            .transform(transliterate),
        league: z.enum(["junior", "senior"]).default("junior"),
        language: z.enum(["ru", "kz"]).default("ru"),
        leaderName: z.string().min(1, msg.nameRequired),
        leaderEmail: z.string().email(msg.emailInvalid),
        leaderPhone: z.string().min(1, msg.phoneRequired).transform(formatPhoneNumber),
        captainName: z.string().min(1, msg.nameRequired),
        captainSchool: z.string().min(1, msg.schoolRequired),
        captainGrade: z.preprocess((val) => {
            if (val === "" || val === null || val === undefined) return NaN;
            return Number(val);
        }, z.number({
            required_error: msg.gradeRequired,
            invalid_type_error: msg.gradeRequired
        }).min(5, msg.gradeInvalid).max(13, msg.gradeInvalid)),
        captainEmail: z.string().email(msg.emailInvalid),
        captainPhone: z.string().min(1, msg.phoneRequired).transform(formatPhoneNumber),
        member1Name: z.string().min(1, msg.nameRequired),
        member1School: z.string().min(1, msg.schoolRequired),
        member1Grade: z.preprocess((val) => {
            if (val === "" || val === null || val === undefined) return NaN;
            return Number(val);
        }, z.number({
            required_error: msg.gradeRequired,
            invalid_type_error: msg.gradeRequired
        }).min(5, msg.gradeInvalid).max(13, msg.gradeInvalid)),
        member1Email: z.string().email(msg.emailInvalid),
        member1Phone: z.string().min(1, msg.phoneRequired).transform(formatPhoneNumber),
        member2Name: z.string().min(1, msg.nameRequired),
        member2School: z.string().min(1, msg.schoolRequired),
        member2Grade: z.preprocess((val) => {
            if (val === "" || val === null || val === undefined) return NaN;
            return Number(val);
        }, z.number({
            required_error: msg.gradeRequired,
            invalid_type_error: msg.gradeRequired
        }).min(5, msg.gradeInvalid).max(13, msg.gradeInvalid)),
        member2Email: z.string().email(msg.emailInvalid),
        member2Phone: z.string().min(1, msg.phoneRequired).transform(formatPhoneNumber),
        member3Name: z.string().optional(),
        member3School: z.string().optional(),
        member3Grade: z.preprocess((val) => {
            if (val === "" || val === null || val === undefined) return undefined;
            return Number(val);
        }, z.number().min(5, msg.gradeInvalid).max(13, msg.gradeInvalid).optional()),
        member3Email: z.string().email(msg.emailInvalid).optional().or(z.literal("")),
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
        message: msg.gradeNotInLeague,
        path: ["captainGrade"]
    });
};

export const teamSchema = createTeamSchema("ru"); // Default schema

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
    
    // Create schema based on current language
    const dynamicSchema = createTeamSchema(lang);
    
    const form = useForm<TeamSchema>({
        resolver: zodResolver(dynamicSchema),
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
                // Only reset form on successful registration
                form.reset();
            } else {
                const errorData = await res.json()
                const errorMessage = errorData.message || "Неизвестная ошибка";
                
                // DON'T reset form data - preserve all user input
                // Try to identify which field has the error
                if (errorMessage.includes("team name") || errorMessage.includes("teamName") || errorMessage.includes("team")) {
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
                    // Unknown error - show emergency modal but keep form data
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
        <div className="col-span-full">
            <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl border border-neutral-200 shadow-lg p-6 md:p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
                        {t("formTitle")}
                    </h2>
                    <p className="text-neutral-600 text-lg">
                        {t("formSubtitle")}
                    </p>
                </div>
                
                <Form {...form}>
                    <form
                        className="flex flex-col gap-6"
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
                                    placeholder={t("team.name") + " (автоматически переводится в латиницу)"}
                                    maxLength={20}
                                    className="h-12 md:h-14 p-3 md:p-4 border-neutral-300 rounded-lg text-base placeholder:text-neutral-400 w-full"
                                    {...field}
                                    onChange={(e) => {
                                        const transliterated = transliterate(e.target.value);
                                        field.onChange(transliterated);
                                    }}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />


                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <Label className="text-lg font-semibold text-neutral-800">{t("league.label")}</Label>
                                <TabBar
                                    tabs={[
                                        { label: `${t("league.junior")}, 5-9`, value: "junior" },
                                        { label: `${t("league.senior")}, 5-13`, value: "senior" },
                                    ]}
                                    onChange={(value) =>
                                        form.setValue("league", value as "junior" | "senior")
                                    }
                                />
                                {form.formState.errors.league && (
                                    <p className="text-sm font-medium text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                                        {form.formState.errors.league.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label className="text-lg font-semibold text-neutral-800">{t("language.label")}</Label>
                                <TabBar
                                    tabs={[
                                        { label: t("language.ru"), value: "ru" },
                                        { label: t("language.kz"), value: "kz" },
                                    ]}
                                    onChange={(value) =>
                                        form.setValue("language", value as "ru" | "kz")
                                    }
                                />
                                {form.formState.errors.language && (
                                    <p className="text-sm font-medium text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                                        {form.formState.errors.language.message}
                                    </p>
                                )}
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2">
                                    <p className="text-amber-800 text-sm font-medium">
                                        ⚠️ {t("languageRequirement")}
                                    </p>
                                </div>
                            </div>
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
                        <div className="flex justify-center">
                            <button
                                className={cn("border-2 border-dashed border-neutral-300 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 text-base font-medium rounded-xl px-6 py-4 transition-colors", hasAdditionalMember && "hidden")}
                                type="button"
                                onClick={() => setHasAdditionalMember(true)}
                            >
{t("addMember4")}
                            </button>
                        </div>
                        <div className="flex justify-center pt-4">
                            <button
                                className="bg-primary-500 hover:bg-primary-700 text-white text-lg font-semibold rounded-xl px-8 py-4 flex gap-2 items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[200px] justify-center shadow-lg border-2 border-primary-700"
                                style={{ backgroundColor: '#1D4ED8' }} // Fallback color
                                type="submit"
                                disabled={!personalDataChecked || loading}
                            >
                                {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                                {t("register.team") || "Зарегистрировать команду"}
                            </button>
                        </div>
                    </form>
                </Form>
                
                <EmergencyModal 
                    isOpen={showEmergencyModal} 
                    onClose={() => setShowEmergencyModal(false)} 
                />
            </div>
        </div>
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
    const getSectionTitle = () => {
        switch (prefix) {
            case "leader": return "Руководитель команды";
            case "captain": return "Капитан команды";
            case "member1": return "Участник 2";
            case "member2": return "Участник 3";
            case "member3": return "Участник 4 (необязательно)";
            default: return "";
        }
    };

    return (
        <div className={cn("bg-neutral-50 rounded-xl p-4 md:p-6 border border-neutral-200", className)} >
            <h3 className="text-xl font-semibold text-neutral-800 mb-4 pb-2 border-b border-neutral-200">
                {getSectionTitle()}
            </h3>
            {prefix === "leader" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-blue-800 text-sm leading-relaxed">
                        {t("leaderInfo")}
                    </p>
                </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
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
                                className="h-12 md:h-14 p-3 md:p-4 border-neutral-300 rounded-lg text-base placeholder:text-neutral-400 w-full"

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
                                className="h-12 md:h-14 p-3 md:p-4 border-neutral-300 rounded-lg text-base placeholder:text-neutral-400 w-full"
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
                                placeholder="+77011234567"
                                className="h-12 md:h-14 p-3 md:p-4 border-neutral-300 rounded-lg text-base placeholder:text-neutral-400 w-full"
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
                                            className="h-12 md:h-14 p-3 md:p-4 border-neutral-300 rounded-lg text-base w-full border bg-white"
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
                                            className="h-12 md:h-14 p-3 md:p-4 border-neutral-300 rounded-lg text-base placeholder:text-neutral-400 w-full"
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
        </div>
    )
}
