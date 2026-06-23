import React, { useState } from 'react';

export function ParentConsentForm({ lang }: { lang: any }) {
    const [isRepresentative, setIsRepresentative] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const texts = {
        kz: {
            title: "Ата-ананың келісім пішіні",
            subtitle: "Әрбір қатысушы үшін ата-анасы немесе заңды өкілі жеке толтырады.",
            identifierLabel: "Қатысушының телефоны немесе Email-ы",
            identifierHint: "Тіркелу кезінде балаңыз көрсеткен телефонды немесе email-ды енгізіңіз. Бұл деректерді базада байланыстыру үшін қажет.",
            nameLabel: "Өкілдің Т.Ә.Ғ.",
            emailLabel: "Өкілдің Email-ы",
            phoneLabel: "Өкілдің телефоны",
            phonePlaceholder: "+7 (707) 123-4567",
            repCheckboxTitle: "Мен сенімді тұлғамын",
            repCheckboxHint: "Егер сіз нотариалды сенімхат бойынша ілесіп жүруші/мұғалім болсаңыз, құсбелгініқойыңыз",
            poaLabel: "Нотариалды сенімхаттың нөмірі",
            poaPlaceholder: "Мысалы, №12345-XYZ",
            consent1: "Мен баламның AutoProctor жүйесін пайдалануына және онымен байланысты дербес деректерді өңдеуге келісімімді растаймын.",
            consent2: "Турнир регламентіне сәйкес менің дербес деректерімді жинауға, өңдеуге және сақтауға келісім беремін.",
            policyPreLink: "Дербес деректерді №03-08/03 Тізбеге сәйкес жинауға, өңдеуге және сақтауға келісім беремін. Қордың ",
            policyLinkLabel: "ДД-мен жұмыс істеу саясатымен және тізбемен",
            policyPostLink: " Қордың сайтында танысуға болады.",
            submitBtn: "Келісімді жіберу",
            success: "Келісім сәтті жіберілді және қатысушымен байланыстырылды!",
            error: "Жіберу кезінде қате кетті. Кейінірек қайталап көріңіз.",
        },
        en: {
            title: "Parental Consent Form",
            subtitle: "To be filled out individually by a parent or legal representative for each participant.",
            identifierLabel: "Participant's phone number or email",
            identifierHint: "Enter the exact phone or email your child used during team registration. Required to link data in the database.",
            nameLabel: "Representative's full name",
            emailLabel: "Representative's email",
            phoneLabel: "Representative's phone",
            phonePlaceholder: "+1 (555) 123-4567",
            repCheckboxTitle: "I am an authorized representative",
            repCheckboxHint: "Check this box if you are an accompanying teacher or guardian with a power of attorney",
            poaLabel: "Power of attorney number",
            poaPlaceholder: "e.g. No.12345-XYZ",
            consent1: "I confirm my consent to the use of the AutoProctor system and the processing of related personal data of my child.",
            consent2: "I consent to the collection, processing, and storage of my personal data in accordance with the tournament regulations.",
            policyPreLink: "I consent to the collection, processing, and storage of Personal Data in accordance with List No. 03-08/03. The Foundation's ",
            policyLinkLabel: "PD processing policy and list",
            policyPostLink: " can be found on the Foundation's website.",
            submitBtn: "Submit consent",
            success: "Consent successfully submitted and linked to the participant!",
            error: "An error occurred during submission. Please try again later.",
        },
        ru: {
            title: "Форма родительского согласия",
            subtitle: "Заполняется родителем или законным представителем индивидуально для каждого участника.",
            identifierLabel: "Телефон или email участника",
            identifierHint: "Укажите тот телефон или email, который ребёнок ввёл при регистрации команды — по нему мы свяжем анкеты в базе.",
            nameLabel: "ФИО представителя",
            emailLabel: "Email представителя",
            phoneLabel: "Телефон представителя",
            phonePlaceholder: "+7 (707) 123-4567",
            repCheckboxTitle: "Я являюсь доверенным лицом",
            repCheckboxHint: "Поставьте галочку, если вы сопровождающий или учитель по нотариальной доверенности",
            poaLabel: "Номер нотариальной доверенности",
            poaPlaceholder: "Например, №12345-XYZ",
            consent1: "Я подтверждаю согласие на использование системы AutoProctor и обработку связанных персональных данных моего ребёнка.",
            consent2: "Даю согласие на сбор, обработку и хранение моих персональных данных в соответствии с регламентом турнира.",
            policyPreLink: "Даю согласие на сбор, обработку и хранение Персональных Данных в соответствии с Перечнем №03-08/03. С ",
            policyLinkLabel: "политикой работы с ПД Фонда и перечнем",
            policyPostLink: " можно ознакомиться на сайте Фонда.",
            submitBtn: "Отправить согласие",
            success: "Согласие успешно отправлено и связано с участником!",
            error: "Ошибка при отправке. Пожалуйста, попробуйте позже.",
        },
    };

    const t = texts[lang as keyof typeof texts] || texts.ru;

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatusMessage(null);
        
        const form = e.currentTarget;
        
        const formData = new FormData(form);
        const data = {
            childIdentifier: formData.get('childIdentifier'),
            parentName: formData.get('parentName'),
            parentEmail: formData.get('parentEmail'),
            parentPhone: formData.get('parentPhone'),
            isRepresentative,
            poaNumber: isRepresentative ? formData.get('poaNumber') : null,
            lang,
        };

        try {
            const response = await fetch('/api/parent-consent.json', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setStatusMessage({ type: 'success', text: t.success });
                form.reset();
                setIsRepresentative(false);
            } else {
                setStatusMessage({ type: 'error', text: t.error });
            }
        } catch {
            setStatusMessage({ type: 'error', text: t.error });
        }
    };

    const inputCls = "w-full h-11 border border-neutral-200 rounded-lg px-3 text-sm bg-white text-neutral-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-neutral-400";
    const labelCls = "block text-xs font-medium text-neutral-500 mb-1.5 uppercase tracking-wide";

    return (
        <div className="max-w-xl mx-auto text-neutral-800 space-y-6 bg-white relative z-20">

            {statusMessage && (
                <div className={`p-4 rounded-xl text-sm font-medium border ${
                    statusMessage.type === 'success'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                    {statusMessage.text}
                </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6">

                <div>
                    <label className={labelCls}>
                        {t.identifierLabel} <span className="text-red-400">*</span>
                    </label>
                    <input
                        name="childIdentifier"
                        type="text"
                        required
                        className={inputCls}
                        placeholder="+7 (700) 000-00-00 или email"
                    />
                    <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">{t.identifierHint}</p>
                </div>

                <div className="h-px bg-neutral-100" />

                <div className="space-y-3">
                    <div>
                        <label className={labelCls}>
                            {t.nameLabel} <span className="text-red-400">*</span>
                        </label>
                        <input
                            name="parentName"
                            type="text"
                            required
                            className={inputCls}
                            placeholder="Давид Ли Дюхамбаевич"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className={labelCls}>
                                {t.emailLabel} <span className="text-red-400">*</span>
                            </label>
                            <input
                                name="parentEmail"
                                type="email"
                                required
                                className={inputCls}
                                placeholder="email@example.com"
                            />
                        </div>
                        <div>
                            <label className={labelCls}>
                                {t.phoneLabel} <span className="text-red-400">*</span>
                            </label>
                            <input
                                name="parentPhone"
                                type="text"
                                required
                                className={inputCls}
                                placeholder={t.phonePlaceholder}
                            />
                        </div>
                    </div>
                </div>

                <div className="h-px bg-neutral-100" />

                <label className="flex items-start gap-3 p-4 bg-neutral-50 border border-neutral-100 rounded-xl cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={isRepresentative}
                        onChange={(e) => setIsRepresentative(e.target.checked)}
                        className="mt-0.5 w-4 h-4 accent-blue-600 flex-shrink-0"
                    />
                    <div>
                        <p className="text-sm font-medium text-neutral-800">{t.repCheckboxTitle}</p>
                        <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">{t.repCheckboxHint}</p>
                    </div>
                </label>

                {isRepresentative && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                        <label className={labelCls + " text-blue-700"}>
                            {t.poaLabel} <span className="text-red-400">*</span>
                        </label>
                        <input
                            name="poaNumber"
                            type="text"
                            required={isRepresentative}
                            className={inputCls}
                            placeholder={t.poaPlaceholder}
                        />
                    </div>
                )}

                <div className="h-px bg-neutral-100" />

                <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" required className="mt-0.5 w-4 h-4 accent-blue-600 flex-shrink-0" />
                        <span className="text-xs text-neutral-500 leading-relaxed">
                            {t.consent1} <span className="text-red-400">*</span>
                        </span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" required className="mt-0.5 w-4 h-4 accent-blue-600 flex-shrink-0" />
                        <span className="text-xs text-neutral-500 leading-relaxed">
                            {t.consent2} <span className="text-red-400">*</span>
                        </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" required className="mt-0.5 w-4 h-4 accent-blue-600 flex-shrink-0" />
                        <span className="text-xs text-neutral-500 leading-relaxed">
                            {t.policyPreLink}
                            <a 
                                href="https://drive.google.com/drive/folders/1uezUXIM8UVWG7S7yJooWESq0c8vyUzCy" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-600 underline hover:text-blue-800 transition-colors inline-block mx-0.5"
                            >
                                {t.policyLinkLabel}
                            </a>
                            {t.policyPostLink} <span className="text-red-400">*</span>
                        </span>
                    </label>
                </div>

                <button
                    type="submit"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors"
                >
                    {t.submitBtn}
                </button>
            </form>
        </div>
    );
}