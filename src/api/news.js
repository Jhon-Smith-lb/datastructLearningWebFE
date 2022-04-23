import myaxios from '@/utils/myaxios'
export default{
    query(queryOption){
        const token = localStorage.getItem('user-token')
        var title = ""
        var type = 0
        var offset = 0
        var limit = 8
        if (queryOption.title != null) {
            title = queryOption.title
        }
        if (queryOption.offset != null) {
            offset = queryOption.offset
        }
        if (queryOption.limit != null) {
            limit = queryOption.limit
        }
        if (queryOption.type != null) {
            type = queryOption.type
        }
            
        return myaxios({
            url:'/news/query',
            method:'get',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            params: {
                title,
                type,
                offset,
                limit,
            }
        })
    },
    addNews(addNewsReq){
        const token = localStorage.getItem('user-token')
        return myaxios({
            url:'/news/add',
            method:'post',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data:addNewsReq
        })
    },
    updateNews(updateNewsReq){
        const token = localStorage.getItem('user-token')
        return myaxios({
            url:'/news/update',
            method:'post',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data:updateNewsReq
        })
    }
}