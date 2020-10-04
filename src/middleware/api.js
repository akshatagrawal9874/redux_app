import axios from "axios"
import * as actions from "../store/api"
/*const action={
    type:'apiCallBegan',
    payload:{
        url:'/bugs',
        method:'get',
        data:{},
        onSuccess:'bugsReceived',
        onError:'apiRequestFailed'
    }
}*/
const api=({dispatch})=>next=>async action=>{
    if(action.type!==actions.apiCallBegan.type) return next(action)
    next(action)
    const {url,method,data,onSuccess,onError,onStart}=action.payload;
    if(onStart)
    dispatch({type:onStart});
    try{
    const response=await axios.request({
        baseURL:'http://localhost:9001/api',
        url,
        method,
        data
    });
    dispatch(actions.apiCallSuccess(response.data))
    if(onSuccess)
    dispatch({type:onSuccess,payload:response.data})
}
catch(error)
{
    dispatch(actions.apiCallFailed(error))
    if(onError)
    dispatch({type:onError,payload:error});
}
}
export default api;
