import * as faker from 'faker';
import {IAction, IState} from './interface';

interface IUser {
  surname: string;
  name: string;
  age: number;
  id: number;
}

interface IContact {
  phone: string;
  address: string;
  userId: number;
  id: number;
}

interface IAppState extends IState {
  contacts: IContact[];
  users: IUser[];
}

export class Actions {
  static create(type: string, payload?: any): IAction {
    return {type, payload};
  }
}

export const appState: IAppState = {
  contacts: [],
  users: [],
};

export function userReducer(state: IAppState, action: IAction): IAppState {
  // todo implement me
  return state;
}

export function contactReducer(state: IAppState, action: IAction): IAppState {
  // todo implement me
  return state;
}
