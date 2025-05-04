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

  const username = getCookie("status");
  if (username) {
    window.location.href = "/admin";
  }
})();

async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  }
  
  document.getElementById("adminLoginForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const password = document.getElementById("password").value;
    const hashed = await sha256(password);
  
    const adminHash = "78a72bcb9c0f3714c0924cf037d407ec7ee513ac20c42df073db98e318d3a979";
    const volunteerHash = "cd69501caa50f2f3509053a53665e66a4a4f46608cfa398914ce65c7f9f435fd";
  
    if (hashed === adminHash) {
      setCookie("status", "admin", 1);
      window.location.href = "/admin";
    } else if (hashed === volunteerHash) {
      setCookie("status", "volunteer", 1);
      window.location.href = "/admin";
    } else {
      document.getElementById("errorMsg").textContent = "Invalid password.";
    }
  });
  