const { createSlice } = require("@reduxjs/toolkit");

let lastId=0;
const slice=createSlice({
    name:"bugs",
    initialState:[],
    reducers:{
        [BugAdded.type]:(state,action)=>{
            state.push({
                id:++lastId,
                description:action.payload.description,
                resolved:false
            })
        },
        [BugRemoved.type]:(state,action)=>{
            const idx=state.findIndex(bug=>bug.id===action.payload.id)   
            delete state[idx]
          },
          [BugResolved.type]:(state,action)=>{
              const idx=state.findIndex(bug=>bug.id===action.payload.id)
              state[idx].resolved=true;
          }
    }
})
console.log(slice());
export const {BugAdded,BugResolved,BugRemoved}=slice.actions;
export default slice.reducers