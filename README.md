# State Machine

Simple state management with build in selectors

```javascript

import { StateMachine } from 'machine';
import { userReducer, countReducer } from './reducers';

const state = new StateMachine({ user: null });

state.register(function userReducer(state = {}, action) {
	switch(action.type) {
		case 'ADD_USER': {
			return { ...state, user: action.payload };
		}

		default: {
			return state;
		}
	}
});

state.on(function(state) {
	console.log(state);
});

state.on('user', function(state) {
    console.log('user => ', state)
});

state.on('user', 'age', (( age ) => age + 5), function(state) {
    console.log('user -> age => ', state);
});

state.emit({ 
	type: 'ADD_USER', 
	payload: { name: 'John', age: 28 }
});

// out put is ...

// { user: { name: 'John', age: 28 }, count: 0 }
// user =>  { name: 'John', age: 28 }
// user -> age =>  33
```