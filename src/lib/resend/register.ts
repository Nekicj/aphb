import { resend } from ".";

const emailRuContent = `
    <p>Хотим сообщить, что Оргкомитет турнира Almaty Physics Battles успешно получил вашу заявку.</p>
    <p>Онлайн отбор пройдёт 3 июля 2026 года с 13:00 до 15:45 (время Алматы, GMT+5) на платформе autoproctor.com. <a href="https://drive.google.com/drive/folders/1J5UYqaUpl_DxOWM4l0taJgvucHTL8_ff">Подробности в положении об отборе.</a> Инструкции с доступом к платформе будут отправлены ближе к дате.</p>
    <p>По результатам отборочного этапа будет отобрано более 30 команд, которые пройдут на финал.</p>
    <p>Спасибо за вашу заинтересованность. Ждем с нетерпением ваших достижений на нашем турнире!
    При возникновении вопросов обращайтесь по почте info@aphb.org или в наш телеграмм-чат https://t.me/aphbchat</p>
    <p>С уважением,<br>Оргкомитет APhB 2026</p>
`;

const emailKzContent = `
    <p>Almaty Physics Battles турнирінің ұйымдастыру комитеті Сіздің өтініміңізді сәтті алғанын хабарлағымыз келеді.</p>
    <p>Онлайн іріктеу 2026 жылғы 3 шілдеде 13:00–15:45 аралығында (Алматы уақыты, GMT+5) autoproctor.com платформасында өтеді. <a href="https://drive.google.com/drive/folders/1J5UYqaUpl_DxOWM4l0taJgvucHTL8_ff">Іріктеу ережелері туралы.</a> Платформаға қолжетімділік нұсқаулықтары іс-шараға жақын уақытта жіберіледі.</p>
    <p>Іріктеу кезеңінің нәтижелері бойынша 30-дан астам команда финалға өтеді.</p>
    <p>Қызығушылығыңыз үшін рахмет. Біздің турнирде сіздің жетістіктеріңізді асыға күтеміз!
    Сұрақтар туындаған кезде пошта арқылы хабарласыңыз info@aphb.org немесе біздің жеделхат-чатқа https://t.me/aphbchat</p>
    <p>Құрметпен,<br>APhB Ұйымдастыру Комитеті 2026</p>
`;

export const sendAfterRegister = async ({ team, participantsEmail, leaderEmail, lang }: { team: string, participantsEmail: string[], leaderEmail: string, lang: "ru" | 'kz' }) => {
    {
        const { data, error } = await resend.emails.send({
            from: 'info@aphb.org',
            to: participantsEmail,
            subject: 'APhB registration',
            html: `<div>
        ${lang === 'ru' ? "<p>Уважаемый участник APhB 2026,</p>" : "<p>Құрметті APhB мүшесі 2026,</p>"}
        ${lang === 'ru' ? emailRuContent : emailKzContent}
        <hr>
        <p><strong>ENG:</strong></p>
        <p>Dear participant of APhB 2026,</p>
        <p>We want to inform you that the Almaty Physics Battles Tournament Organizing Committee has successfully received your application.</p>
        <p>The online qualifier will take place on July 3, 2026 from 13:00 to 15:45 (Almaty time, GMT+5) on the autoproctor.com platform. <a href="https://drive.google.com/drive/folders/1J5UYqaUpl_DxOWM4l0taJgvucHTL8_ff">Details of the competition.</a> Instructions with access to the platform will be sent closer to the date.</p>
        <p>Following the preliminary stage, more than 30 teams will be selected to advance to the finals.</p>
        <p>Thank you for your interest. We look forward to your achievements at our tournament!
        If you have any questions, please contact us via email at info@aphb.org or in our Telegram chat at https://t.me/aphbchat.</p>
        <p>Best regards,<br>APhB 2026 Organizing Committee</p>
    </div>`,
        });

        if (error) {
            return console.error({ error });
        }

        console.log({ data });
    }
    {
        const { data, error } = await resend.emails.send({
            from: 'info@aphb.org',
            to: [leaderEmail],
            subject: 'APhB registration',
            html: `<div>
            ${lang === 'ru' ? `Уважаемый руководитель команды "${team}" APhB 2026,` : `Құрметті "${team}" командасының жетекшісі APhB 2026,`}
        ${lang === 'ru' ? emailRuContent : emailKzContent}
        <hr>
        <p><strong>ENG:</strong></p>
        <p>Dear Team Leader ${team} APhB 2026,</p>
        <p>We want to inform you that the Almaty Physics Battles Tournament Organizing Committee has successfully received your application.</p>
        <p>The online qualifier will take place on July 3, 2026 from 13:00 to 15:45 (Almaty time, GMT+5) on the autoproctor.com platform. Instructions with access to the platform will be sent closer to the date.</p>
        <p>Following the preliminary stage, more than 30 teams will be selected to advance to the finals.</p>
        <p>Thank you for your interest. We look forward to your achievements at our tournament!
        If you have any questions, please contact us via email at info@aphb.org or in our Telegram chat at https://t.me/aphbchat.</p>
        <p>Best regards,<br>APhB 2026 Organizing Committee</p>
    </div>`,
        });

        if (error) {
            return console.error({ error });
        }

        console.log({ data });
    }
}