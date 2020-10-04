const toast=store=>next=>action=>{
    if(action.type==="error")
    console.log("Toastify",action.payload.message);
    else
    return next(action); //next middleware function
}
export default toast;