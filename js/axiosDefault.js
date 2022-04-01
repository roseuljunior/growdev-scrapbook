axios.defaults.baseURL = "http://localhost:8080";

const doGet = async (route, params) => {
    return await axios({
        method: "get", 
        url: route,
        data: {...params} 
    }).then(response => {
        return response
    }

    ).catch(error => {
        return error
    });
};

const doPost = async (route, params) => {
    return await axios({
        method: "post", 
        url: route,
        data: {...params} 
    }).then(response => {
        return response
    }

    ).catch(error => {
        return error
    });
};;

const doPut = async (route, params) => {
    return await axios({
        method: "put", 
        url: route,
        data: {...params} 
    }).then(response => {
        return response
    }

    ).catch(error => {
        return error
    });
};;

const doDelete = async (route, params) => {
    return await axios({
        method: "delete", 
        url: route,
        data: {...params} 
    }).then(response => {
        return response
    }

    ).catch(error => {
        return error
    });
};;