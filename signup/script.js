(function () {
    function getCookie(name) {
      const cookies = document.cookie.split("; ");
      for (let cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === name) {
          return value;
        }
      }
      return null;
    }
  
    const username = getCookie("username");
    if (username) {
      window.location.href = "/";
    }
  })();

// Replace with your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyAxQE7uLbCusZZ5ONK29-sEzQ9_KCQeEfc",
    authDomain: "class-companion-1001.firebaseapp.com",
    projectId: "class-companion-1001",
    storageBucket: "class-companion-1001.firebasestorage.app",
    messagingSenderId: "22310633511",
    appId: "1:22310633511:web:b5624d848d34f75a128e02",
    measurementId: "G-BQ5W2LXWTF"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

document.querySelector('.signup-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!name || !phone || !email || !password) {
        alert("Please fill out all fields.");
        return;
    }

    const hashedPassword = await sha256(password);

    try {
        await db.collection("users").doc(email).set({
        name,
        phone,
        email,
        password: hashedPassword,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert("Signup successful!");
        window.location.href = "/login";
    } catch (error) {
        console.error("Error signing up:", error);
        alert("Error signing up. Check console.");
    }
});