const dbUrl = "https://my-home-a7a4f-default-rtdb.firebaseio.com";
const statusText = document.getElementById("status");

// বাটন চাপার সময় মনে রাখার ভেরিয়েবল
let lastToggleTime = 0; 

function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.view-section');
    sections.forEach(sec => sec.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    closeNav();
}

function loadRealtimeData() {
    fetch(`${dbUrl}/.json`)
    .then(response => {
        if (!response.ok) throw new Error("Firebase Rules may be denying access");
        return response.json();
    })
    .then(data => {
        if(data) {
            // তাপমাত্রা ও আর্দ্রতা সবসময় আপডেট হবে
            if(data.Node1) {
                if(data.Node1.Temp !== undefined) document.getElementById('Node1_Temp').innerText = data.Node1.Temp;
                if(data.Node1.Hum !== undefined) document.getElementById('Node1_Hum').innerText = data.Node1.Hum;
            }
            if(data.Node2) {
                if(data.Node2.Temp !== undefined) document.getElementById('Node2_Temp').innerText = data.Node2.Temp;
                if(data.Node2.Hum !== undefined) document.getElementById('Node2_Hum').innerText = data.Node2.Hum;
            }
            if(data.Node3) {
                if(data.Node3.Temp !== undefined) document.getElementById('Node3_Temp').innerText = data.Node3.Temp;
                if(data.Node3.Hum !== undefined) document.getElementById('Node3_Hum').innerText = data.Node3.Hum;
            }

            // বাটন স্টেট আপডেট হবে শুধুমাত্র যদি শেষ ২.৫ সেকেন্ডের মধ্যে কোনো বাটন চাপা না হয়ে থাকে
            if (Date.now() - lastToggleTime > 2500) {
                if(data.Node1) {
                    if(data.Node1.Relay1 !== undefined) document.getElementById('Node1_Relay1').checked = data.Node1.Relay1 === 1;
                    if(data.Node1.Relay2 !== undefined) document.getElementById('Node1_Relay2').checked = data.Node1.Relay2 === 1;
                }
                if(data.Node2) {
                    if(data.Node2.Relay1 !== undefined) document.getElementById('Node2_Relay1').checked = data.Node2.Relay1 === 1;
                    if(data.Node2.Relay2 !== undefined) document.getElementById('Node2_Relay2').checked = data.Node2.Relay2 === 1;
                }
                if(data.Node3) {
                    if(data.Node3.Relay1 !== undefined) document.getElementById('Node3_Relay1').checked = data.Node3.Relay1 === 1;
                    if(data.Node3.Relay2 !== undefined) document.getElementById('Node3_Relay2').checked = data.Node3.Relay2 === 1;
                }
            }
        }
        statusText.innerText = "🟢 সিস্টেম অনলাইনে আছে";
        statusText.style.color = "#4CAF50";
    })
    .catch(error => {
        console.error("Error:", error);
        statusText.innerText = "🔴 ডেটাবেস কানেকশন ফেইল্ড!";
        statusText.style.color = "#f44336";
    });
}

function toggleDevice(node, relay, element) {
    lastToggleTime = Date.now(); // বাটন চাপার বর্তমান সময় রেকর্ড করা হলো
    const state = element.checked ? 1 : 0;
    
    fetch(`${dbUrl}/${node}/${relay}.json`, {
        method: 'PUT',
        body: JSON.stringify(state)
    })
    .then(response => {
        if(!response.ok) {
            alert("কমান্ড পাঠাতে সমস্যা হয়েছে!");
            element.checked = !element.checked; 
        }
    })
    .catch(error => {
        alert("ইন্টারনেট কানেকশন চেক করুন!");
        element.checked = !element.checked;
    });
}

window.onload = () => {
    loadRealtimeData();
    setInterval(loadRealtimeData, 3000); 
};