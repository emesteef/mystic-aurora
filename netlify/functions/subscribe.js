export const handler = async (event) => {
    try {
        const { email, group, consented_at } = JSON.parse(event.body);

        // bez poprawnego e-maila i daty zgody nie zapisujemy (rozliczalność zgody, art. 7 ust. 1 RODO)
        const emailValid = typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
        const consentValid = typeof consented_at === "string" && !Number.isNaN(Date.parse(consented_at));
        if (!emailValid || !consentValid) {
            return { statusCode: 400 };
        }

        const groupId =
            group === "FREE_MEDITATION"
                ? process.env.MAILERLITE_GROUP_FREE_MEDITATION
                : process.env.MAILERLITE_GROUP_NEWSLETTER;

        // MailerLite date fields expect "YYYY-MM-DD" format
        const consentDate = consented_at
            ? new Date(consented_at).toISOString().substring(0, 10)
            : undefined;

        const payload = {
            email,
            groups: [groupId],
            ...(consentDate && { fields: { data_zgody_rodo: consentDate } })
        };

        const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const err = await res.text();
            console.error("MailerLite error:", res.status, err);
            return { statusCode: 400 };
        }

        return { statusCode: 200 };
    } catch (e) {
        console.error("Subscribe function error:", e);
        return { statusCode: 500 };
    }
};
