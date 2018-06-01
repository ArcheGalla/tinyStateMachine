import {Machine} from './machine';
import createSpy = jasmine.createSpy;
import {Actions, AppState, Contact, contactReducer, Entities, User, userReducer} from './machine.test.data';

describe('Machine API', () => {
  let machine: Machine;

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
  let machine: Machine;

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
  let machine: Machine;
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
    contacts = [1, 2, 3, 4].map((position) => entities.generateContact(users[position].id));
    machine = new Machine(new AppState());
    actions = new Actions();
  });

  // it('should select users list from state by string selector', () => {
  //
  // });

  // it('should select users list from state by function selector', () => {
  //
  // });

  // it('should select users with the same age by string and function selector', () => {
  //
  // });
});
