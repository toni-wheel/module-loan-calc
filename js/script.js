// Получение ссылок на HTML-элементы с помощью их идентификаторов
const btn = document.querySelector("#loan-btn");
const amountInput = document.querySelector("#loan-amount");
const precentInput = document.querySelector("#loan-precent");
const termInput = document.querySelector("#loan-term");

const paymentOut = document.querySelector("#loan-payment");
const overOut = document.querySelector("#loan-over");
const totalOut = document.querySelector("#loan-total");
const chart = document.querySelector("#loan-chart");

// Функция для округления числа до двух десятичных знаков
function numRound(num) {
  let roundedNumber = Number(num.toFixed(2));
  return roundedNumber;
}

// Начальные значения для суммы, процентной ставки и срока кредита
const defaultOption = {
  amount: 300000,
  precent: 20,
  term: 60,
};

// Установка начальных значений в поля ввода
amountInput.value = defaultOption.amount;
precentInput.value = defaultOption.precent;
termInput.value = defaultOption.term;

// Класс Loan для расчета кредита
class Loan {
  option = {};
  result = {};
  constructor(option) {
    this.option = option;
    this.calculate(); // Вызов метода calculate() при создании экземпляра класса
  }
  // Установка суммы, процентной ставки и срока кредита
  set amount(num) {
    this.option.amount = Number(num);
  }
  set precent(num) {
    this.option.precent = Number(num);
  }
  set term(num) {
    this.option.term = Number(num);
  }
  // Получение ежемесячного платежа, общей суммы и суммы переплаты
  get monthlyPayment() {
    return numRound(this.result.monthlyPayment);
  }
  get total() {
    return numRound(this.result.total);
  }
  get over() {
    return numRound(this.result.over);
  }
  // Расчет кредита
  calculate() {
    const monthlyPrecent = this.option.precent / (12 * 100);
    this.result.monthlyPayment =
      (this.option.amount * monthlyPrecent) /
      (1 - Math.pow(1 + monthlyPrecent, -this.option.term));
    this.result.total = this.result.monthlyPayment * this.option.term;
    this.result.over = this.result.total - this.option.amount;
    this.update(); // Вызов метода update() для обновления данных на странице
  }
  // Обновление данных на странице
  update() {
    paymentOut.textContent = this.monthlyPayment;
    overOut.textContent = this.over;
    totalOut.textContent = this.total;
  }
}

// Создание объекта myLoan класса Loan с начальными значениями
const myLoan = new Loan(defaultOption);

// Обработчик события для кнопки "Рассчитать"
btn.addEventListener("click", (e) => {
  e.preventDefault();
  // Обновление значений кредита и расчет новых данных
  myLoan.amount = amountInput.value;
  myLoan.precent = precentInput.value;
  myLoan.term = termInput.value;
  myLoan.calculate();
  // Обновление данных на графике
  myChart.data.datasets[0].data[0] = myLoan.option.amount;
  myChart.data.datasets[0].data[1] = myLoan.over;
  myChart.update();
});

// Получение контекста рисования для создания графика
const ctx = document.getElementById("loan-chart").getContext("2d");

// Создание круговой диаграммы с помощью библиотеки Chart.js
const myChart = new Chart(ctx, {
  // Указываем тип диаграммы - круговая диаграмма (pie)
  type: "pie",
  // Задаем данные для диаграммы
  data: {
    labels: ["Основной долг", "Проценты"], // Метки для каждого сектора
    datasets: [
      {
        // Название набора данных
        label: "Распределение кредита",
        // Данные для каждого сектора: основной долг и проценты
        data: [myLoan.option.amount, myLoan.over],
        // Цвета для секторов диаграммы
        backgroundColor: ["rgba(54, 162, 235, 0.2)", "rgba(255, 206, 86, 0.2)"],
        // Цвета границ для секторов диаграммы
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)"],
        // Ширина границы для секторов диаграммы
        borderWidth: 1,
      },
    ],
  },
  // Опции диаграммы
  options: {
    responsive: true, // Делаем диаграмму адаптивной
    plugins: {
      legend: {
        position: "top", // Положение легенды над диаграммой
      },
      title: {
        display: true,
        text: "Визуализация Кредита", // Заголовок диаграммы
      },
    },
  },
});
