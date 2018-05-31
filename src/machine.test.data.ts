import * as faker from 'faker';
import {IAction, IState} from './interface';

interface IUser {
  surname: string;
  name: string;
  age: number;
  id: number;
}

interface IConstant {
  phone: string;
  address: string;
  userId: number;
  id: number;
}

export class Action {
  static create(type:string, payload:any) : IAction{
    return { type, payload };
  }

}

export class Reducers {
  getInitState(): IState {
    return {
      users: [],
    };
  }

  getUserReducer() {

  }

  getAddUserAction() {

  }

  getRemoveUserAction() {
  }

  getUpdateUserAction() {
  }

  getConstactReducer() {
  }

  getAddConstactAction() {

  }

  getRemoveConstactAction() {

  }

  getUpdateConstactAction() {

  }

}
