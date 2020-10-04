import {addBug,BugAdded,loadBugs,resolveBug,ResolvedBugsSelector} from "./bugs"
import { apiCallBegan } from "./store/api"
import configureStore from "./configureStore"
import axios from "axios"
import MockAdapter from "axios-mock-adapter"

describe("bugsSlice",()=>{
    let fakeAxios;
    let store;
    beforeEach(()=>{
        fakeAxios=new MockAdapter(axios);
        store=configureStore();
    })

    const bugsSlice=()=>store.getState().entities.bugs;
    it("should handle the addBug action",async ()=>{
        //Arrange
        const bug={description:"a"};
        const savedBug={...bug,id:1,resolved:false};
        fakeAxios.onPost("/bugs").reply(200,savedBug);

    //Act
        await store.dispatch(addBug(bug))
        expect(bugsSlice().list).toContainEqual(savedBug)
    })
    it("should not add the bug to the store if it's not saved",async ()=>{
        const bug={description:"a"};
        fakeAxios.onPost("/bugs").reply(500);

        await store.dispatch(addBug(bug));

        expect(bugsSlice().list).toHaveLength(0)
    })
    describe("action creators",()=>{
        it("addBug",()=>{
            const bug=addBug({description:"a"})
            const result=addBug(bug)
            const expected={
                type:apiCallBegan.type,
                payload:{
                   url:"/bugs",
                   method:"post",
                   data:bug,
                   onSuccess:BugAdded.type 
                }
            }
            expect(result).toEqual(expected);
                })
    })
    const createState=()=>({
        entities:{
            bugs:{
                list:[]
            }
        }
    })
    
    describe("Selectors",()=>{
        it("getUnresolvedBugs",()=>{
            const state=createState();
           state.entities.bugs.list=[{id:1,resolved:true},{id:2},{id:3}]
           const result=ResolvedBugsSelector(state);
          expect(result).toHaveLength(2);
        })
    })
    describe("loading bugs",()=>{
        describe("if the bugs exist in the cache",()=>{
            it("they should not be fetched from the server again",async ()=>{
                fakeAxios.onGet("/bugs").reply(200,[{id:1}])
                await store.dispatch(loadBugs())
                await store.dispatch(loadBugs());
                expect(fakeAxios.history.get.length).toBe(1);
            })
        })
        describe("if the bugs don't exist in the cache",()=>{
            it("they should be fetched from the server and put in store",async ()=>{
                fakeAxios.onGet("/bugs").reply(200,[{id:1}])
                await store.dispatch(loadBugs())
                expect(bugsSlice().list).toHaveLength(1)
            })
        })
        describe("loading indicator",()=>{
            it("should be true while fetching the bugs",()=>{
                fakeAxios.onGet("/bugs").reply(()=>{
                    expect(bugsSlice().loading).toBe(true);
                    return [200,[{id:1}]];
                })
                store.dispatch(loadBugs())
            })
            it("should be false after the bugs are fetched",async ()=>{
                fakeAxios.onGet("/bugs").reply(200,[{id:1}]);
                await store.dispatch(loadBugs())
                expect(bugsSlice().loading).toBe(false)
            })
            it("should be false if server returns an error",async ()=>{
                fakeAxios.onGet("/bugs").reply(500)
                await store.dispatch(loadBugs())
                expect(bugsSlice().loading).toBe(false)
            })
        })
    })
    it("should mark the bug as resolved if it's saved to the server",async ()=>{
        //AAA
        fakeAxios.onPatch("/bugs/1").reply(200,{id:1,resolved:false})
        fakeAxios.onPost("/bugs").reply(200,{id:1});

        await store.dispatch(addBug({}));
        await store.dispatch(resolveBug(1));

        expect(bugsSlice().list[0].resolved).toBe(true);
    })
    it("should not mark the bug as resolved if it's not saved to server",async ()=>{
        fakeAxios.onPatch("/bugs/1").reply(500);
        fakeAxios.onPost("/bugs").reply(200,{id:1});

        await store.dispatch(addBug({}));
        await store.dispatch(resolveBug(1));

        expect(bugsSlice().list[0].resolved).toBe(false);
    })
})