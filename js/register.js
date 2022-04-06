document.addEventListener("DOMContentLoaded", async () => {
    const token = toGetToken();
    const { status } = await doPost('/checkToken', { token });

    if (status === 200) {
        location = './errands.html';
    };
});

async function createAccount(event) {
    event.preventDefault();
    
    const email = document.getElementById('username-register').value;
    const password = document.getElementById('password-register').value;

    let validCreateUser = false; 
    let mensagem = '';

    switch (true) {
        case email.length < 10:
            mensagem = 'Seu e-mail precisa ter mais de 10 caracteres.';
            break
        
        case email.indexOf('@') < 0 || email.indexOf('.co') < 0:
            mensagem = 'Endereço de e-mail inválido.';
            break

        case password.length < 4:
            mensagem = 'Por favor, escolha uma senha com no mínimo 4 caracteres.';
            break

        default:
            validCreateUser = true;
            break
    };

    if (validCreateUser) {
        const response = await doPost('/user/create', {
            email, password
        });

        if(response.status === 201) {
            alert('Usuário criado com sucesso!')
            location = './index.html';

        } else if (response.data){
            alert('Este e-mail já tem cadastro na plataforma!');

        } else {
            alert(response);
        }
        return;
    };

    alert(mensagem);    
};

function repeatPassword() {
    const password = document.querySelector('#password-register');
    const repeatPassword = document.querySelector('#repeat-password-register');
    const btnCreateUser = document.querySelector('#button-register');
    
    if (password.value === repeatPassword.value) {
        btnCreateUser.disabled = false;
    } else if (password.value !== repeatPassword.value) {
        btnCreateUser.disabled = true;
    };
};