import {IState} from './interface';
import {Machine} from './machine';

describe('Machine api', () => {
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

describe('Machine behavior', () => {
  let machine: Machine;
  // let actions: Action[];

  beforeEach(() => {
    machine = new Machine();
  });

  it('`getState` method should return empty object as state by default', () => {
    expect(machine.getState()).toEqual({});
  });

  it('`on` method should call subscription function on register', () => {
    // const subscription = jest.fn();
    // machine.on(subscription);
    // expect(subscription).toBeCalledWith({});
  });

  it('`on` method should return unsubscribe function', () => {
    // const unsubscribe = machine.on(() => ({}));
    // expect(unsubscribe).toBeInstanceOf(Function);
  });

  it('unsubscribe function should remove subscription from subscriptions list', () => {
    const unsubscribe = machine.on(() => ({}));
    unsubscribe();
    expect(machine.subscriptions.size).toEqual(0);
  });

  it('`register` method should add reducer to reducers list', () => {
    // const reducer = jest.fn();
    // machine.register(reducer);
    //
    // expect(machine.reducers).toContain(reducer);
  });
});

class TestData {
  getInitState(): IState {
    return {
      users
    }
  }
}

// describe('Machine state management', function () {
// 	let machine: Machine;
// 	let actions: Action[];
//
// 	interface User {
// 		name: string,
// 		age: number,
// 		surname: string,
// 		id: number
// 	}
//
// 	interface AppState {
// 		users: User[],
// 		currentUser?: User
// 	}
//
// 	function generateUser(name: string, age: number, surname: string, id: number = Date.now()): User {
// 		return {
// 			name,
// 			age,
// 			surname,
// 			id,
// 		}
// 	}
//
// 	function UserReducer(state: AppState, action: Action): AppState {
// 		switch (action.type) {
// 			case'AD_USER': {
// 				const updated = {...state};
// 				updated.users.push(generateUser('artem', 28, 'galla'));
// 				return updated;
// 			}
// 			default:
// 				return state;
// 		}
// 	}
//
// 	let state: AppState;
//
// 	beforeEach(function () {
// 		state = {
// 			users: [/*generateUser('artem', 28, 'galla')*/],
// 			currentUser: null,
// 		};
//
// 		machine = new Machine(state);
// 	});
//
// 	test('Should add user to state', (done) => {
// 		machine.register(UserReducer);
// 		machine.emit({type: 'AD_USER', payload: generateUser('artem', 28, 'galla')});
//
// 		machine.on(function (state) {
// 			expect(state.users.length).toBe(1);
// 			console.log('state', state);
//
// 			done();
// 		});
// 	})
//
// });

// describe('Greeter', () => {
//
//   const CUSTOM_GREETING = 'Hola';
//
//   const greeter: Greeter = new Greeter();
//   const customGreeter = new Greeter(CUSTOM_GREETING);
//
//   it('should exist', () => {
//     expect(Greeter).toBeDefined();
//     expect(typeof Greeter).toEqual('function');
//   });
//
//   describe('greet()', () => {
//
//     it('should exist', () => {
//       expect(greeter.greet).toBeDefined();
//       expect(typeof greeter.greet).toBe('function');
//     });
//
//     it('should use a default greeting if one is not provided', () => {
//       const greeting = greeter.greet('World');
//
//       expect(greeting).toEqual('Hello, World');
//     });
//
//     it('should use a custom greeting if provided', () => {
//       const greeting = customGreeter.greet('World');
//
//       expect(greeting).toEqual(`${CUSTOM_GREETING}, World`);
//     });
//
//   });
//
//   describe('sayGreeting()', () => {
//
//     let logSpy: jasmine.Spy;
//
//     beforeEach(() => {
//       logSpy = spyOn(console, 'log');
//     });
//
//     it('should exist', () => {
//       expect(greeter.sayGreeting).toBeDefined();
//       expect(typeof greeter.sayGreeting).toBe('function');
//     });
//
//     it('should print a default greeting to the console', () => {
//       greeter.sayGreeting('World');
//
//       expect(console.log).toHaveBeenCalledWith('Hello, World');
//     });
//
//     it('should print a custom greeting to the console', () => {
//       customGreeter.sayGreeting('World');
//
//       expect(console.log).toHaveBeenCalledWith('Hola, World');
//     });
//
//     afterEach(() => {
//       logSpy.calls.reset();
//     });
//
//   });
// });
