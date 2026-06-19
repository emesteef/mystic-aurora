export const handler = async (event) => {
    try {
        const { email, group, consented_at } = JSON.parse(event.body);

        const groupId =
            group === "FREE_MEDITATION"
                ? process.env.MAILERLITE_GROUP_FREE_MEDITATION
                : process.env.MAILERLITE_GROUP_NEWSLETTER;

        const payload = {
            email,
            groups: [groupId],
            ...(consented_at && { opted_in_at: consented_at })
        };

        const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`
            },
            body: JSON.stringify(payload)
        });

        return { statusCode: res.ok ? 200 : 400 };
    } catch {
        return { statusCode: 500 };
    }
};
