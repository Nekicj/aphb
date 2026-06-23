import React, { useState } from 'react';

// --- ОБЩИЕ СТИЛИ ДЛЯ ИНПУТОВ И ЛЕЙБЛОВ ---
const inputCls = "w-full h-11 border border-neutral-200 rounded-lg px-3 text-sm bg-white text-neutral-900 outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-neutral-400";
const labelCls = "block text-xs font-medium text-neutral-500 mb-1.5 uppercase tracking-wide";
const sectionTitle = "text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-4 pb-2 border-b border-neutral-100";

// --- ИНТЕРФЕЙС ДЛЯ ПРОПСОВ БЛОКА УЧАСТНИКА ---
interface MemberBlockProps {
    title: string;
    badge?: string;
    prefix: string;
    optional?: boolean;
    extra?: React.ReactNode;
    league: string;
}

// --- ВЫНЕСЕННЫЙ КОМПОНЕНТ УЧАСТНИКА (Чтобы не пропадал фокус при вводе) ---
const MemberBlock = ({ title, badge, prefix, optional = false, extra, league }: MemberBlockProps) => {
    const validateGrade = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        if (league === 'junior' && val > 9) {
            e.target.setCustomValidity('Для юниоров класс не может быть больше 9');
        } else if (val < 1) {
            e.target.setCustomValidity('Класс не может быть меньше 1');
        } else {
            e.target.setCustomValidity('');
        }
    };

    return (
        <div className="border border-neutral-100 rounded-xl p-5 space-y-4 bg-white">
            <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-neutral-800">{title}</span>
                {badge && (
                    <span className="text-xs bg-neutral-100 text-neutral-500 rounded-full px-2.5 py-0.5 font-medium">{badge}</span>
                )}
                {extra}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <label className={labelCls}>ФИО {!optional && <span className="text-red-400">*</span>}</label>
                    <input
                        name={`${prefix}Name`}
                        type="text"
                        required={!optional}
                        className={inputCls}
                        placeholder="Иванов Иван Иванович"
                    />
                </div>
                <div>
                    <label className={labelCls}>Школа {!optional && <span className="text-red-400">*</span>}</label>
                    <input
                        name={`${prefix}School`}
                        type="text"
                        required={!optional}
                        className={inputCls}
                        placeholder="Название школы"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                    <label className={labelCls}>
                        Класс {!optional && <span className="text-red-400">*</span>}
                        {league === 'junior' && (
                            <span className="ml-1 normal-case text-neutral-400">(макс. 9)</span>
                        )}
                    </label>
                    <input
                        name={`${prefix}Grade`}
                        type="number"
                        min="1"
                        max={league === 'junior' ? 9 : 11}
                        required={!optional}
                        onChange={validateGrade}
                        onInput={validateGrade}
                        className={inputCls}
                        placeholder={league === 'junior' ? '1–9' : '1–11'}
                    />
                </div>
                <div>
                    <label className={labelCls}>Email {!optional && <span className="text-red-400">*</span>}</label>
                    <input
                        name={`${prefix}Email`}
                        type="email"
                        required={!optional}
                        className={inputCls}
                        placeholder="email@example.com"
                    />
                </div>
                <div>
                    <label className={labelCls}>Телефон {!optional && <span className="text-red-400">*</span>}</label>
                    <input
                        name={`${prefix}Phone`}
                        type="text"
                        required={!optional}
                        className={inputCls}
                        placeholder="+7 (700) 000-00-00"
                    />
                </div>
            </div>
        </div>
    );
};

