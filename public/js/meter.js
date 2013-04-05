function Meter($meter) {
  this.$title = $meter.find('h1');
  this.$meter = $meter.find('input');
  this.$updated = $meter.find('p');
  this.value = parseInt($meter.val()) || 0;
  this.updated = new Date();
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

Meter.prototype.set = function(morale) {
  this.value = parseInt(morale.value);
  this.updated = parseInt(morale.updated);
  this.$meter.val(this.value).trigger('change');
  this.$updated.find('time').text(time_ago_in_words(this.updated));
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

  this.colors = this.colors || Range(0, 100).map(function(i) {
    var hue = Math.floor(((i * 0.22) / 100) * 360);
    return "hsl(" + hue + ",90%,50%)";
  });

  return this.colors[value];
}

function Range(from, to) {
  var range = [];
  for (var i=from; i <= to; i++)
    range.push(i);
  return range;
}
