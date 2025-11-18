import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import errorUrl from '../img/error.svg';
import okUrl from '../img/ok.svg';

document.querySelector('.form').addEventListener('submit', e => {
  e.preventDefault();

  const form = e.currentTarget;
  const delay = Number(form.elements.delay.value);
  const state = form.elements.state.value;

  form.reset();

  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  })
    .then(delay => {
      iziToast.success({
        title: 'OK',
        message: `Fulfilled after ${delay}ms`,
        position: 'topRight',
        backgroundColor: '#59a10d',
        titleColor: '#fff',
        messageColor: '#fff',
        progressBarColor: '#326101',
        close: true,
        iconUrl: okUrl,
        class: 'ok-toast',
      });
    })
    .catch(delay => {
      iziToast.error({
        title: 'Error',
        message: `Rejected after ${delay}ms`,
        position: 'topRight',
        backgroundColor: '#ef4040',
        titleColor: '#fff',
        messageColor: '#fff',
        progressBarColor: '#b51b1b',
        close: true,
        iconUrl: errorUrl,
        class: 'my-toast',
      });
    });
});
