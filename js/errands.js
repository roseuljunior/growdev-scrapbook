document.addEventListener('DOMContentLoaded', () => {
    checkLogin();
    refreshPosts();
});

// TOKEN
function getToken() {
    const token = localStorage.getItem('token');
    return token;
}

function setToken(token) {
    localStorage.setItem('token', token);
}

// CHECK LOGIN
async function checkLogin() {
    const token = getToken();

    if (token) {
        try {
            const { status } = await doPost('/checkToken', { token })

            if (status !== 200) {
                alert("Token expirado");
                location = './index.html';
            }

        } catch (error) {
            alert('Faça seu login.');
            location = './index.html'
        }
    } else {
        alert('Faça seu login.');
        location = './index.html'
    }
}

// GET ERRANDS
async function getPosts() {
    const token = getToken();
    const { data } = await doPost('/getposts', { token });

    return data;
}

// LOGOUT
async function onLogout() {
    const token = getToken();

    localStorage.clear();
    await doPost('/user/logout', { token });

    location = './index.html';
}

// GET ID
async function getMyId() {
    const token = getToken();
    const {data} = await doPost('/myId', { token });

    return data;
}

// PRINT POSTS
async function refreshPosts() {
    const posts = await getPosts();
    const myId = await getMyId();
    const tableBody = document.querySelector('#table-body');
    tableBody.innerHTML = '';
    let count = 1;
    
    if (posts.length > 0) {
        posts.map(message => {
            if (myId === message.userId) {
                tableBody.innerHTML += `
                    <tr data-id="${message.id}">
                        <td class="col-1 h6 bg-primary text-white border-rounded target" data-placement="right">${count}</td>
                        <td class="col-3">${message.title}</td>
                        <td class="col-5">${message.description}</td>
                        <td class="col-2 text-center">
                            <a class="btn btn-danger p-1" href="#" onclick="removeMessage(event)" id="btnDelete">Apagar</a>
                            <a class="btn btn-success p-1" data-bs-toggle="modal" data-bs-target="#editModal" href="#" onclick="addIdForEditList()" id="btnEdit">Editar</a>
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
            }
        });
    }
}

// REMOVE ERRANDS
async function removeMessage(event) {
    const token = getToken();
    const postId = event.target.parentNode.parentNode.getAttribute('data-id');

    const response = await doDelete(`/errands/${postId}`, { token });

    const { status } = response;

    if (status === 204) {
        refreshPosts();
        return
    }

    alert("Não foi possível apagar o post. Tente novamente!")
}

async function addIdForEditList() {
    const token = getToken();
    const postId = event.target.parentNode.parentNode.getAttribute('data-id');

    const spanErrandId = document.querySelector('#editErrandId');
    spanErrandId.setAttribute('data-id', postId);

    spanErrandId.innerHTML = `(${postId})`;

    const response = await doPost(`/errands/search/${postId}`, { token });

    const { status } = response;
    
    if (status === 200) {
        const errandToEdit = response.data;

        document.getElementById('editTitle').value = errandToEdit.title;
        document.getElementById('editDescription').value = errandToEdit.description;
    }


}

// POSTS ERRANDS
async function addErrands() {
    const token = getToken();

    const title = document.querySelector('#title').value;
    // const title = "teste pelo código"
    const description = document.querySelector('#description').value;
    // const description = "Teste 1"

    const response = await doPost('/errands', { title, description, token });

    const { status } = response;

    if (status === 201) {
        refreshPosts();
        return
    }

    console.log(response);
    alert("Não foi possível publicar seu post");
}

// EDIT ERRANDS
async function editErrands(event) {
    const token = getToken();
    
    const postId = document.querySelector('#editErrandId').getAttribute('data-id');

    const title = document.querySelector('#editTitle').value;
    const description = document.querySelector('#editDescription').value;

    const response = await doPut(`/errands/${postId}`, {
        token,
        title,
        description
    });

    const { status } = response;

    if (status === 200) {
        refreshPosts();
    
        title.value = '';
        description.value = '';

        return
    }

    alert(response);
}