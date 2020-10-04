import {configureStore} from "@reduxjs/toolkit"
import reducer from "./reducer"
import logger from "./middleware/logger"
import func from "./middleware/func"
import toast from "./middleware/toast"
import api from "./middleware/api"

export default function()
{
    return configureStore({reducer:reducer,middleware:[logger("logging"),func,toast,api]});
}

/*const store=configureStore({reducer,middleware:[logger("logging"),func,toast,api]});
export default store;*/

// We don't need devToolsEnhancer by the using configureStore