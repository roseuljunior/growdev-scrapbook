document.addEventListener('DOMContentLoaded', () => {
    checkLogin();
    toRefreshErrands();
});

function toGetToken() {
    const token = localStorage.getItem('token');
    return token;
};

function setToken(token) {
    localStorage.setItem('token', token);
};

async function checkLogin() {
    const token = toGetToken();

    if (token) {
        try {
            const { status } = await doPost('/checkToken', { token });

            if (status !== 200) {
                alert('Token expirado');
                location = './index.html';
            };

        } catch (error) {
            alert('Efetue seu login.');
            location = './index.html';
        };
    } else {
        alert('Efetue seu login.');
        location = './index.html';
    };
};

async function getErrands() {
    const token = toGetToken();
    const { data } = await doPost('/getposts', { token });

    return data;
};

async function onLogout() {
    const token = toGetToken();

    localStorage.clear();
    await doPost('/user/logout', { token });

    location = './index.html';
};

async function getMyId() {
    const token = toGetToken();
    const {data} = await doPost('/myId', { token });

    return data;
};

async function toRefreshErrands() {
    const errands = await getErrands();
    const myId = await getMyId();
    const tableBody = document.querySelector('#table-body');
    tableBody.innerHTML = '';
    let count = 1;
    
    if (errands.length > 0) {
        errands.map(message => {
            if (myId === message.userId) {
                tableBody.innerHTML += `
                    <tr data-id="${message.id}">
                        <td class="col-1 h6 bg-primary text-white border-rounded target" data-placement="right">${count}</td>
                        <td class="col-3">${message.title}</td>
                        <td class="col-5">${message.description}</td>
                        <td class="col-2 text-center">
                            <a class="btn btn-danger p-1" href="#" onclick="removeErrands(event)" id="btnDelete">Apagar</a>
                            <a class="btn btn-success p-1" data-bs-toggle="modal" data-bs-target="#editModal" href="#" onclick="addIdForEditList(event)" id="btnEdit">Editar</a>
                        </td>
                    </tr>`
                count++;
            } else {
                tableBody.innerHTML += `
                    <tr data-id="${message.id}">
                        <td class="col-1 h6 bg-primary text-white border-rounded target" data-placement="right">${count}</td>
                        <td class="col-3">${message.title}</td>
                        <td class="col-5">${message.description}</td>
                        <td class="col-2 text-center text-min">Mensagem de outro usuário</td>
                    </tr>`
                count++;
            };
        });
    };
};

async function removeErrands(event) {
    const token = toGetToken();
    const errandId = event.target.parentNode.parentNode.getAttribute('data-id');

    const response = await doDelete(`/errands/${errandId}`, { token });

    const { status } = response;

    if (status === 204) {
        toRefreshErrands();
        return;
    };

    alert('Não foi possível apagar o post.');
};

async function addIdForEditList(event) {
    const token = toGetToken();
    const errandId = event.target.parentNode.parentNode.getAttribute('data-id');

    const spanErrandId = document.querySelector('#editErrandId');
    spanErrandId.setAttribute('data-id', errandId);

    spanErrandId.innerHTML = `(${errandId})`;

    const response = await doPost(`/errands/search/${errandId}`, { token });

    const { status } = response;
    
    if (status === 200) {
        const errandToEdit = response.data;

        document.getElementById('editTitle').value = errandToEdit.title;
        document.getElementById('editDescription').value = errandToEdit.description;
    }
}

async function addErrands() {
    const token = toGetToken();
    const title = document.querySelector('#title').value;
    const description = document.querySelector('#description').value;
    const response = await doPost('/errands', { title, description, token });
    const { status } = response;

    if (status === 201) {
        toRefreshErrands();
        return;
    };

    alert('Recado não publicado.');
};

async function editErrands() {
    const token = toGetToken();
    const errandId = document.querySelector('#editErrandId').getAttribute('data-id');

    const title = document.querySelector('#editTitle').value;
    const description = document.querySelector('#editDescription').value;

    const response = await doPut(`/errands/${errandId}`, {
        token,
        title,
        description
    });

    const { status } = response;

    if (status === 200) {
        toRefreshErrands();
    
        title.value = '';
        description.value = '';

        return;
    };

    alert(response);
};