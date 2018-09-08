import * as faker from 'faker';
import {IAction} from './interface';

interface IUser {
  surname: string;
  name: string;
  age: number;
  id: string;
}

interface IContact {
  phone: string;
  address: string;
  userId: string;
  id: string;
}

interface IAppState {
  contacts: IContact[];
  users: User[];
}

export class Actions {
  public readonly addUser = 'ADD_USER';
  public readonly removeUser = 'REMOVE_USER';
  public readonly addContact = 'ADD_CONTACT';

  create(type: string, payload?: any): IAction {
    return {type, payload};
  }
}

export class Contact implements IContact {
  constructor(
    public id: string,
    public phone: string,
    public address: string,
    public userId: string) {
  }
}

export class User implements IUser {
  surname: string;
  name: string;
  age: number;
  id: string;

  constructor(name: string, surname: string, age: number, id: string) {
    this.name = name;
    this.surname = surname;
    this.age = age;
    this.id = id;
  }
}

export class Entities {
  generateUser(): User {
    return new User(
      faker.name.findName(),
      faker.name.lastName(),
      faker.random.number({min: 10, max: 70}),
      faker.random.uuid());
  }

  generateContact(userId: string = faker.random.uuid()): Contact {
    return new Contact(
      faker.phone.phoneNumber(),
      faker.address.city(),
      userId,
      faker.random.uuid(),
    );
  }
}

export class AppState {
  contacts: Contact[];
  users: User[];

  constructor(users: User[] = [], contacts: Contact[] = []) {
    this.contacts = contacts;
    this.users = users;
  }
}

const rAction = new Actions();

export function userReducer(state: AppState, action: IAction): AppState {
  switch (action.type) {
    case rAction.addUser: {
      state.users.push(action.payload as User);
      return {...state} as IAppState;
    }

    case rAction.removeUser: {
      state.users = state.users.filter((u: User) => u.id !== action.payload);
      return {...state} as IAppState;
    }

    default: {
      return state;
    }
  }
}

export function contactReducer(state: AppState, action: IAction): AppState {
  switch (action.type) {
    case rAction.addContact: {
      state.contacts.push(action.payload);
      return {...state};
    }

    default: {
      return state;
    }
  }

}
