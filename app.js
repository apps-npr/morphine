
const MORPHINE_MG_PER_ML = 10;

document.getElementById("concentration").addEventListener("change", e => {
document.getElementById("customConc").style.display =
e.target.value === "custom" ? "block" : "none";
});

function renalAdvice(egfr) {
if (egfr === '' || isNaN(egfr)) return '';
if (egfr >= 60) return 'eGFR ≥60: ใช้ขนาดปกติ';
if (egfr >= 30) return 'eGFR 30–59: แนะนำเริ่มขนาดต่ำและปรับตามอาการ';
if (egfr >= 10) return 'eGFR 10–29: ลดขนาด 25–50% และติดตาม sedation';
return 'eGFR <10: หลีกเลี่ยงหรือใช้ขนาดต่ำมาก พร้อม monitoring ใกล้ชิด';
}

function calculate() {
let egfr = document.getElementById("egfr").value;
document.getElementById("renalNote").innerText = renalAdvice(egfr);

let concSelect = document.getElementById("concentration").value;
let mlPerMg =
concSelect === "custom"
? parseFloat(document.getElementById("customConc").value)
: parseFloat(concSelect);

let ccHr = parseFloat(document.getElementById("ccHr").value);
let mgHr = parseFloat(document.getElementById("mgHr").value);
let hours = parseFloat(document.getElementById("hours").value);

if (!isNaN(ccHr) && document.activeElement.id === "ccHr") {
mgHr = ccHr / mlPerMg;
document.getElementById("mgHr").value = mgHr.toFixed(2);
}

if (!isNaN(mgHr) && document.activeElement.id === "mgHr") {
ccHr = mgHr * mlPerMg;
document.getElementById("ccHr").value = ccHr.toFixed(2);
}

const totalMg = mgHr * hours;
const totalMlMorphine = totalMg / MORPHINE_MG_PER_ML;
const vials = Math.ceil(totalMlMorphine);

document.getElementById("result").innerHTML = `
<b>ผลลัพธ์</b><br>
Rate: ${ccHr.toFixed(2)} cc/hr<br>
Dose: ${mgHr.toFixed(2)} mg/hr<br>
รวม ${totalMg.toFixed(1)} mg<br>
ใช้ Morphine ${vials} vial(s)
`;
}
