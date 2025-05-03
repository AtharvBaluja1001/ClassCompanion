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

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

document.querySelector('.signup-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    try {
        const doc = await firebase.firestore().collection("users").doc(email).get();

        if (!doc.exists) {
        alert("No account found with this email.");
        return;
        }

        const storedHashedPassword = doc.data().password;
        const enteredHashedPassword = await sha256(password);

        if (storedHashedPassword === enteredHashedPassword) {
        setCookie("username", email, 7); // Set cookie for 7 days
        window.location.href = "/";
        } else {
        alert("Incorrect password.");
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("An error occurred during login.");
    }
});