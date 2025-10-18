import { resend } from ".";

const emailRuContent = `
    <p>Хотим сообщить, что Оргкомитет турнира Almaty Physics Battles успешно получил вашу заявку.</p>
    <p>Онлайн отбор пройдет в октябре 2025 года на платформе app.formative.com <a href="https://drive.google.com/drive/folders/1J5UYqaUpl_DxOWM4l0taJgvucHTL8_ff">Подробности в положении об отборе</a>Ваш код приглашения на Пробный Отбор: 64RP6Z</p>
    <p>По результатам отборочного этапа будет отобрано более 30 команд, которые пройдут на финал.</p>
    <p>Спасибо за вашу заинтересованность. Ждем с нетерпением ваших достижений на нашем турнире!
    При возникновении вопросов обращайтесь по почте info@aphb.org или в наш телеграмм-чат https://t.me/aphbchat</p>
    <p>С уважением,<br>Оргкомитет APhB 2025</p>
`;

const emailKzContent = `
    <p>Almaty Physics Battles турнирінің ұйымдастыру комитеті Сіздің өтініміңізді сәтті алғанын хабарлағымыз келеді.</p>
    <p>Онлайн іріктеу 2025 жылғы қазан айында app.formative.com платформасында өтеді <a href="https://drive.google.com/drive/folders/1J5UYqaUpl_DxOWM4l0taJgvucHTL8_ff">Іріктеу ережелері туралы</a>Сынақ іріктеуге шақыру кодыңыз: 64RP6Z</p>
    <p>Іріктеу кезеңінің нәтижелері бойынша 30-дан астам команда финалға өтеді.</p>
    <p>Қызығушылығыңыз үшін рахмет. Біздің турнирде сіздің жетістіктеріңізді асыға күтеміз!
    Сұрақтар туындаған кезде пошта арқылы хабарласыңыз info@aphb.org немесе біздің жеделхат-чатқа https://t.me/aphbchat</p>
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
        <p>The online qualifier will take place in October 2025 on the app.formative.com platform. <a href="https://drive.google.com/drive/folders/1J5UYqaUpl_DxOWM4l0taJgvucHTL8_ff">Details of the competition</a>Your Invitation Code for the Trial Selection: 64RP6Z</p>
        <p>Following the preliminary stage, more than 30 teams will be selected to advance to the finals.</p>
        <p>Thank you for your interest. We look forward to your achievements at our tournament!
        If you have any questions, please contact us via email at info@aphb.org or in our Telegram chat at https://t.me/aphbchat.</p>
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
        <p>The online qualifier will take place in October 2025 on the app.formative.com platform.Your Invitation Code for the Trial Selection: 64RP6Z</p>
        <p>Following the preliminary stage, more than 30 teams will be selected to advance to the finals.</p>
        <p>Thank you for your interest. We look forward to your achievements at our tournament!
        If you have any questions, please contact us via email at info@aphb.org or in our Telegram chat at https://t.me/aphbchat.</p>
        <p>Best regards,<br>APhB 2025 Organizing Committee</p>
    </div>`,
        });

        if (error) {
            return console.error({ error });
        }

        console.log({ data });
    }
}