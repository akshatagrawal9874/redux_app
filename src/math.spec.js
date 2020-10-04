import {isEven} from "./Math"
describe("isEven",()=>{
it("is Even should return true if given an even number",()=>{
    //function undertest
    const result=isEven(2);
    expect(result).toEqual(true)
});
it("is Even should return false if given an odd number",()=>{
   const result=isEven(1);
   expect(result).toEqual(false);
});
})