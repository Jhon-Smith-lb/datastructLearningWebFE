import myaxios from '@/utils/myaxios'
export default{
    query(queryOption){
        const token = localStorage.getItem('user-token')
        var username = ""
        var number = 0
        var offset = 0
        var limit = 8
        if (queryOption.username != null) {
            username = queryOption.username
        }
        if (queryOption.offset != null) {
            offset = queryOption.offset
        }
        if (queryOption.limit != null) {
            limit = queryOption.limit
        }
        if (queryOption.number != null) {
            number = queryOption.number
        }
            
        return myaxios({
            url:'/user/query',
            method:'get',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            params: {
                username,
                number,
                offset,
                limit,
            }
        })
    },
    addUser(addUserReq){
        const token = localStorage.getItem('user-token')
        return myaxios({
            url:'/user/add',
            method:'post',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data:addUserReq
        })
    },
    updateUser(updateUserReq){
        const token = localStorage.getItem('user-token')
        return myaxios({
            url:'/user/update',
            method:'post',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data:updateUserReq
        })
    }
}