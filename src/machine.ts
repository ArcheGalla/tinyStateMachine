import {IAction, IReducer, IReduceSelector, IState, PropertySelector, Selector, Subscription, Unsubscribe} from './interface';

export class Machine {
  private state: IState;
  readonly reducers: IReducer[];
  readonly subscriptions: Map<Selector[], Subscription>;

  private static flatSelectors(selectors: Selector []): Selector[] {
    return selectors.reduce((acc: [Selector], selector: Selector) => acc.concat(selector), []) as Selector[];
  }

  private static applySelectors(selectors: Selector[], state: IState ): IState {
    let slice: IState = state;

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

      listener(Machine.applySelectors(selectors, this.state));
    }
  }

  public on(...selectors: Selector[] ): Unsubscribe {
    const flattenSelectors: Selector[] = Machine.flatSelectors(selectors);

    const subscription: Subscription = flattenSelectors.pop() as Subscription;

    this.subscriptions.set(flattenSelectors, subscription);
    subscription(Machine.applySelectors(flattenSelectors, this.state));

    return () => this.subscriptions.delete(flattenSelectors);
  }

  public getState(...selectors: Selector[]) {
    return Machine.applySelectors(Machine.flatSelectors(selectors), this.state);
  }
}
