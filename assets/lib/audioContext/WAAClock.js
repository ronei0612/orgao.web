function WAAClock(context, options) {
  options = options || {};
  this.tickMethod = options.tickMethod || 'ScriptProcessorNode';
  this.toleranceEarly = options.toleranceEarly || 0.001;
  this.toleranceLate = options.toleranceLate || 0.10;
  this.context = context;
  this._events = [];
  this._started = false;
}

const CLOCK_DEFAULTS = {
  toleranceLate: 0.10,
  toleranceEarly: 0.001
};

function EventWAAClock(clock, deadline, func) {
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

EventWAAClock.prototype.clear = function () {
  this.clock._removeEvent(this);
  this._cleared = true;
  return this;
};

EventWAAClock.prototype.repeat = function (time) {
  if (time === 0) throw new Error('delay cannot be 0');
  this.repeatTime = time;
  if (!this.clock._hasEvent(this))
    this.schedule(this.deadline + this.repeatTime);
  return this;
};

EventWAAClock.prototype.tolerance = function (values) {
  if (typeof values.late === 'number') this.toleranceLate = values.late;
  if (typeof values.early === 'number') this.toleranceEarly = values.early;
  this._refreshEarlyLateDates();
  if (this.clock._hasEvent(this)) {
    this.clock._removeEvent(this);
    this.clock._insertEvent(this);
  }
  return this;
};

EventWAAClock.prototype.isRepeated = function () {
  return this.repeatTime !== null;
};

EventWAAClock.prototype.schedule = function (deadline) {
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
};

EventWAAClock.prototype.timeStretch = function (tRef, ratio) {
  if (this.isRepeated()) this.repeatTime = this.repeatTime * ratio;

  var deadline = tRef + ratio * (this.deadline - tRef);
  if (this.isRepeated()) {
    while (this.clock.context.currentTime >= deadline - this.toleranceEarly)
      deadline += this.repeatTime;
  }
  this.schedule(deadline);
};

EventWAAClock.prototype._execute = function () {
  if (this.clock._started === false) return;
  this.clock._removeEvent(this);

  if (this.clock.context.currentTime < this._latestTime)
    this.func(this);
  else {
    if (this.onexpired) this.onexpired(this);
    console.warn('event expired');
  }
  if (!this.clock._hasEvent(this) && this.isRepeated() && !this._cleared)
    this.schedule(this.deadline + this.repeatTime);
};

EventWAAClock.prototype._refreshEarlyLateDates = function () {
  this._latestTime = this.deadline + this.toleranceLate;
  this._earliestTime = this.deadline - this.toleranceEarly;
};

WAAClock.prototype.setTimeout = function (func, delay) {
  return this._createEvent(func, this._absTime(delay));
};

WAAClock.prototype.callbackAtTime = function (func, deadline) {
  return this._createEvent(func, deadline);
};

WAAClock.prototype.timeStretch = function (tRef, events, ratio) {
  events.forEach(function (event) {
    event.timeStretch(tRef, ratio);
  });
  return events;
};

WAAClock.prototype.start = function () {
  if (this._started === false) {
    var self = this;
    this._started = true;
    this._events = [];

    if (this.tickMethod === 'ScriptProcessorNode') {
      var bufferSize = 256;
      this._clockNode = this.context.createScriptProcessor(bufferSize, 1, 1);
      this._clockNode.connect(this.context.destination);

      this._clockNode.onaudioprocess = function () {
        setTimeout(function () {
          self._tick();
        }, 0);
      };
    } else if (this.tickMethod === 'manual') null;
    else throw new Error('invalid tickMethod ' + this.tickMethod);
  }
};

WAAClock.prototype.stop = function () {
  if (this._started === true) {
    this._started = false;
    this._clockNode.disconnect();
  }
};

WAAClock.prototype._tick = function () {
  var event = this._events.shift();

  while (event && event._earliestTime <= this.context.currentTime) {
    event._execute();
    event = this._events.shift();
  }

  if (event) this._events.unshift(event);
};

WAAClock.prototype._createEvent = function (func, deadline) {
  return new EventWAAClock(this, deadline, func);
};

WAAClock.prototype._insertEvent = function (event) {
  this._events.splice(this._indexByTime(event._earliestTime), 0, event);
};

WAAClock.prototype._removeEvent = function (event) {
  var ind = this._events.indexOf(event);
  if (ind !== -1) this._events.splice(ind, 1);
};

WAAClock.prototype._hasEvent = function (event) {
  return this._events.indexOf(event) !== -1;
};

WAAClock.prototype._indexByTime = function (deadline) {
  var low = 0;
  var high = this._events.length;
  var mid;

  while (low < high) {
    mid = Math.floor((low + high) / 2);
    if (this._events[mid]._earliestTime < deadline) low = mid + 1;
    else high = mid;
  }
  return low;
};

WAAClock.prototype._absTime = function (relTime) {
  return relTime + this.context.currentTime;
};

WAAClock.prototype._relTime = function (absTime) {
  return absTime - this.context.currentTime;
};