// --- ОСНОВНАЯ ФУНКЦИЯ ФОРМЫ ---
export function RegisterForm({ lang }: { lang: string }) {
    const [showMember4, setShowMember4] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [league, setLeague] = useState('junior');
    const [loading, setLoading] = useState(false);

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const payload = {
            teamName: data.teamName,
            league: data.league,
            language: data.language,
            leaderName: data.leaderName,
            leaderEmail: data.leaderEmail,
            leaderPhone: data.leaderPhone,
            leaderCountry: data.leaderCountry,
            leaderCity: data.leaderCity,
            captainName: data.captainName,
            captainSchool: data.captainSchool,
            captainGrade: parseInt(data.captainGrade as string, 10),
            captainEmail: data.captainEmail,
            captainPhone: data.captainPhone,
            member1Name: data.member1Name,
            member1School: data.member1School,
            member1Grade: parseInt(data.member1Grade as string, 10),
            member1Email: data.member1Email,
            member1Phone: data.member1Phone,
            member2Name: data.member2Name,
            member2School: data.member2School,
            member2Grade: parseInt(data.member2Grade as string, 10),
            member2Email: data.member2Email,
            member2Phone: data.member2Phone,
            member3Name: showMember4 ? data.member3Name : null,
            member3School: showMember4 ? data.member3School : null,
            member3Grade: showMember4 ? parseInt(data.member3Grade as string, 10) : null,
            member3Email: showMember4 ? data.member3Email : null,
            member3Phone: showMember4 ? data.member3Phone : null,
            captainParent: { parentName: "", parentEmail: "", parentPhone: "", autoproctorConsent: false },
            member1Parent: { parentName: "", parentEmail: "", parentPhone: "", autoproctorConsent: false },
            member2Parent: { parentName: "", parentEmail: "", parentPhone: "", autoproctorConsent: false },
            member3Parent: { parentName: "", parentEmail: "", parentPhone: "", autoproctorConsent: false },
        };

        try {
            const response = await fetch('/api/form.json', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setIsSubmitted(true);
            } else {
                const errorText = await response.text();
                console.error("Ошибка при отправке формы:", errorText);
            }
        } catch (err) {
            console.error("Сетевая ошибка:", err);
        } finally {
            setLoading(false);
        }
    };

    const parentFormUrl =
        lang === 'kz' ? '/kz/parent-consent'
        : lang === 'en' ? '/en/parent-consent'
        : '/parent-consent';

    // ЭКРАН УСПЕШНОЙ ОТПРАВКИ
    if (isSubmitted) {
        return (
            <div className="max-w-3xl mx-auto p-8 bg-amber-50 border border-amber-200 rounded-2xl text-neutral-800 space-y-4 relative z-20">
                {lang === 'kz' ? (
                    <>
                        <h3 className="text-xl font-semibold text-amber-800">Команда тіркелді, бірақ бұл әлі бәрі емес!</h3>
                        <p className="text-sm text-neutral-700">
                            Тіркеуді толық аяқтау үшін әрбір қатысушының ата-анасы немесе заңды өкілі AutoProctor жүйесін пайдалануға міндетті түрде келісім беруі керек.
                        </p>
                        <p className="text-sm text-neutral-500">
                            Ата-анаңызға мына сілтемені жіберіңіз және олар пішінде сіздің телефон нөміріңізді немесе email-ыңызды көрсетуі керек екенін ескертіңіз:
                        </p>
                        <a href={parentFormUrl} className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors text-sm">
                            Ата-ана келісімінің сілтемесі →
                        </a>
                    </>
                ) : lang === 'en' ? (
                    <>
                        <h3 className="text-xl font-semibold text-amber-800">Team registered — one more step!</h3>
                        <p className="text-sm text-neutral-700">
                            To fully complete registration, the parent or legal representative of each participant must submit a separate consent form for AutoProctor.
                        </p>
                        <p className="text-sm text-neutral-500">
                            Send this link to your parents and remind them to enter your phone number or email so we can link the records:
                        </p>
                        <a href={parentFormUrl} className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors text-sm">
                            Parent Consent Form →
                        </a>
                    </>
                ) : (
                    <>
                        <h3 className="text-xl font-semibold text-amber-800">Команда зарегистрирована — осталось одно действие!</h3>
                        <p className="text-sm text-neutral-700">
                            Чтобы завершить регистрацию, родитель/опекун или доверенное лицо каждого участника должен заполнить отдельную форму согласия на AutoProctor.
                        </p>
                        <p className="text-sm text-neutral-500">
                            Перешлите ссылку ниже и напомните указать ваш номер телефона или email — так мы свяжем анкеты в базе:
                        </p>
                        <a href={parentFormUrl} className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors text-sm">
                            Форма согласия →
                        </a>
                    </>
                )}
            </div>
        );
    }

    // ОСНОВНАЯ ФОРМА
    return (
        <form onSubmit={handleFormSubmit} className="max-w-3xl mx-auto space-y-8 text-neutral-800 bg-white relative z-20">
            
            {/* СЕКЦИЯ: ОСНОВНАЯ ИНФОРМАЦИЯ */}
            <div className="space-y-4">
                <p className={sectionTitle}>Основная информация</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label className={labelCls}>Название команды <span className="text-red-400">*</span></label>
                        <input name="teamName" type="text" required className={inputCls} placeholder="Введите название" />
                    </div>
                    <div>
                        <label className={labelCls}>Лига <span className="text-red-400">*</span></label>
                        <select
                            name="league"
                            value={league}
                            onChange={(e) => setLeague(e.target.value)}
                            className={inputCls}
                        >
                            <option value="junior">Юниоры (Junior)</option>
                            <option value="senior">Сениоры (Senior)</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label className={labelCls}>Язык участия <span className="text-red-400">*</span></label>
                        <select name="language" className={inputCls}>
                            <option value="ru">Русский</option>
                            <option value="kz">Казахский</option>
                        </select>
                        <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                            Все участники команды должны владеть казахским, русским или обоими языками.
                        </p>
                    </div>
                </div>
            </div>

            {/* СЕКЦИЯ: РУКОВОДИТЕЛЬ КОМАНДЫ */}
            <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-5 space-y-4">
                <p className={sectionTitle}>Руководитель команды</p>
                <p className="text-xs text-neutral-600 leading-relaxed bg-white p-3 rounded-lg border border-neutral-200">
                    Руководитель команды — лицо, ответственное за команду. Не может быть участником команды или несовершеннолетним. 
                    Должен быть совершеннолетним с нотариально заверенной доверенностью от родителей несовершеннолетних участников. 
                    Может быть преподавателем, сотрудником школы или любым уполномоченным взрослым. Обязателен для всех команд.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                        <label className={labelCls}>ФИО <span className="text-red-400">*</span></label>
                        <input name="leaderName" type="text" required className={inputCls} placeholder="Иванов Иван Иванович" />
                    </div>
                    <div>
                        <label className={labelCls}>Email <span className="text-red-400">*</span></label>
                        <input name="leaderEmail" type="email" required className={inputCls} placeholder="email@example.com" />
                    </div>
                    <div>
                        <label className={labelCls}>Телефон <span className="text-red-400">*</span></label>
                        <input name="leaderPhone" type="text" required className={inputCls} placeholder="+7 (700) 000-00-00" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label className={labelCls}>Страна <span className="text-red-400">*</span></label>
                        <input name="leaderCountry" type="text" required className={inputCls} placeholder="Казахстан" />
                    </div>
                    <div>
                        <label className={labelCls}>Город <span className="text-red-400">*</span></label>
                        <input name="leaderCity" type="text" required className={inputCls} placeholder="Алматы" />
                    </div>
                </div>
            </div>

            {/* СЕКЦИЯ: УЧАСТНИКИ */}
            <div className="space-y-3">
                <p className={sectionTitle}>Участники</p>

                <MemberBlock title="Капитан команды" badge="Участник 1" prefix="captain" league={league} />
                <MemberBlock title="Участник 2" badge="Обязательно" prefix="member1" league={league} />
                <MemberBlock title="Участник 3" badge="Обязательно" prefix="member2" league={league} />

                {!showMember4 ? (
                    <button
                        type="button"
                        onClick={() => setShowMember4(true)}
                        className="w-full border border-dashed border-neutral-200 rounded-xl py-3 text-sm text-neutral-400 hover:border-neutral-300 hover:text-neutral-600 transition-colors flex items-center justify-center gap-1.5 bg-transparent"
                    >
                        <span className="text-lg leading-none">+</span> Добавить участника 4
                    </button>
                ) : (
                    <MemberBlock
                        title="Участник 4"
                        badge="Необязательно"
                        prefix="member3"
                        optional
                        league={league}
                        extra={
                            <button
                                type="button"
                                onClick={() => setShowMember4(false)}
                                className="ml-auto text-xs text-red-400 hover:text-red-600 transition-colors bg-transparent"
                            >
                                Убрать
                            </button>
                        }
                    />
                )}
            </div>

            {/* ЧЕКБОКСЫ СОГЛАСИЯ */}
            <label className="flex items-start gap-3 cursor-pointer p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                <input type="checkbox" required className="mt-0.5 w-4 h-4 accent-[#172967] flex-shrink-0" />
                <span className="text-xs text-neutral-500 leading-relaxed">
                    Заполняя форму, члены команды подтверждают, что ознакомлены с{" "}
                    <a
                        href="https://drive.google.com/drive/folders/17srDz95t5X9-t0ZsSPBRFk7F5i7U8F-6"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-[#172967] hover:text-[#0f1c4a] transition-colors"
                    >
                        основным регламентом научных боёв
                    </a>
                    . <span className="text-red-400">*</span>
                </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                <input type="checkbox" required className="mt-0.5 w-4 h-4 accent-[#172967] flex-shrink-0" />
                <span className="text-xs text-neutral-500 leading-relaxed">
                    Даю согласие на сбор, обработку и хранение Персональных Данных в соответствии с Перечнем №03-08/05. С{" "}
                    <a
                        href="https://drive.google.com/drive/folders/1uezUXIM8UVWG7S7yJooWESq0c8vyUzCy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-[#172967] hover:text-[#0f1c4a] transition-colors"
                    >
                        политикой работы с ПД Фонда и перечнем
                    </a>
                    {" "}можно ознакомиться на сайте{" "}
                    <a
                        href="https://bc-pf.org/personaldata"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-[#172967] hover:text-[#0f1c4a] transition-colors"
                    >
                        Фонда
                    </a>.
                    <span className="text-red-400"> *</span>
                </span>
            </label>

            {/* КНОПКА ОТПРАВКИ */}
            <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[#172967] hover:bg-[#0f1c4a] text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Регистрация...' : 'Зарегистрировать команду'}
            </button>
        </form>
    );
}