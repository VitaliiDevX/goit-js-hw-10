import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import errorUrl from '../img/error.svg';

const refs = {
  startBtn: document.querySelector('[data-start]'),
  datetimePicker: document.querySelector('#datetime-picker'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onOpen(selectedDates, dateStr, instance) {
    instance.input.classList.add('flatpickr-active');
  },
  onClose(selectedDates, dateStr, instance) {
    instance.input.classList.remove('flatpickr-active');
    const chosenDate = selectedDates[0];

    if (chosenDate.getTime() <= Date.now()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
        backgroundColor: '#ef4040',
        titleColor: '#fff',
        messageColor: '#fff',
        progressBarColor: '#b51b1b',
        close: true,
        iconUrl: errorUrl,
        class: 'my-toast',
      });

      refs.startBtn.disabled = true;
      return;
    }

    userSelectedDate = chosenDate;
    refs.startBtn.disabled = false;
  },
};

let userSelectedDate = null;
let timerId = null;

refs.startBtn.disabled = true;

refs.startBtn.addEventListener('click', onStartTimerClick);

flatpickr(refs.datetimePicker, options);

function onStartTimerClick() {
  if (!userSelectedDate) return;

  refs.startBtn.disabled = true;
  refs.datetimePicker.disabled = true;

  updateCountdown();
  timerId = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
  const diff = userSelectedDate.getTime() - Date.now();

  if (diff <= 0) {
    clearInterval(timerId);

    setTime({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });

    refs.datetimePicker.disabled = false;
    refs.startBtn.disabled = true;

    return;
  }

  const time = convertMs(diff);

  setTime({
    days: time.days,
    hours: time.hours,
    minutes: time.minutes,
    seconds: time.seconds,
  });
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function setTime({ days, hours, minutes, seconds }) {
  refs.days.textContent = padZero(days);
  refs.hours.textContent = padZero(hours);
  refs.minutes.textContent = padZero(minutes);
  refs.seconds.textContent = padZero(seconds);
}

function padZero(value) {
  return String(value).padStart(2, '0');
}
