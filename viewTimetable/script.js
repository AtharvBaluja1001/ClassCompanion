const countrySel = document.getElementById("country");
const schoolSel = document.getElementById("school");
const classSel = document.getElementById("class");
const form = document.getElementById("viewForm");
const grid = document.getElementById("timetableGrid");
const msg = document.getElementById("message");

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const periods = 11;

countrySel.addEventListener("change", async () => {
  const country = countrySel.value;
  schoolSel.innerHTML = '<option value="">Select School</option>';
  classSel.innerHTML = '<option value="">Select Class</option>';
  grid.innerHTML = "";
  msg.textContent = "";

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

schoolSel.addEventListener("change", async () => {
  const country = countrySel.value;
  const school = schoolSel.value;
  classSel.innerHTML = '<option value="">Select Class</option>';
  grid.innerHTML = "";
  msg.textContent = "";

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

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const country = countrySel.value;
  const school = schoolSel.value;
  const classId = classSel.value;
  msg.textContent = "";
  grid.innerHTML = "";

  if (!country || !school || !classId) return;

  try {
    const doc = await db.collection("schools")
      .doc(country).collection("schools")
      .doc(school).collection("classes")
      .doc(classId).get();

    const data = doc.data();

    if (!data || !data.timetable) {
      msg.textContent = "❌ No timetable found for this class.";
      return;
    }

    const timetable = data.timetable;
    const table = document.createElement("table");

    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    headRow.appendChild(document.createElement("th"));

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
        const slots = timetable[day]?.[`Period_${i}`] || [];
        if (slots.length > 0) {
          slots.forEach(sub => {
            const p = document.createElement("p");
            p.textContent = sub;
            cell.appendChild(p);
          });
        } else {
          cell.textContent = "-";
        }
        row.appendChild(cell);
      }

      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    grid.appendChild(table);
  } catch (err) {
    console.error(err);
    msg.textContent = "❌ Error loading timetable.";
  }
});
