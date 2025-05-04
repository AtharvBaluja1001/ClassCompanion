const subjects = [
    "IGCSE First Language English",
    "IGCSE Hindi as a Second Language",
    "IGCSE French as a Foreign Language",
    "IGCSE Literature in English",
    "IGCSE Economics",
    "IGCSE History",
    "IGCSE Business Studies",
    "IGCSE International Mathematics",
    "IGCSE Additional Mathematics",
    "IGCSE Physics",
    "IGCSE Chemistry",
    "IGCSE Biology",
    "IGCSE Information and Communication Technology",
    "IGCSE Computer Science",
    "IGCSE Global Perspectives",
    "IGCSE Visual Art"
  ];
  
  const countrySel = document.getElementById("country");
  const schoolSel = document.getElementById("school");
  const classSel = document.getElementById("class");
  const grid = document.getElementById("timetableGrid");
  const form = document.getElementById("timetableForm");
  const msg = document.getElementById("message");
  
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const periods = 11;
  
  // Load Schools
  countrySel.addEventListener("change", async () => {
    const country = countrySel.value;
    schoolSel.innerHTML = '<option value="">Select School</option>';
    classSel.innerHTML = '<option value="">Select Class</option>';
    grid.style.display = "none";
  
    if (!country) {
      schoolSel.style.display = "none";
      classSel.style.display = "none";
      return;
    }
  
    const snap = await db.collection("schools").doc(country).collection("schools").get();
    snap.forEach(doc => {
      const opt = document.createElement("option");
      opt.value = doc.id;
      opt.textContent = doc.id;
      schoolSel.appendChild(opt);
    });
    schoolSel.style.display = "block";
  });
  
  // Load Classes
  schoolSel.addEventListener("change", async () => {
    const country = countrySel.value;
    const school = schoolSel.value;
    classSel.innerHTML = '<option value="">Select Class</option>';
    grid.style.display = "none";
  
    if (!school) {
      classSel.style.display = "none";
      return;
    }
  
    const snap = await db.collection("schools")
      .doc(country).collection("schools")
      .doc(school).collection("classes").get();
  
    snap.forEach(doc => {
      const opt = document.createElement("option");
      opt.value = doc.id;
      opt.textContent = doc.id;
      classSel.appendChild(opt);
    });
    classSel.style.display = "block";
  });
  
  // Show timetable grid
  classSel.addEventListener("change", () => {
    if (classSel.value) {
      renderTimetable();
      grid.style.display = "block";
    } else {
      grid.style.display = "none";
    }
  });
  
  // Generate dropdown
  function createSubjectDropdown(name) {
    const select = document.createElement("select");
    select.name = name;
    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent = "--";
    select.appendChild(empty);
    subjects.forEach(sub => {
      const opt = document.createElement("option");
      opt.value = sub;
      opt.textContent = sub;
      select.appendChild(opt);
    });
    return select;
  }
  
  // Render timetable grid
  function renderTimetable() {
    grid.innerHTML = "";
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
  
    headRow.appendChild(document.createElement("th")); // Blank corner
  
    for (let i = 1; i <= periods; i++) {
      const th = document.createElement("th");
      th.textContent = "Period " + i;
      headRow.appendChild(th);
    }
  
    thead.appendChild(headRow);
    table.appendChild(thead);
  
    const tbody = document.createElement("tbody");
  
    days.forEach(day => {
      const row = document.createElement("tr");
      const th = document.createElement("th");
      th.textContent = day;
      row.appendChild(th);
  
      for (let i = 1; i <= periods; i++) {
        const cell = document.createElement("td");
        for (let j = 1; j <= 3; j++) {
          const sel = createSubjectDropdown(`${day}_${i}_${j}`);
          cell.appendChild(sel);
        }
        row.appendChild(cell);
      }
      tbody.appendChild(row);
    });
  
    table.appendChild(tbody);
    grid.appendChild(table);
  }
  
  // Save timetable
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const country = countrySel.value;
    const school = schoolSel.value;
    const classId = classSel.value;
  
    const timetable = {};
  
    days.forEach(day => {
      timetable[day] = {};
      for (let i = 1; i <= periods; i++) {
        const slots = [];
        for (let j = 1; j <= 3; j++) {
          const value = form[`${day}_${i}_${j}`].value;
          if (value) slots.push(value);
        }
        timetable[day][`Period_${i}`] = slots;
      }
    });
  
    try {
      await db.collection("schools")
        .doc(country).collection("schools")
        .doc(school).collection("classes")
        .doc(classId).set({ timetable }, { merge: true });
  
      msg.textContent = "✅ Timetable saved!";
      msg.style.color = "green";
    } catch (err) {
      console.error(err);
      msg.textContent = "❌ Error saving timetable.";
      msg.style.color = "red";
    }
  });
  