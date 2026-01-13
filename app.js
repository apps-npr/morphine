const MORPHINE_MG_PER_ML = 10;

const ccInput = document.getElementById("ccHr");
const mgInput = document.getElementById("mgHr");

document.getElementById("concentration").addEventListener("change", e => {
  document.getElementById("customConc").style.display =
    e.target.value === "custom" ? "block" : "none";
});

ccInput.addEventListener("input", () => {
  const mlPerMg = getMlPerMg();
  const cc = parseFloat(ccInput.value);
  if (!isNaN(cc) && mlPerMg) {
    mgInput.value = (cc / mlPerMg).toFixed(2);
  } else {
    mgInput.value = "";
  }
});

mgInput.addEventListener("input", () => {
  const mlPerMg = getMlPerMg();
  const mg = parseFloat(mgInput.value);
  if (!isNaN(mg) && mlPerMg) {
    ccInput.value = (mg * mlPerMg).toFixed(2);
  } else {
    ccInput.value = "";
  }
});

function getMlPerMg() {
  const conc = document.getElementById("concentration").value;
  if (conc === "custom") {
    return parseFloat(document.getElementById("customConc").value);
  }
  return parseFloat(conc);
}

function renalAdvice(egfr) {
  if (isNaN(egfr)) return "";
  if (egfr >= 60) return "eGFR ≥60: ใช้ขนาดปกติ";
  if (egfr >= 30) return "eGFR 30–59: แนะนำเริ่มขนาดต่ำและปรับตามอาการ";
  if (egfr >= 10) return "eGFR 10–29: ลดขนาด 25–50% และติดตาม sedation";
  return "eGFR <10: หลีกเลี่ยงหรือใช้ขนาดต่ำมาก พร้อม monitoring ใกล้ชิด";
}

function calculate() {
  const egfr = parseFloat(document.getElementById("egfr").value);
  document.getElementById("renalNote").innerText = renalAdvice(egfr);

  const mlPerMg = getMlPerMg();
  const ccHr = parseFloat(ccInput.value);
  const mgHr = parseFloat(mgInput.value);
  const hours = parseFloat(document.getElementById("hours").value);

  if ([mlPerMg, ccHr, mgHr, hours].some(v => isNaN(v))) {
    document.getElementById("result").innerHTML =
      "<b style='color:#b91c1c'>กรุณากรอกข้อมูลให้ครบ</b>";
    return;
  }

  const totalMg = mgHr * hours;
  const totalMl = totalMg / MORPHINE_MG_PER_ML;
  const vials = Math.ceil(totalMl);

  document.getElementById("result").innerHTML = `
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
    <span style="font-weight:bold">${hours}</span> ชั่วโมง<br>

    ปริมาณรวม =
    <span style="color:#dc2626;font-weight:bold">
      ${totalMg.toFixed(1)} mg
    </span><br>

    ใช้ Morphine ทั้งหมด =
    <span style="color:#dc2626;font-weight:bold">
      ${vials} vial(s)
    </span>
  `;
}
