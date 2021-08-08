import { StateType, ActionType } from 'typesafe-actions';
import RootReducer from "./root-reducers";
import RootActions from "./root-actions";

declare module 'MyTypes' {
  export type RootState = StateType<
        ReturnType<typeof RootReducer>
    >;
    export type RootActions = ActionType<typeof RootActions>;
    export type RootEpic = any;
}
