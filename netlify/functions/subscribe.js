export const handler = async (event) => {
    try {
        const { email, group, consented_at } = JSON.parse(event.body);

        const groupId =
            group === "FREE_MEDITATION"
                ? process.env.MAILERLITE_GROUP_FREE_MEDITATION
                : process.env.MAILERLITE_GROUP_NEWSLETTER;

        // MailerLite expects "YYYY-MM-DD HH:MM:SS" format
        const optedInAt = consented_at
            ? new Date(consented_at).toISOString().replace("T", " ").substring(0, 19)
            : undefined;

        const payload = {
            email,
            groups: [groupId],
            ...(optedInAt && { opted_in_at: optedInAt })
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
