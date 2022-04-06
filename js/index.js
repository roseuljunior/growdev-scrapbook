document.addEventListener('DOMContentLoaded', async () => {
    const token = toGetToken();
    const { status } = await doPost('/checkToken', { token });

    if (status === 200) {
        location = './errands.html';
    };
});

function toGetToken() {
    const token = localStorage.getItem('token');
    
    return token;
};

function setToken(token) {
    localStorage.setItem('token', token);
};

async function userLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await doPost('/user/login', {email, password});

    if (response.status === 200) {
        alert(response.data.mensagem);
        setToken(response.data.token);
        location = './errands.html';
        return;
    };

    alert('Não foi possível efetuar o login.');
};

async function checkLogin() {
    const { token } = toGetToken();
    if (token) {
        const { data, status } = await doVerifyToken({ token });

        if (data.token) {
            setToken(localStorage.getItem('token'), data.token);
            location = './errands.html'
        };

        if (status === 200) {
            alert('Usuário logado.');
            location = './errands.html';
        };
    };
};

async function getUsers() {
    const { data } = await doGetData();
    return data.users;
};

async function logIn(event) {
    event.preventDefault();

    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;


    const data = await doPost('/user/login', { email, password });

    const { token, mensagem } = data;

    if (token) {
        setToken(token);
        alert(mensagem);
        location = './errands.html';
    } else {
        alert('Opps... Usuário ou senha incorretos.');
    };
};