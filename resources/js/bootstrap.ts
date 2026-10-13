import axios from 'axios';

// ⚠️ IMPORTANTE: Enviar cookies em todas as requisições
axios.defaults.withCredentials = true;

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['Accept'] = 'application/json';

// CSRF Token
const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute('content');

if (csrfToken) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
} else {
    const xsrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

    if (xsrfToken) {
        axios.defaults.headers.common['X-XSRF-TOKEN'] =
            decodeURIComponent(xsrfToken);
    }
}

export { axios };
