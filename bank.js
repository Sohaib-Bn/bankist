'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and local

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

////////////////////////////////////////////////////////////

const generateLogin = document.querySelector('.generate--login');
const action1 = document.querySelector('.action--1');
const action2 = document.querySelector('.action--2');
const loginForm = document.querySelector('.login');
const emailSubmit = document.querySelector('.submit--email');
const infoSubmit = document.querySelector('.submit--info');
const pinSubmit = document.querySelector('.submit--pin');
const usernameSubmit = document.querySelector('.submit--username');

const emailInput = document.querySelector('.input--email');
const phoneInput = document.querySelector('.input--phone');
const currencyInput = document.querySelector('.input--currency');
const pinInput = document.querySelector('.input--pin');
const usernameInput = document.querySelector('.input--username');

////////////////////////////////////////////////////
// GET USER DATA

// let currentAccount, timer;

class App {
  accounts = [];
  currAccount;
  sorted = false;
  timer;
  constructor() {
    btnLogin.addEventListener('click', this._loginAccount.bind(this));
    btnTransfer.addEventListener('click', this._transferMoney.bind(this));
    btnLoan.addEventListener('click', this._loanRequest.bind(this));
    btnClose.addEventListener('click', this._closeAccount.bind(this));
    btnSort.addEventListener('click', this._sortMovements.bind(this));
  }

  _loginAccount(e) {
    // Prevent form from submitting
    e.preventDefault();

    this.currAccount = this.accounts.find(acc => {
      return acc.username === inputLoginUsername.value;
    });

    if (this.currAccount) {
      if (this.currAccount.pin === Number(inputLoginPin.value)) {
        this.sorted = false;
        // Display UI and message
        labelWelcome.textContent = `Welcome back, ${
          this.currAccount.owner.split(' ')[0]
        }`;
        containerApp.style.opacity = 1;
        containerApp.style.display = 'grid';
        document.querySelector('.next').style.display = 'none';

        // Clear input fields
        inputLoginUsername.value = inputLoginPin.value = '';
        inputLoginPin.blur();

        // DISPLAY CURRENT DATE
        const currDate = new Date();
        const options = {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        };
        labelDate.textContent = new Intl.DateTimeFormat(
          this.currAccount.local,
          options
        ).format(currDate);

        // Update UI
        this._updateUI(this.currAccount);

        // TIMER COUNTER
        if (this.timer) clearInterval(this.timer);
        this.timer = this._timeCounter();
      }
    }
  }

  _updateUI(acc) {
    // Display movements
    this._displayMovements(acc);

    // Display balance
    this._calcDisplayBalance(acc);

    // Display summary
    this._calcDisplaySummary(acc);
  }

  _displayMovements(acc, sort = false) {
    containerMovements.innerHTML = '';

    const movs = sort
      ? acc.movements.slice().sort((a, b) => a - b)
      : acc.movements;

    movs.forEach(function (mov, i) {
      const type = mov > 0 ? 'deposit' : 'withdrawal';

      const movementDate = new Date(acc.movementsDates[i]);

      const displayDate = app._calcDaysPassed(movementDate, acc.local);

      const html = `
        <div class="movements__row">
         <div class="movements__type movements__type--${type}">${
        i + 1
      } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${app._formatNumbers(
          mov,
          acc.local,
          acc.currency
        )}</div>
        </div>
        `;

      containerMovements.insertAdjacentHTML('afterbegin', html);
    });
  }

  _calcDisplayBalance(acc) {
    acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
    labelBalance.textContent = this._formatNumbers(
      acc.balance,
      acc.local,
      acc.currency
    );
  }

  _calcDisplaySummary(acc) {
    const incomes = acc.movements
      .filter(mov => mov > 0)
      .reduce((acc, mov) => acc + mov, 0);
    labelSumIn.textContent = this._formatNumbers(
      incomes,
      acc.local,
      acc.currency
    );

    const out = acc.movements
      .filter(mov => mov < 0)
      .reduce((acc, mov) => acc + mov, 0);
    labelSumOut.textContent = this._formatNumbers(
      Math.abs(out),
      acc.local,
      acc.currency
    );

    const interest = acc.movements
      .filter(mov => mov > 0)
      .map(deposit => (deposit * acc.interestRate) / 100)
      .filter(int => {
        return int >= 1;
      })
      .reduce((acc, int) => acc + int, 0);
    labelSumInterest.textContent = this._formatNumbers(
      interest,
      acc.local,
      acc.currency
    );
  }

