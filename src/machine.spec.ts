import {Machine} from './machine';
import createSpy = jasmine.createSpy;
import {Selector} from './interface';
import {Actions, AppState, Contact, contactReducer, Entities, User, userReducer} from './machine.test.data';

describe('Machine API', () => {
  let machine: Machine<{}>;

  beforeEach(() => {
    machine = new Machine();
  });

  it('API methods should be defined on machine instance', () => {
    expect(machine.getState).toBeDefined();
    expect(machine.register).toBeDefined();
    expect(machine.emit).toBeDefined();
    expect(machine.on).toBeDefined();
  });
});

describe('Machine default behavior', () => {
  let machine: Machine<{}>;

  beforeEach(() => {
    machine = new Machine();
  });

  it('`getState` method should return empty object as state by default', () => {
    expect(machine.getState()).toEqual({});
  });

  it('`on` method should return unsubscribe function', () => {
    const unsubscribe = machine.on(() => ({}));
    expect(typeof unsubscribe).toBe('function');
  });

  it('`on` method should call subscription on register', () => {
    const subscription = createSpy('function');
    const defaultState = {};

    machine.on(subscription);

    expect(subscription).toHaveBeenCalledWith(defaultState);
  });

  it('unsubscribe function should remove subscription from subscriptions list', () => {
    const unsubscribe = machine.on(() => ({}));

    unsubscribe();

    expect(machine.subscriptions.size).toEqual(0);
  });

  it('`register` method should add reducer to reducers list', () => {
    const reducer = () => ({});

    machine.register(reducer);

    expect(machine.reducers).toContain(reducer);
  });

  it('`register` method should return remove reducer call back', () => {
    const reducer = () => ({});
    const removeReducer: () => void = machine.register(reducer);
    expect(machine.reducers).toContain(reducer);
    removeReducer();
    expect(machine.reducers.length).toEqual(0);
  });

  it('`emit` method should call reducer and subscription', () => {
    const reducer = createSpy('reducer', (state) => state).and.callThrough();
    const subscription = createSpy('subscription', () => ({}));

    machine.register(reducer);
    machine.on(subscription);

    machine.emit({type: 'TEST'});

    expect(reducer).toHaveBeenCalledTimes(1);
    expect(subscription).toHaveBeenCalledTimes(2);
  });
});

describe('Machine state management', () => {
  let machine: Machine<{}>;
  let actions: Actions;
  let entities: Entities;

  beforeEach(() => {
    machine = new Machine(new AppState());
    actions = new Actions();
    entities = new Entities();

    machine.register(contactReducer);
    machine.register(userReducer);
  });

  it('should add user to users list', () => {
    const type = actions.addUser;
    const payload = entities.generateUser();

    machine.emit(actions.create(type, payload));
    const {users} = machine.getState();

    expect(users.length).toEqual(1);
  });

  it('should remove user from users list', () => {
    const user = entities.generateUser();

    machine.emit(actions.create(actions.addUser, user));
    machine.emit(actions.create(actions.removeUser, user.id));

    const {users} = machine.getState();
    expect(users.length).toEqual(0);
  });

});

describe('Machine selectors', () => {
  let machine: Machine;
  let actions: Actions;
  let entities: Entities;
  let users: User[];
  let contacts: Contact[];

  beforeEach(() => {
    entities = new Entities();
    users = [1, 2, 3, 4].map(() => entities.generateUser());
    contacts = users.map((user) => entities.generateContact(user.id));
    machine = new Machine(new AppState(users, contacts));
    actions = new Actions();
  });

  it('should select `users` list from state by string selector with `getState` method', () => {
    const usersFromState: User[] = machine.getState('users') as User[];

    expect(JSON.stringify(usersFromState)).toEqual(JSON.stringify(users));
  });

  it('should select `users` list from state by function selector with `getState` method', () => {
    const usersFromState: User[] = machine.getState((state: AppState) => state.users) as User[];

    expect(JSON.stringify(usersFromState)).toEqual(JSON.stringify(users));
  });

  it('should select `users` list from state by array string selector with `getState` method', () => {
    const usersFromState: User[] = machine.getState(['users']) as User[];

    expect(JSON.stringify(usersFromState)).toEqual(JSON.stringify(users));
  });

  it('should select users list from state by `on` method', (done) => {
    machine.on('users', (list: User[]) => {
      console.log('users list', list);
      expect(JSON.stringify(list)).toEqual(JSON.stringify(users));
      done();
    });
  });

  it('should select users list and transform state with `on` method', (done) => {
    machine.on('users', (userList: User[]) => userList.map((user: User) => user.id), (idList: string[]) => {
      expect(idList.every((id: string) => typeof id === 'string')).toEqual(true);
      done();
    });
  });

  it('should select users list and transform state with `on` method', (done) => {
    const userIdSelector: Selector[] = ['users', (userList: User[]) => userList.map((user: User) => user.id)];

    machine.on(userIdSelector, (idList: string[]) => {
      expect(idList.every((id: string) => typeof id === 'string')).toEqual(true);
      done();
    });
  });
});
