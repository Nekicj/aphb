import { resend } from ".";

const emailRuContent = `
    <p>Хотим сообщить, что Оргкомитет турнира Almaty Physics Battles успешно получил вашу заявку.</p>
    <p>Онлайн отбор пройдет с 19 по 21 сентября 2025 года на платформе app.formative.com. <a href="https://drive.google.com/drive/folders/1J5UYqaUpl_DxOWM4l0taJgvucHTL8_ff">Подробности в положении об отборе</a> </p>
    <p>По результатам отборочного этапа будет отобрано больше 30 команд, которые пройдут на финал. Он состоится с 25 по 27 октября 2025 года на базе Казахского Национального Исследовательского Технического Университета им. Сатпаева (Satbayev University). Университет предоставляет проживание в общежитиях. </p>
    <p>Спасибо за вашу заинтересованность. Ждем с нетерпением ваших достижений на нашем турнире!
    При возникновении вопросов обращайтесь по почте administrator@aphb.kz или в наш телеграмм-чат https://t.me/aphbchat</p>
    <p>С уважением,<br>Оргкомитет APhB 2025</p>

`;

const emailKzContent = `
    <p>Almaty Physics battles турнирінің ұйымдастыру комитеті Сіздің өтініміңізді сәтті алғанын хабарлағымыз келеді.  </p>
    <p>Онлайн іріктеу 2025 жылғы 19-21 қыркүйек аралығында app.formative.com платформасында өткізіледі. <a href="https://drive.google.com/drive/folders/1J5UYqaUpl_DxOWM4l0taJgvucHTL8_ff">Іріктеу ережелері туралы</a></p>
    <p>Іріктеу кезеңінің нәтижелері бойынша финалға өтетін 30-дан астам команда іріктеледі. Ол 2025 жылғы 25-27 қазан аралығында Қазақ ұлттық техникалық зерттеу университетінің базасында өтеді. Сәтбаев (Satbayev University). Университет жатақханаларда тұруды қамтамасыз етеді. </p>
    <p>Қызығушылығыңыз үшін рахмет. Біздің турнирде сіздің жетістіктеріңізді асыға күтеміз!
    Сұрақтар туындаған кезде пошта арқылы хабарласыңыз administrator@aphb.kz немесе біздің жеделхат-чатқа https://t.me/aphbchat</p>
    <p>Құрметпен,<br>APhB Ұйымдастыру Комитеті 2025</p>
`;



export const sendAfterRegister = async ({ team, participantsEmail, leaderEmail, lang }: { team: string, participantsEmail: string[], leaderEmail: string, lang: "ru" | 'kz' }) => {
    {
        const { data, error } = await resend.emails.send({
            from: 'arsen@mail.aphb.kz',
            to: participantsEmail,
            subject: 'APhB registration',
            html: `<div>
        ${lang === 'ru' ? "<p>Уважаемый участник APhB 2025,</p>" : "<p>Құрметті APhB мүшесі 2025,</p>"}
        ${lang === 'ru' ? emailRuContent : emailKzContent}
        <hr>
        <p><strong>ENG:</strong></p>
        <p>Dear participant of APhB 2025,</p>
        <p>We want to inform you that the Almaty Physics Battles Tournament Organizing Committee has successfully received your application.</p>
        <p>The online qualifier will take place from September 19th to September 21st, 2025 on the app.formative.com platform. <a href="https://drive.google.com/drive/folders/1J5UYqaUpl_DxOWM4l0taJgvucHTL8_ff">Details of the competition</a></p>
        <p>Following the preliminary stage, more than 30 teams will be selected to advance to the finals. The finals will take place from October 25th to October 27th, 2025, at Satbayev University, Kazakhstan National Research Technical University. The university will provide accommodation in dormitories.</p>
        <p>Thank you for your interest. We look forward to your achievements at our tournament!
        If you have any questions, please contact us via email at administrator@aphb.kz or in our Telegram chat at https://t.me/aphbchat.</p>
        <p>Best regards,<br>APhB 2025 Organizing Committee</p>
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
            ${lang === 'ru' ? `Уважаемый руководитель команды "${team}" APhB 2025,` : `Құрметті "${team}" командасының жетекшісі APhB 2025,`}  
        ${lang === 'ru' ? emailRuContent : emailKzContent}
        <hr>
        <p><strong>ENG:</strong></p>
        <p>Dear Team Leader ${team} APhB 2025,</p>
        <p>We want to inform you that the Almaty Physics Battles Tournament Organizing Committee has successfully received your application.</p>
        <p>The online qualifier will take place from September 19th to September 21st, 2025 on the app.formative.com platform. Further details regarding the conduct of the preliminary stage will be provided no later than September 18th.</p>
        <p>Following the preliminary stage, more than 30 teams will be selected to advance to the finals. The finals will take place from October 25th to October 27th, 2025, at Satbayev University, Kazakhstan National Research Technical University. The university will provide accommodation in dormitories.</p>
        <p>Thank you for your interest. We look forward to your achievements at our tournament!
        If you have any questions, please contact us via email at administrator@aphb.kz or in our Telegram chat at https://t.me/aphbchat.</p>
        <p>Best regards,<br>APhB 2025 Organizing Committee</p>
    </div>`,
        });

        if (error) {
            return console.error({ error });
        }

        console.log({ data });
    }
}