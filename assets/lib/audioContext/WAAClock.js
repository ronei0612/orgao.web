class WAAClock {
  constructor(context, options = {}) {
    this.tickMethod = options.tickMethod || 'ScriptProcessorNode';
    this.toleranceEarly = options.toleranceEarly || 0.001;
    this.toleranceLate = options.toleranceLate || 0.10;
    this.context = context;
    this._events = [];
    this._started = false;
  }

  setTimeout(func, delay) {
    return this._createEvent(func, this._absTime(delay));
  }

  callbackAtTime(func, deadline) {
    return this._createEvent(func, deadline);
  }

  timeStretch(tRef, events, ratio) {
    events.forEach(event => event.timeStretch(tRef, ratio));
    return events;
  }

  start() {
    if (!this._started) {
      this._started = true;
      this._events = [];

      if (this.tickMethod === 'ScriptProcessorNode') {
        const bufferSize = 256;
        this._clockNode = this.context.createScriptProcessor(bufferSize, 1, 1);
        this._clockNode.connect(this.context.destination);

        this._clockNode.onaudioprocess = () => {
          setTimeout(() => this._tick(), 0);
        };
      } else if (this.tickMethod !== 'manual') {
        throw new Error('invalid tickMethod ' + this.tickMethod);
      }
    }
  }

  stop() {
    if (this._started) {
      this._started = false;
      this._clockNode.disconnect();
    }
  }

  _tick() {
    let event = this._events.shift();

    while (event && event._earliestTime <= this.context.currentTime) {
      event._execute();
      event = this._events.shift();
    }

    if (event) {
      this._events.unshift(event);
    }
  }

  _createEvent(func, deadline) {
    return new EventWAAClock(this, deadline, func);
  }

  _insertEvent(event) {
    this._events.splice(this._indexByTime(event._earliestTime), 0, event);
  }

  _removeEvent(event) {
    const index = this._events.indexOf(event);
    if (index !== -1) {
      this._events.splice(index, 1);
    }
  }

  _hasEvent(event) {
    return this._events.indexOf(event) !== -1;
  }

  _indexByTime(deadline) {
    let low = 0;
    let high = this._events.length;
    let mid;

    while (low < high) {
      mid = Math.floor((low + high) / 2);
      if (this._events[mid]._earliestTime < deadline) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    return low;
  }

  _absTime(relTime) {
    return relTime + this.context.currentTime;
  }

  _relTime(absTime) {
    return absTime - this.context.currentTime;
  }
}

class EventWAAClock {
  constructor(clock, deadline, func) {
    this.clock = clock;
    this.func = func;
    this._cleared = false;
    this.toleranceLate = clock.toleranceLate;
    this.toleranceEarly = clock.toleranceEarly;
    this._latestTime = null;
    this._earliestTime = null;
    this.deadline = null;
    this.repeatTime = null;
    this.schedule(deadline);
  }

  clear() {
    this.clock._removeEvent(this);
    this._cleared = true;
    return this;
  }

  repeat(time) {
    if (time === 0) {
      throw new Error('delay cannot be 0');
    }
    this.repeatTime = time;
    if (!this.clock._hasEvent(this)) {
      this.schedule(this.deadline + this.repeatTime);
    }
    return this;
  }

  tolerance(values) {
    if (typeof values.late === 'number') {
      this.toleranceLate = values.late;
    }
    if (typeof values.early === 'number') {
      this.toleranceEarly = values.early;
    }
    this._refreshEarlyLateDates();
    if (this.clock._hasEvent(this)) {
      this.clock._removeEvent(this);
      this.clock._insertEvent(this);
    }
    return this;
  }

  isRepeated() {
    return this.repeatTime !== null;
  }

  schedule(deadline) {
    this._cleared = false;
    this.deadline = deadline;
    this._refreshEarlyLateDates();

    if (this.clock.context.currentTime >= this._earliestTime) {
      this._execute();
    } else if (this.clock._hasEvent(this)) {
      this.clock._removeEvent(this);
      this.clock._insertEvent(this);
    } else {
      this.clock._insertEvent(this);
    }
  }

  timeStretch(tRef, ratio) {
    if (this.isRepeated()) {
      this.repeatTime = this.repeatTime * ratio;
    }

    const deadline = tRef + ratio * (this.deadline - tRef);
    if (this.isRepeated()) {
      while (this.clock.context.currentTime >= deadline - this.toleranceEarly) {
        deadline += this.repeatTime;
      }
    }
    this.schedule(deadline);
  }

  _execute() {
    if (this.clock._started === false) {
      return;
    }
    this.clock._removeEvent(this);

    if (this.clock.context.currentTime < this._latestTime) {
      this.func(this);
    } else {
      if (this.onexpired) {
        this.onexpired(this);
      }
      console.warn('event expired');
    }
    if (!this.clock._hasEvent(this) && this.isRepeated() && !this._cleared) {
      this.schedule(this.deadline + this.repeatTime);
    }
  }

  _refreshEarlyLateDates() {
    this._latestTime = this.deadline + this.toleranceLate;
    this._earliestTime = this.deadline - this.toleranceEarly;
  }
}