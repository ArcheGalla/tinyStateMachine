export interface IAction {
    type: string;
    payload?: any;
}

export type IReducer = <T>(state: T, action: IAction) =>  T;

export type Unsubscribe = () => void;

export type PropertySelector = string;

export type Subscription =  <T>(state: T) => void;

export type IReduceSelector = <T, U>(state: T) => U;

export type IArraySelector = [PropertySelector | IReduceSelector];

export type Selector = PropertySelector | Subscription | IReduceSelector | IArraySelector;
