import { combineEpics  } from "redux-observable";
import * as xmindEpic from "../app/epics/index"

const rootEpic = combineEpics(
    ...Object.values(xmindEpic),    
);

export default rootEpic;
