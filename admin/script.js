function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  
  function logout() {
    deleteCookie("username");
    deleteCookie("status");
    window.location.href = "/adminLogin";
  }
  
  function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
  
  // Access Control
  window.onload = function () {
    const status = getCookie("status");
  
    if (status !== "admin" && status !== "volunteer") {
      window.location.href = "/adminLogin";
      return;
    }
  
    // Restrict volunteer access
    if (status === "volunteer") {
      document.getElementById("addSchoolBtn").style.display = "none";
      document.getElementById("addClassBtn").style.display = "none";
    }
  };
  