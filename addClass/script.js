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
  
  const countrySelect = document.getElementById("country");
  const schoolSelect = document.getElementById("school");
  const gradeSelect = document.getElementById("grade");
  const sectionSelect = document.getElementById("section");
  const form = document.getElementById("addClassForm");
  const msg = document.getElementById("message");
  
  // Show school list when country is selected
  countrySelect.addEventListener("change", async () => {
    const country = countrySelect.value;
    schoolSelect.innerHTML = '<option value="">Select a School</option>';
  
    if (!country) {
      schoolSelect.style.display = "none";
      return;
    }
  
    try {
      const schoolSnap = await db.collection("schools").doc(country).collection("schools").get();
      schoolSnap.forEach(doc => {
        const opt = document.createElement("option");
        opt.value = doc.id;
        opt.textContent = doc.id;
        schoolSelect.appendChild(opt);
      });
  
      schoolSelect.style.display = "block";
      gradeSelect.style.display = "none";
      sectionSelect.style.display = "none";
    } catch (err) {
      console.error("Error loading schools:", err);
      msg.textContent = "❌ Could not load schools.";
      msg.style.color = "red";
    }
  });
  
  // Show grade dropdown
  schoolSelect.addEventListener("change", () => {
    if (schoolSelect.value) {
      gradeSelect.style.display = "block";
    } else {
      gradeSelect.style.display = "none";
      sectionSelect.style.display = "none";
    }
  });
  
  // Show section dropdown
  gradeSelect.addEventListener("change", () => {
    if (gradeSelect.value) {
      sectionSelect.style.display = "block";
    } else {
      sectionSelect.style.display = "none";
    }
  });
  
  // Submit class
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const country = countrySelect.value;
    const school = schoolSelect.value;
    const grade = gradeSelect.value;
    const section = sectionSelect.value;
  
    if (!country || !school || !grade || !section) {
      msg.textContent = "❌ Please fill all fields.";
      msg.style.color = "red";
      return;
    }
  
    const classId = `${grade}${section}`;
  
    try {
      await db.collection("schools")
        .doc(country)
        .collection("schools")
        .doc(school)
        .collection("classes")
        .doc(classId)
        .set({ grade, section });
  
      msg.textContent = `✅ Class ${classId} added to ${school}`;
      msg.style.color = "green";
      form.reset();
      gradeSelect.style.display = "none";
      sectionSelect.style.display = "none";
      schoolSelect.style.display = "none";
    } catch (err) {
      console.error("Error adding class:", err);
      msg.textContent = "❌ Error adding class.";
      msg.style.color = "red";
    }
  });
  