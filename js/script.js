const btn = document.querySelector("#loan-btn");
const amountInput = document.querySelector("#loan-amount");
const precentInput = document.querySelector("#loan-precent");
const termInput = document.querySelector("#loan-term");

const paymentOut = document.querySelector("#loan-payment");
const overOut = document.querySelector("#loan-over ");
const totalOut = document.querySelector("#loan-total");

const chart = document.querySelector("#loan-chart");

function numRound(num) {
  let roundedNumber = Number(num.toFixed(2));
  return roundedNumber;
}

const defaultOption = {
  amount: 300000,
  precent: 20,
  term: 60,
};

amountInput.value = defaultOption.amount;
precentInput.value = defaultOption.precent;
termInput.value = defaultOption.term;

class Loan {
  option = {};
  result = {};
  constructor(option) {
    this.option = option;
    this.calculate();
  }
  set amount(num) {
    this.option.amount = Number(num);
  }
  set precent(num) {
    this.option.precent = Number(num);
  }
  set term(num) {
    this.option.term = Number(num);
  }
  get monthlyPayment() {
    return numRound(this.result.monthlyPayment);
  }
  get total() {
    return numRound(this.result.total);
  }
  get over() {
    return numRound(this.result.over);
  }
  calculate() {
    const monthlyPrecent = this.option.precent / (12 * 100);
    this.result.monthlyPayment =
      (this.option.amount * monthlyPrecent) /
      (1 - Math.pow(1 + monthlyPrecent, -this.option.term));
    this.result.total = this.result.monthlyPayment * this.option.term;
    this.result.over = this.result.total - this.option.amount;
    this.update();
  }
  update() {
    paymentOut.value = this.monthlyPayment;
    overOut.value = this.over;
    totalOut.value = this.total;
  }
}

const myLoan = new Loan(defaultOption);

btn.addEventListener("click", (e) => {
  e.preventDefault();
  myLoan.amount = amountInput.value;
  myLoan.precent = precentInput.value;
  myLoan.term = termInput.value;
  myLoan.calculate();
  myChart.data.datasets[0].data[0] = myLoan.option.amount;
  myChart.data.datasets[0].data[1] = myLoan.over;
  myChart.update();
});

const ctx = document.getElementById("loan-chart").getContext("2d");

const myChart = new Chart(ctx, {
  type: "pie",
  data: {
    labels: ["Основной долг", "Проценты"],
    datasets: [
      {
        label: "Распределение кредита",
        data: [myLoan.option.amount, myLoan.over],
        backgroundColor: ["rgba(54, 162, 235, 0.2)", "rgba(255, 206, 86, 0.2)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)"],
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Визуализация Кредита",
      },
    },
  },
});