  _transferMoney(e) {
    e.preventDefault();
    const amount = Number(inputTransferAmount.value);
    const receiverAcc = this.accounts.find(
      acc => acc.username === inputTransferTo.value
    );

    inputTransferAmount.value = inputTransferTo.value = '';

    if (
      amount > 0 &&
      receiverAcc &&
      this.currAccount.balance >= amount &&
      receiverAcc.username !== this.currAccount.username
    ) {
      // Doing the transfer
      this.currAccount.movements.push(-amount);
      receiverAcc.movements.push(amount);

      // DISPLAY CURRENT DATE
      this.currAccount.movementsDates.push(new Date().toISOString());
      receiverAcc.movementsDates.push(new Date().toISOString());

      // Update UI
      this._updateUI(this.currAccount);
      // TIMER COUNTER
      if (this.timer) clearInterval(this.timer);
      this.timer = this._timeCounter();
    }
  }

  _loanRequest(e) {
    e.preventDefault();

    const amount = Number(inputLoanAmount.value);

    if (
      amount > 0 &&
      this.currAccount.movements.some(mov => mov >= amount * 0.1)
    ) {
      setTimeout(() => {
        // Add movement
        this.currAccount.movements.push(amount);

        // ADD MOV DATE
        this.currAccount.movementsDates.push(new Date().toISOString());

        // Update UI
        this._updateUI(this.currAccount);
      }, 2500);
    }
    inputLoanAmount.value = '';
    // TIMER COUNTER
    if (this.timer) clearInterval(this.timer);
    this.timer = this._timeCounter();
  }

  _closeAccount(e) {
    e.preventDefault();

    if (
      inputCloseUsername.value === this.currAccount.username &&
      Number(inputClosePin.value) === this.currAccount.pin
    ) {
      const index = this.accounts.findIndex(
        acc => acc.username === this.currAccount.username
      );

      // Delete account
      this.accounts.splice(index, 1);

      // Hide UI
      containerApp.style.opacity = 0;
    }

    inputCloseUsername.value = inputClosePin.value = '';
  }

  _sortMovements(e) {
    e.preventDefault();
    this._displayMovements(this.currAccount, !this.sorted);
    this.sorted = !this.sorted;
  }

  _formatNumbers(value, local, currency) {
    return new Intl.NumberFormat(local, {
      style: 'currency',
      currency: currency,
    }).format(value);
  }

  _calcDaysPassed(date, local) {
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    };
    const daysPassed = Math.round(
      Math.abs(new Date() - date) / (1000 * 60 * 60 * 24)
    );
    if (daysPassed === 0) return 'Today';
    if (daysPassed === 1) return 'Yestarday';
    if (daysPassed <= 7) return `${daysPassed} days ago`;
    return new Intl.DateTimeFormat(options, local).format(date);
  }

  _timeCounter() {
    // SET TIME TO 5MIN
    let time = 10 * 60;
    // CALL THE TIMER EVERY SECOND

    const tick = function () {
      let minutes = String(Math.trunc(time / 60)).padStart('2', '0');
      let seconds = String(time % 60).padStart('2', '0');
      labelTimer.textContent = `${minutes}:${seconds}`;
      if (time === 0) {
        // STOP TIMER AND LOGOUT WHEN TIMER EQUAL TO 0
        clearInterval(this.timer);
        labelWelcome.textContent = `Log in to get started`;
        containerApp.style.opacity = 0;
      }
      // DECREASE TIME BY ONE SECOND
      time--;
    };

    tick();

    this.timer = setInterval(tick, 1000);
    return this.timer;
  }
}

const app = new App();

class Account {
  movements = [];
  movementsDates = [];
  local = navigator.language;
  interestRate = 1.2; // % DEFAULT
  constructor(
    firstName,
    lastName,
    email,
    pin,
    username,
    phone,
    currency,
    movements,
    movementsDates
  ) {
    (this.owner = `${firstName.slice(0, 1).toUpperCase()}${firstName
      .slice(1)
      .toLowerCase()} ${lastName.slice(0, 1).toUpperCase()}${lastName
      .slice(1)
      .toLowerCase()}`),
      (this.email = email),
      (this.pin = pin),
      (this.username = username),
      (this.phone = phone),
      (this.currency = currency),
      (this.movements = movements),
      (this.movementsDates = movementsDates);
  }
}

