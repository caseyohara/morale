function Meter($meter) {
  this.$title = $meter.find('h1');
  this.$meter = $meter.find('input');
  this.value = parseInt($meter.val()) || 0;
  this.observe();
  this.colorize();
}

Meter.prototype.observe = function() {
  var self = this;

  self.$meter.knob({
    'change' : function (value) {
      self.value = parseInt(value);
      self.colorize();
      $.post("/", { morale: self.value });
    }
  });
}

Meter.prototype.set = function(value) {
  var self = this;
  value = parseInt(value);

  var start = self.value,
      end = value,
      addend = (end > start) ? 1 : -1,
      remaining = Math.abs(end - start);

  var interval = setInterval(function() {
    if (--remaining < 0) return clearInterval(interval);
    self.value += addend;
    self.$meter.val(self.value).trigger('change');
    self.colorize();
  }, 30);
}

Meter.prototype.colorize = function() {
  var color = colorFor(this.value);
  this.$meter.trigger('configure', { "fgColor": color });
  this.$meter.css("color", color);
  this.$title.css("color", color);
}

function colorFor(value) {
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
