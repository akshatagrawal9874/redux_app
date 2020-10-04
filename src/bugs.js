import {createSelector} from "reselect"
import { apiCallBegan } from "./store/api";
import moment from "moment"
import Axios from "axios";
//action types


//action creators

 //reducers
 const { createSlice } = require("@reduxjs/toolkit");

let lastId=0;
 const slice=createSlice({
     name:"bugs",
     initialState:{
         list:[],
         loading:false,
         lastFetch:null // if we implement cache
        },
     reducers:{
         BugAdded:(bugs,action)=>{
             bugs.list.push({
                 id:++lastId,
                 description:action.payload.description,
                 resolved:false
             })
         },
         BugRemoved:(bugs,action)=>{
             const idx=bugs.list.findIndex(bug=>bug.id===action.payload.id)   
             delete bugs.list[idx]
           },
           BugResolved:(bugs,action)=>{
               const idx=bugs.list.findIndex(bug=>bug.id===action.payload.id)
               bugs.list[idx].resolved=true;
           },
           BugsReceived:(bugs,action)=>{
               bugs.list=action.payload;
               bugs.loading=false;
               bugs.lastFetch=Date.now();
           },
           BugsRequested:(bugs,action)=>{
               bugs.loading=true;
           },
           BugsRequestFailed:(bugs,action)=>{
               bugs.loading=false;
           },
           BugAssignedToUser:(bugs,action)=>{
               const {id:bugId,userId}=action.payload
           }
     }
 })
 console.log(slice);
 export const {BugAdded,BugResolved,BugRemoved,BugsReceived,BugsRequested,BugsRequestFailed,BugAssignedToUser}=slice.actions;
 export default slice.reducer;
 const url="/bugs"
 export const loadBugs=()=>(dispatch,getState)=>{
     const {lastFetch}=getState().entities.bugs;
     const diffInMinutes=moment().diff(moment(lastFetch),'minutes')
     if(diffInMinutes < 10) return;

    return dispatch(apiCallBegan({
   url,
   onStart:BugsRequested.type,
   onSuccess:BugsReceived.type,
   onError:BugsRequestFailed.type
 }))
}
export const addBug=bug=>apiCallBegan({
    url,
    method:'post',
    data:bug,
    onSuccess:BugAdded.type
})
//This below addBug implementation failed the solitary tests
/*export const addBug=bug=>{
    try{
        const response=await axios.post(url,bug);
        dispatch(BugAdded(bug));
    }
    catch(error){
        dispatch({type:"error"})
    }
}*/
//Another implementation of addBug
/*export const addBug=bug=>async dispatch=>{
    const response=await Axios.request({
        baseURL:"https://localhost:9001/api",
        url:"/bugs",
        method:"post",
        data:bug
    })
    dispatch(BugAdded(response.data))
} */                                                       

export const resolveBug=id=>apiCallBegan({
    url:url+"/"+id,
    method:"patch",
    data:{resolved:true},
    onSuccess:BugResolved.type
})
export const assignBugToUser=(bugId,userId)=>apiCallBegan({
    url:url+"/"+bugId,
    method:"patch",
    data:{userId},
    onSuccess:BugAssignedToUser.type
})
 export const ResolvedBugsSelector=createSelector(
          state=>state.entities.bugs,
          bugs=>bugs.list.filter(bug=> !bug.resolved)
 );