// const accounts = [];
let email, phone, currency, pin, username, currAccount;

infoSubmit.addEventListener('click', function (e) {
  e.preventDefault();
  email = emailInput.value;
  phone = +phoneInput.value;
  currency = currencyInput.value;

  if (email.length === 0 || phone.length === 0) {
    alert('Your Fields is empty!');
    return false;
  }

  if (!Number.isFinite(phone)) {
    alert('Phone should be a number');
    phoneInput.value = '';
    return false;
  }

  if (email.length !== 0 && phone.length !== 0) {
    const localData = JSON.parse(localStorage.getItem('accounts'));
    if (localData) {
      currAccount = localData.find(acc => acc.email === email);
      console.log(currAccount);
      if (currAccount) {
        action1.style.flex = '0 0 65%';
        action2.style.opacity = 1;
      } else {
        emailInput.value = '';
        alert('Your Email is wrong!');
        return false;
      }
    }
  }
});

generateLogin.addEventListener('click', function (e) {
  e.preventDefault();
  loginForm.style.opacity = 0;
  pin = +pinInput.value;
  username = usernameInput.value;

  if (pin.length || username.length === 0) {
    alert('Your Fields is empty!');
    return false;
  }

  if (!Number.isFinite(pin)) {
    alert('Pin should be a number');
    pinInput.value = '';
    return false;
  }

  if (pin.length !== 0 && username.length !== 0) {
    loginForm.style.opacity = 1;
    inputLoginUsername.focus();

    const account = new Account(
      currAccount.firstName,
      currAccount.lastName,
      currAccount.email,
      pin,
      username,
      phone,
      currency,
      [],
      []
    );
    console.log(account);
    app.accounts.push(account);
  }
});

const acc1 = new Account(
  'sohaib',
  'benyamna',
  'sohaibbusinessbn@gmail.com',
  1111,
  'sb',
  '0771683974',
  'EUR',
  [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  [
    '2023-01-18T21:31:17.178Z',
    '2023-03-23T07:42:02.383Z',
    '2023-05-28T09:15:04.904Z',
    '2023-07-13T10:17:24.185Z',
    '2023-08-10T14:11:59.604Z',
    '2023-08-13T17:01:17.194Z',
    '2023-08-15T23:36:17.929Z',
    '2023-08-16T10:51:36.790Z',
  ]
);

const acc2 = new Account(
  'jasika',
  'david',
  'jasikadavid@gmail.com',
  2222,
  'jd',
  '099999999',
  'USD',
  [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  [
    '2023-11-01T13:15:33.035Z',
    '2023-11-30T09:48:16.867Z',
    '2023-12-25T06:04:23.907Z',
    '2023-01-25T14:18:46.235Z',
    '2023-02-05T16:33:06.386Z',
    '2023-04-10T14:43:26.374Z',
    '2023-06-25T18:49:59.371Z',
    '2023-07-26T12:01:20.894Z',
  ]
);
app.accounts.push(acc1, acc2);

// const accounts = [account1, account2];

// const account1 = {
//   owner: 'Sohaib Benyamna',
//   movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,

//   movementsDates: [
//     '2023-01-18T21:31:17.178Z',
//     '2023-03-23T07:42:02.383Z',
//     '2023-05-28T09:15:04.904Z',
//     '2023-07-13T10:17:24.185Z',
//     '2023-08-10T14:11:59.604Z',
//     '2023-08-13T17:01:17.194Z',
//     '2023-08-15T23:36:17.929Z',
//     '2023-08-16T10:51:36.790Z',
//   ],
//   username: 'sd',
//   currency: 'EUR',
//   local: 'pt-PT', // de-DE
// };

// const account2 = {
//   owner: 'Jasika David',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,

//   movementsDates: [
//     '2023-11-01T13:15:33.035Z',
//     '2023-11-30T09:48:16.867Z',
//     '2023-12-25T06:04:23.907Z',
//     '2023-01-25T14:18:46.235Z',
//     '2023-02-05T16:33:06.386Z',
//     '2023-04-10T14:43:26.374Z',
//     '2023-06-25T18:49:59.371Z',
//     '2023-07-26T12:01:20.894Z',
//   ],
//   username: 'jd',
//   currency: 'USD',
//   local: 'en-US',
// };
