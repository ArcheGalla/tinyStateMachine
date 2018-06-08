export interface IState { }

export interface IAction {
    type: string;
    payload?: any;
}

export type IReducer = (state: IState, action: IAction) => IState;

export type IReduceSelector = (state: IState) => IState;

export type Subscription = (l: any) => void;

export type Unsubscribe = () => void;

export type PropertySelector = string;

export type Selector = PropertySelector | IReduceSelector;
