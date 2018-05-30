export interface IState {
    [key: string]: any;
}

export interface IAction {
    type: string;
    payload?: any;
}

export type IReducer = (state: IState, action: IAction) => IState;

export type IReduceSelector = (state: IState) => IState;

export type Subscription = () => void;

export type PropertySelector = string;

export type Selector = PropertySelector | IReduceSelector;
