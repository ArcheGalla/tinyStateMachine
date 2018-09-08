import {IAction, IReducer, IReduceSelector, PropertySelector, Selector, Subscription, Unsubscribe} from './interface';

export class Machine<T> {
  private state: T;
  private reducers: IReducer[];
  readonly subscriptions: Map<Selector[], Subscription>;

  private flatSelectors(selectors: Selector []): Selector[] {
    return selectors.reduce((acc: [Selector], selector: Selector) => acc.concat(selector), []) as Selector[];
  }

  private applySelectors(selectors: Selector[], state: T): T {
    let slice: { [key: string]: any } = state;

    try {
      for (const selector of selectors) {
        if (typeof selector === 'string') {
          slice = slice[selector as PropertySelector];
        } else if (typeof selector === 'function') {
          slice = (selector as IReduceSelector)(slice);
        }
      }
    } catch (err) {
      console.log('Failed to apply selector ', err);
    }

    return slice as T;
  }

  constructor(state: T = {} as T) {
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
    return () => {
      this.reducers = this.reducers.filter((red) => red !== reducer);
    };
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

      listener(this.applySelectors(selectors, this.state));
    }
  }

  public on(...selectors: Selector[]): Unsubscribe {
    const flattenSelectors: Selector[] = this.flatSelectors(selectors);

    const subscription: Subscription = flattenSelectors.pop() as Subscription;

    this.subscriptions.set(flattenSelectors, subscription);
    subscription(this.applySelectors(flattenSelectors, this.state));

    return () => this.subscriptions.delete(flattenSelectors);
  }

  public getState(...selectors: Selector[]) {
    return this.applySelectors(this.flatSelectors(selectors), this.state);
  }
}
