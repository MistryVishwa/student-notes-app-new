const billInput = document.getElementById("bill");
const customTipInput = document.getElementById("custom-tip");
const peopleInput = document.getElementById("people");
const calculateBtn = document.getElementById("calculate-btn");
const tipAmount = document.getElementById("tip-amount");
const totalAmount = document.getElementById("total-amount");
const perPerson = document.getElementById("per-person");
const pills = document.querySelectorAll(".pill");

let selectedTip = 0;

pills.forEach(function (pill) {
  pill.addEventListener("click", function () {
    pills.forEach(function (p) {
      p.classList.remove("active");
    });
    pill.classList.add("active");
    selectedTip = parseInt(pill.dataset.tip);
    customTipInput.value = "";
  });
});

calculateBtn.addEventListener("click", function () {
  const bill = parseFloat(billInput.value);
  const people = parseInt(peopleInput.value);
  const customTip = parseFloat(customTipInput.value);

  const tipPercent = customTip || selectedTip;

  if (!bill || bill <= 0) {
    alert("Please enter a valid bill amount.");
    return;
  }

  if (!people || people < 1) {
    alert("Please enter a valid number of people.");
    return;
  }

  if (!tipPercent || tipPercent <= 0) {
    alert("Please select or enter a tip percentage.");
    return;
  }

  const tip = (bill * tipPercent) / 100;
  const total = bill + tip;
  const split = total / people;

  tipAmount.textContent = "₦" + tip.toFixed(2);
  totalAmount.textContent = "₦" + total.toFixed(2);
  perPerson.textContent = "₦" + split.toFixed(2);
});