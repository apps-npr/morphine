const MORPHINE_MG_PER_ML = 10;

const ccInput = document.getElementById("ccHr");
const mgInput = document.getElementById("mgHr");
const concSelect = document.getElementById("concentration");
const customConc = document.getElementById("customConc");
const resultDiv = document.getElementById("result");

/* ---------- Helpers ---------- */

function getMlPerMg() {
  if (concSelect.value === "custom") {
    return parseFloat(customConc.value);
  }
  return parseFloat(concSelect.value);
}

function renalAdvice(egfr) {
  if (isNaN(egfr)) return "";
  if (egfr >= 60) return "eGFR ≥60: ใช้ขนาดปกติ";
  if (egfr >= 30) return "eGFR 30–59: แนะนำเริ่มขนาดต่ำและปรับตามอาการ";
  if (egfr >= 10) return "eGFR 10–29: ลดขนาด 25–50% และติดตาม sedation";
  return "eGFR <10: หลีกเลี่ยงหรือใช้ขนาดต่ำมาก พร้อม monitoring ใกล้ชิด";
}

/* ---------- UI Events ---------- */

concSelect.addEventListener("change", () => {
  customConc.style.display =
    concSelect.value === "custom" ? "block" : "none";

  const action = document.querySelector(
    'input[name="concAction"]:checked'
  ).value;

  if (ccInput.value || mgInput.value) {
    const msg =
      action === "clear"
        ? "เปลี่ยนความเข้มข้นจะล้างค่า rate และ dose เดิมทั้งหมด\nต้องการดำเนินการต่อหรือไม่?"
        : "เปลี่ยนความเข้มข้นจะคำนวณ rate ใหม่อัตโนมัติ\nต้องการดำเนินการต่อหรือไม่?";

    if (!confirm(msg)) return;
  }

  if (action === "clear") {
    ccInput.value = "";
    mgInput.value = "";
  }

  if (action === "recalc") {
    const mlPerMg = getMlPerMg();
    const mg = parseFloat(mgInput.value);
    if (!isNaN(mg) && !isNaN(mlPerMg)) {
      ccInput.value = (mg * mlPerMg).toFixed(2);
    } else {
      ccInput.value = "";
    }
  }

  resultDiv.innerHTML = "";
});

ccInput.addEventListener("input", () => {
  const mlPerMg = getMlPerMg();
  const cc = parseFloat(ccInput.value);
  if (!isNaN(cc) && !isNaN(mlPerMg)) {
    mgInput.value = (cc / mlPerMg).toFixed(2);
  } else {
    mgInput.value = "";
  }
});

mgInput.addEventListener("input", () => {
  const mlPerMg = getMlPerMg();
  const mg = parseFloat(mgInput.value);
  if (!isNaN(mg) && !isNaN(mlPerMg)) {
    ccInput.value = (mg * mlPerMg).toFixed(2);
  } else {
    ccInput.value = "";
  }
});

/* ---------- Main Calculation ---------- */

function calculate() {
  const egfr = parseFloat(document.getElementById("egfr").value);
  document.getElementById("renalNote").innerText = renalAdvice(egfr);

  const mlPerMg = getMlPerMg();
  const ccHr = parseFloat(ccInput.value);
  const mgHr = parseFloat(mgInput.value);
  const hours = parseFloat(document.getElementById("hours").value);

  if ([mlPerMg, ccHr, mgHr, hours].some(v => isNaN(v))) {
    resultDiv.innerHTML =
      "<b style='color:#b91c1c'>กรุณากรอกข้อมูลให้ครบก่อนคำนวณ</b>";
    return;
  }

  const totalMg = mgHr * hours;
  const totalMlMorphine = totalMg / MORPHINE_MG_PER_ML;
  const vials = Math.ceil(totalMlMorphine);

  resultDiv.innerHTML = `
    <b>การคำนวณ</b><br><br>

    ความเข้มข้น =
    <span style="color:#2563eb;font-weight:bold">
      1 mg ต่อ ${mlPerMg} ml
    </span><br>

    อัตราให้ยา =
    <span style="color:#16a34a;font-weight:bold">
      ${ccHr.toFixed(2)} cc/hr
    </span>
    =
    <span style="color:#7c3aed;font-weight:bold">
      ${mgHr.toFixed(2)} mg/hr
    </span><br><br>

    ระยะเวลาให้ยา
    <b>${hours}</b> ชั่วโมง<br>

    ปริมาณ Morphine รวม =
    <span style="color:#dc2626;font-weight:bold">
      ${totalMg.toFixed(1)} mg
    </span><br>

    ใช้ Morphine ทั้งหมด =
    <span style="color:#dc2626;font-weight:bold">
      ${vials} vial(s)
    </span>
  `;
}
