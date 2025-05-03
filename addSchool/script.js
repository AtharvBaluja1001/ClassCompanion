function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  
  function redirectIfNotAdmin() {
    const status = getCookie("status");
    if (status !== "admin") {
      window.location.href = "/adminLogin";
    }
  }
  
  redirectIfNotAdmin();
  
  document.getElementById("addSchoolForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const country = document.getElementById("country").value;
    const schoolName = document.getElementById("schoolName").value.trim();
  
    const msg = document.getElementById("message");
  
    if (!country || !schoolName) {
      msg.textContent = "Please fill in all fields.";
      msg.style.color = "red";
      return;
    }
  
    try {
      await firebase.firestore()
        .collection("schools")
        .doc(country)
        .collection("schools")
        .doc(schoolName)
        .set({ name: schoolName });
  
      msg.textContent = `✅ ${schoolName} added under ${country}`;
      msg.style.color = "green";
      document.getElementById("addSchoolForm").reset();
    } catch (error) {
      console.error("Error adding school:", error);
      msg.textContent = "❌ Error adding school.";
      msg.style.color = "red";
    }
  });
  