export class EventEmitter {
  private static instance: EventEmitter;

  callbacks: Record<string, Function[]>;

  // Singleton
  static getInstance(): EventEmitter {
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }

  private constructor() {
    this.callbacks = {};
  }

  on(eventName: string, callback: Function) {
    if (!this.callbacks[eventName]) this.callbacks[eventName] = [];
    this.callbacks[eventName].push(callback);
  }

  off(eventName: string, callback: Function) {
    if (!this.callbacks[eventName]) {
      // console.warn(
      //   "EventEmitter off",
      //   eventName,
      //   "does not exist in event emitter"
      // );
      return;
    }
    this.callbacks[eventName] = this.callbacks[eventName].filter(
      (func) => func !== callback
    );
  }

  trigger(eventName: string) {
    if (!this.callbacks[eventName]) {
      // console.warn(
      //   "EventEmitter trigger",
      //   eventName,
      //   "does not exist in event emitter"
      // );
      return;
    }
    this.callbacks[eventName].map((func) => func());
  }
}
