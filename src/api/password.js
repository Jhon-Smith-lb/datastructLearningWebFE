import myaxios from '@/utils/myaxios'
export default{
    checkPwd(pwd){
        const token = localStorage.getItem('user-token')
        return myaxios({
            url:'/user/check_pwd',
            method:'post',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: {
                pwd: pwd
            }
        })
    },
    updatePwd(updatePwdReq){
        const token = localStorage.getItem('user-token')
        return myaxios({
            url:'/user/reset_pwd',
            method:'post',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data:updatePwdReq
        })
    }
}