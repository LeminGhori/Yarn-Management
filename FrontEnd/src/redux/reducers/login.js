import Cookies from 'js-cookie';
const initialState = {
    login: (localStorage.getItem('token') !== null && localStorage.getItem('token') !== undefined),
    modelData: [],
    isAdmin: localStorage.getItem("isAdmin"),
};

const user = (state = initialState, action) => {
    switch (action.type) {
        case "USERLOGOUT":
            localStorage.clear();
            // Cookies.remove('user');
            // Cookies.remove('token');
            // Cookies.remove('isAdmin');
            return {
                ...state,
                login: false
            };
        case "USERLOGIN":
            return {
                ...state,
                login: true
            };
        case "USERROLE":
            return {
                ...state,
                isAdmin: action.payload
            };
        case "MODELDATA":
            return {
                ...state,
                modelData: action.payload
            }
        default:
            return state;
    }
};

export default user;
