function getToken(){
    const token=localStorage.getItem('userToken')?localStorage.getItem('userToken'):'';
    return token;
}

export {getToken}