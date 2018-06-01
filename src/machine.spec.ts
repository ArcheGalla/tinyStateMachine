import {Machine} from './machine';
import createSpy = jasmine.createSpy;

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
