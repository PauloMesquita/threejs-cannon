import { EventEmitter } from "./EventEmitter";

export class Time {
  eventEmitter: EventEmitter;
  start: number;
  current: number;
  elapsed: number;
  delta: number; //  since last frame

  constructor() {
    this.eventEmitter = EventEmitter.getInstance();
    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;

    // This instead of this.tick() to prevent some initial bugs
    window.requestAnimationFrame(this.tick.bind(this));
  }

  tick() {
    const now = Date.now();
    this.delta = now - this.current;
    this.current = now;
    this.elapsed = this.current - this.start;

    this.eventEmitter.trigger("tick");

    window.requestAnimationFrame(this.tick.bind(this));
  }
}
