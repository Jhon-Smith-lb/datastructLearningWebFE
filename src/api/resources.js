import myaxios from '@/utils/myaxios'
export default{
    query(queryOption){
        var prefix = ""
        var limit = 8
        if (queryOption.prefix != null) {
            prefix = queryOption.prefix
        }
        if (queryOption.limit != null) {
            limit = queryOption.limit
        }
            
        return myaxios({
            url:'/resources/query',
            method:'get',
            headers: {
                'Authorization': 'Bearer ' + queryOption.token
            },
            params: {
                prefix,
                limit,
            }
        })
    }
}