import { EventEmitter } from "./EventEmitter";

export class Sizes {
  eventEmitter: EventEmitter;
  width: number;
  height: number;
  pixelRatio: number;

  constructor() {
    this.eventEmitter = EventEmitter.getInstance();
    this.width = 0;
    this.height = 0;
    this.pixelRatio = 1;
    this.updateSizes();

    window.addEventListener("resize", this.updateSizes);
  }

  updateSizes = () => {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.eventEmitter.trigger("resize");
  };
}
