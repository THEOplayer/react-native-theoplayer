export class PromiseController<T> {
  readonly promise_: Promise<T>;
  private _resolve: ((result: T | PromiseLike<T>) => void) | undefined;
  private _reject: ((reason: any) => void) | undefined;

  constructor() {
    this.promise_ = new Promise<T>((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  resolve_(result: T): void {
    if (this._resolve) {
      this._resolve(result);
      this.destroy_();
    }
  }

  reject_(reason: any): void {
    if (this._reject) {
      this._reject(reason);
      this.destroy_();
    }
  }

  private destroy_() {
    this._resolve = undefined;
    this._reject = undefined;
  }
}
