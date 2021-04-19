class Hook {
  constructor() {
    this.listeners = [];
  }
 
  push(listener) {
    if (typeof listener !== 'function') {
      throw new Error('listener must be function');
    }

    this.listeners.push(listener);

    return this;
  }

  async next() {
    const task = this.listeners.shift();
    task && await task();
  }
}

module.exports = Hook;
