import { resend } from ".";

const emailRuContent = `
    <p>Хотим сообщить, что Оргкомитет турнира Almaty Physics Battles успешно получил вашу заявку.</p>
    <p>Отборочный этап пройдет в гибридном формате: это означает что некоторые участники, которые находятся в городах, где расположены пункты проведения отборочного этапа будут обязаны писать его очно, все остальные (включая иностранных участников) - онлайн с системой прокторинга. Отборочный этап пройдет в гибридном формате:<br/>
    Оффлайн - на базе всех филиалов АОО «НИШ», онлайн - для всех остальных. <br/> Дата проведения отбора - 11 мая, 10:00-13:00. <a href="https://drive.google.com/drive/folders/1J5UYqaUpl_DxOWM4l0taJgvucHTL8_ff">Подробности а положении об отборe</a> </p>
    <p>По результатам отборочного этапа будет отобрано больше 30 команд, которые пройдут на финал. Он состоится 16-22 июня 2024 года на базе Казахского Национального Исследовательского Технического Университета им. Сатпаева (Satbayev University). Университет предоставляет проживание в общежитиях. </p>
    <p>Спасибо за вашу заинтересованность. Ждем с нетерпением ваших достижений на нашем турнире!
    При возникновении вопросов обращайтесь по почте administrator@aphb.kz или в наш телеграмм-чат https://t.me/aphbchat</p>
    <p>С уважением,<br>Оргкомитет APhB 2024</p>

`;

const emailKzContent = `
    <p>Almaty Physics battles турнирінің ұйымдастыру комитеті Сіздің өтініміңізді сәтті алғанын хабарлағымыз келеді.  </p>
    <p>Іріктеу кезеңі гибридті форматта өтеді: бұл іріктеу кезеңін өткізу пункттері орналасқан қалалардағы кейбір қатысушылар оны жеке, қалғандары (шетелдік қатысушыларды қоса алғанда) прокторинг жүйесімен онлайн жазуға міндетті болады дегенді білдіреді. Іріктеу кезеңі гибридтік форматта өтеді:<br/>
    Офлайн – «НЗМ» АҚ барлық филиалдарының базасында, онлайн – қалғандарының барлығы үшін. <br/> Таңдау күні - 11 Мамир, 10:00-13:00. <a href="https://drive.google.com/drive/folders/1J5UYqaUpl_DxOWM4l0taJgvucHTL8_ff">Таңдау ережелері туралы</a></p>
    <p>Іріктеу кезеңінің нәтижелері бойынша финалға өтетін 30-дан астам команда іріктеледі. Ол 2024 жылғы 16-22 маусымда Қазақ ұлттық техникалық зерттеу университетінің базасында өтеді. Сәтбаев (Satbayev University). Университет жатақханаларда тұруды қамтамасыз етеді. </p>
    <p>Қызығушылығыңыз үшін рахмет. Біздің турнирде сіздің жетістіктеріңізді асыға күтеміз!
    Сұрақтар туындаған кезде пошта арқылы хабарласыңыз administrator@aphb.kz немесе біздің жеделхат-чатқа https://t.me/aphbchat</p>
    <p>Құрметпен,<br>APhB Ұйымдастыру Комитеті 2024</p>
`;



export const sendAfterRegister = async ({ team, participantsEmail, leaderEmail, lang }: { team: string, participantsEmail: string[], leaderEmail: string, lang: "ru" | 'kz' }) => {
    {
        const { data, error } = await resend.emails.send({
            from: 'arsen@mail.aphb.kz',
            to: participantsEmail,
            subject: 'APhB registration',
            html: `<div>
        ${lang === 'ru' ? "<p>Уважаемый участник APhB 2024,</p>" : "<p>Құрметті APhB мүшесі 2024,</p>"}
        ${lang === 'ru' ? emailRuContent : emailKzContent}
        <hr>
        <p><strong>ENG:</strong></p>
        <p>Dear participant of APhB 2024,</p>
        <p>We want to inform you that the Almaty Physics Battles Tournament Organizing Committee has successfully received your application.</p>
        <p>The preliminary stage will take place in a hybrid format: this means that some participants, who are located in cities where the preliminary stage venues are situated, will be required to take it in person, while all others (including foreign participants) will take it online with proctoring system. The qualifying stage will be held in a hybrid format:<br/>
        Offline - on the basis of all branches of JSC "NIS", online - for all others. Selection date - May 11, 10:00-13:00. <a href="https://drive.google.com/drive/folders/1J5UYqaUpl_DxOWM4l0taJgvucHTL8_ff">Details of the competition </a></p>
        <p>Following the preliminary stage, more than 30 teams will be selected to advance to the finals. The finals will take place from June 16th to June 22nd, 2024, at Satbayev University, Kazakhstan National Research Technical University. The university will provide accommodation in dormitories.</p>
        <p>Thank you for your interest. We look forward to your achievements at our tournament!
        If you have any questions, please contact us via email at administrator@aphb.kz or in our Telegram chat at https://t.me/aphbchat.</p>
        <p>Best regards,<br>APhB 2024 Organizing Committee</p>
    </div>`,
        });

        if (error) {
            return console.error({ error });
        }

        console.log({ data });
    }
    {
        const { data, error } = await resend.emails.send({
            from: 'arsen@mail.aphb.kz',
            to: [leaderEmail],
            subject: 'APhB registration',
            html: `<div>
            ${lang === 'ru' ? `Уважаемый руководитель команды "${team}" APhB 2024,` : `Құрметті "${team}" командасының жетекшісі APhB 2024,`}  
        ${lang === 'ru' ? emailRuContent : emailKzContent}
        <hr>
        <p><strong>ENG:</strong></p>
        <p>Dear Team Leader ${team} APhB 2024,</p>
        <p>We want to inform you that the Almaty Physics Battles Tournament Organizing Committee has successfully received your application.</p>
        <p>The preliminary stage will take place in a hybrid format: this means that some participants, who are located in cities where the preliminary stage venues are situated, will be required to take it in person, while all others (including foreign participants) will take it online with proctoring system. Further details regarding the conduct of the preliminary stage will be provided no later than April 1.</p>
        <p>Following the preliminary stage, more than 30 teams will be selected to advance to the finals. The finals will take place from June 16th to June 22nd, 2024, at Satbayev University, Kazakhstan National Research Technical University. The university will provide accommodation in dormitories.</p>
        <p>Thank you for your interest. We look forward to your achievements at our tournament!
        If you have any questions, please contact us via email at administrator@aphb.kz or in our Telegram chat at https://t.me/aphbchat.</p>
        <p>Best regards,<br>APhB 2024 Organizing Committee</p>
    </div>`,
        });

        if (error) {
            return console.error({ error });
        }

        console.log({ data });
    }
}