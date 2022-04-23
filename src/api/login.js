import myaxios from '@/utils/myaxios'

export function login(number, password) {
    return myaxios({
        url: '/login',
        method: 'post',
        data: {
            number,
            password
        }
    })
}

export function getUserInfo(token) {
    return myaxios({
        url: '/user/get_info',
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
}

export function logout() {
    return myaxios({
        
    })
}