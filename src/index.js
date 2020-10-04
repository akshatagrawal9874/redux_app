import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import store from "./configureStore";
import {addBug,resolveBug,assignBugToUser,loadBugs} from "./bugs"
//import * as actions from "./store/api"
//import stores from "./customStore"
console.log(store);
console.log(store.getState());
store.dispatch(()=>{})
/*store.dispatch((dispatch,getState)=>{
  dispatch({type:"bugsReceived",bugs:[1,2,3]})
  console.log(getState());
})*/
store.dispatch({
  type:"error",
  payload:{message:"An error ocurred."}
});
/*store.dispatch({
  type:'apiCallBegan',
    payload:{
        url:'/bugs',
        onSuccess:actions.apiCallSuccess.type,
        onError:actions.apiCallFailed.type
    }
});*/
store.dispatch(loadBugs());
setTimeout(()=>store.dispatch(loadBugs()),2000);
store.dispatch(addBug({description:"a"}))
//store.subscribe(()=>{console.log("store changed !",store.getState())}); // used for providing notifications in ui
//store.dispatch(BugAdded({description:"bug1"}));
store.dispatch(resolveBug(2))
//setTimeout(()=>store.dispatch(resolveBug(1)),2000)
store.dispatch(assignBugToUser(1,4));
//store.dispatch(BugAdded({description:"bug2"}));
//store.dispatch(BugAdded({description:"bug3"}));
//store.dispatch(BugAdded({description:"bug4"}));
//store.dispatch(BugResolved({id:1}));
//store.dispatch(BugResolved({id:2}));
//store.dispatch(BugRemoved({id:1}));
//const ResolvedBugs= ResolvedBugsSelector(store.getState());
//const ResolvedBugs1=ResolvedBugsSelector(store.getState());
//console.log(ResolvedBugs);
//console.log(ResolvedBugs1);
//console.log(ResolvedBugs1===ResolvedBugs);
//const un=store.getState().entities.bugs.list.filter(bug=>bug.resolved);
//console.log(un);
/*stores.state=1;
stores.subscribe(()=>{console.log("new custom action changed",stores.getState())})
console.log(stores.getState());
console.log(stores);
stores.state=2;
console.log(stores);
console.log(stores.state);
stores.dispatch(bugAdded("bug5"));
console.log(stores.getState());
stores.dispatch(bugResolved(3));
console.log(stores.getState());*/
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
