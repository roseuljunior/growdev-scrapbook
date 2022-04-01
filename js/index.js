document.addEventListener("DOMContentLoaded", async () => {
    const token = getToken();
    const { status } = await doPost('/checkToken', { token });

    if (status === 200) {
        location = './errands.html';
    }
})

function getToken() {
    const token = localStorage.getItem('token');
    
    return token;
}

function setToken(token) {
    localStorage.setItem('token', token);
}

async function userLogin(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await doPost("/user/login", {email, password});

    if (response.status === 200) {
        alert(response.data.mensagem);
        setToken(response.data.token);
        location = './errands.html';
        return
    }

    alert("Erro");
}

















async function checkLogin() {
    const { token } = getTokens();
    if (token) {
        const { data, status } = await doVerifyToken({ token })

        if (data.token) {
            setTokens(localStorage.getItem('token'), data.token);
            location = './errands.html'
        }

        if (status === 200) {
            alert('Usuário logado. Redirecionando para a página principal.');
            location = './errands.html'
        }
    }
}

async function getUsers() {
    const { data } = await doGetData();
    return data.users;
}

async function logIn(event) {
    event.preventDefault();

    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;


    const data = await doPost('/user/login', { email, password });

    const { token, mensagem } = data;

    if (token) {
        setTokens(token);
        alert(mensagem);
        location = './errands.html'
    } else {
        alert("Usuário ou senha incorretos.");
    }
}