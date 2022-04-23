import router from './router/index'
import {getUserInfo} from './api/login'
router.beforeEach((to,from,next)=>{
    //1.到本地获取token
    const token=localStorage.getItem("user-token")
    if(!token) // 1.1没有获取到token
    {
        if(to.path!=='/login')// 1.1.1访问非登录页面，则让你回到登录页面
        {
            next({path:'/login'})
        }
        else{ // 1.1.2访问登录页面，则进入登录页面
            next()
        }
    }
    else// 1.2获取到token
    {
       // 1.2.1 访问的是登录页面，则进入登录页面
       if(to.path==='/login')
       {
           next()
       }
       else
       { //1.2.2 访问的是非登录页面，则查看本地是否存储有用户信息
        const userinfo=localStorage.getItem("user-info")
        if(userinfo){ //1.2.2.1 本地有用户信息，则让其进入相应页面
            next()
        }
        else{//1.2.2.1 本地没有用户信息，则通过token去获取用户信息
            getUserInfo(token).then(response=>{
                const respUser=response.data
                if(respUser.msg == ""){// 1.2.2.1.1获取到了用户信息，则把用户信息写入本地存储
                    localStorage.setItem("user-info",JSON.stringify(respUser.data.token))
                    next()
                }
                else{// 1.2.2.1.2没有获取到用户信息，则转到登录页面
                    next({path:'/login'})
                }
            })
        }
       }
    }    
   

             
             
        
        
   
          
         
                
})