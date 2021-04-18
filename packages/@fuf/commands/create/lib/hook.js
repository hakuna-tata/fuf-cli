class Hook {
  constructor() {
    this.listeners = [];
  }

  on(listener) {
    if (typeof listener !== 'function') {
      throw new Error('listener must be function');
    }

    this.listeners.push(listener);

    return this;
  }

  emit() {
    this.next();
  }

  next() {
    const task = this.listeners.shift();
    task && task();
  }
}

module.exports = Hook;
