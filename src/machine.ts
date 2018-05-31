import {IAction, IReducer, IReduceSelector, IState, PropertySelector, Selector, Subscription, Unsubscribe} from './interface';

export class Machine {
    private state: IState;
    readonly reducers: IReducer[];
    readonly subscriptions: Map<Selector[], Subscription>;

    constructor(state: IState = {}) {
        this.state = state;
        this.reducers = [];
        this.subscriptions = new Map();
    }

    public register(reducer: IReducer) {
        if (reducer) {
            this.reducers.push(reducer);
        } else {
          throw new Error('Register method require reducer function as parameter');
        }
    }

    public emit(action: IAction) {
        try {
            this.state = this.reducers.reduce((state, reducer) => reducer(state, action), this.state);
        } catch (err) {
            console.log('Failed to reduce new state', err);
        }

        for (const selectorSubscriptionPair of this.subscriptions) {
            const selectors: Selector[] = selectorSubscriptionPair[0] as Selector[];
            const listener: Subscription = selectorSubscriptionPair[1] as Subscription;

            listener(this.applySelectors(selectors));
        }
    }

    private applySelectors(selectors: Selector[]): IState {
        let slice: IState = this.state;

        try {
            for (const selector of selectors) {
                if (typeof selector === 'string') {
                    slice = slice[selector as PropertySelector];
                } else if (typeof selector === 'function') {
                    slice = selector(slice as IReduceSelector);
                }
            }
        } catch (err) {
            console.log('Failed to apply selector ', err);
        }

        return slice;
    }

    public on(...selectors: Selector[]): Unsubscribe {
        const subscription: Subscription = selectors.pop() as Subscription;
        this.subscriptions.set(selectors, subscription);
        subscription(this.applySelectors(selectors));
        return () => this.subscriptions.delete(selectors);
    }

    public getState() {
        return this.state;
    }
}
