function Meter($meter) {
  this.$title = $meter.find('h1');
  this.$meter = $meter.find('input');
  this.value = parseInt($meter.val()) || 0;
  this.observers = {};
  this.observe();
  this.colorize();
}

Meter.prototype.observe = function() {
  var self = this;

  self.$meter.knob({
    'change' : function (value) {
      self.value = parseInt(value);
      self.colorize();
    },
    'release' : function (value) {
      self.observers["release"].forEach(function(fn) {
        fn(self.value);
      });
    }
  });
}

Meter.prototype.on = function(event, fn) {
  this.observers[event] = this.observers[event] || [];
  this.observers[event].push(fn);
}

Meter.prototype.set = function(value) {
  this.value = parseInt(value);
  this.$meter.val(this.value).trigger('change');
  this.colorize();
}

Meter.prototype.colorize = function() {
  var color = colorFor(this.value);
  this.$meter.trigger('configure', { "fgColor": color });
  this.$meter.css("color", color);
  this.$title.css("color", color);
}

function colorFor(value) {
  if (value < 0) value = 0;
  if (value > 100) value = 100;

  this.colors = this.colors || (function() {
    return Range(0, 100).map(function(i) {
      var h = Math.floor(((i * 0.22) / 100) * 360),
          s = 90,
          l = 50;
      return "hsl(" + h + "," + s + "%," + l + "%" + ")";
    });
  })();
  return this.colors[value];
}

function Range(from, to) {
  var range = [];
  for (var i=from; i <= to; i++)
    range.push(i);
  return range;
}
