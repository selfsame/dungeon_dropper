// Generated by CoffeeScript 1.3.1
(function() {
  var make_map;

  window.game_dimensions = 400;

  console.log(escape('░'));

  make_map = function() {};

  $(window).ready(function() {
    window.master.init();
    return window.master.start_level();
  });

  window.master = {
    game_width: 25,
    game_height: 50,
    map: 0,
    player: 0,
    action_lock: 0,
    init: function() {
      this.player = this.create_actor();
      this.player.data('is_player', 1);
      $('#game').append(this.player);
      return $(window).keydown(function(e) {
        console.log(e.keyCode);
        if (e.keyCode === 37) {
          window.master.move_actor(window.master.player, [-1, 0], window.master.free_action_lock);
        }
        if (e.keyCode === 38) {
          window.master.move_actor(window.master.player, [0, -1], window.master.free_action_lock);
        }
        if (e.keyCode === 39) {
          window.master.move_actor(window.master.player, [1, 0], window.master.free_action_lock);
        }
        if (e.keyCode === 40) {
          window.master.move_actor(window.master.player, [0, 1], window.master.free_action_lock);
        }
        if (e.keyCode === 36) {
          window.master.move_actor(window.master.player, [-1, -1], window.master.free_action_lock);
        }
        if (e.keyCode === 33) {
          window.master.move_actor(window.master.player, [1, -1], window.master.free_action_lock);
        }
        if (e.keyCode === 35) {
          window.master.move_actor(window.master.player, [-1, 1], window.master.free_action_lock);
        }
        if (e.keyCode === 34) {
          return window.master.move_actor(window.master.player, [1, 1], window.master.free_action_lock);
        }
      });
    },
    free_action_lock: function() {
      window.master.action_lock = 0;
      return window.master.actor_actions();
    },
    create_actor: function(color, symbol, pos) {
      var cont;
      if (color == null) {
        color = "#ffffff";
      }
      if (symbol == null) {
        symbol = "@";
      }
      if (pos == null) {
        pos = [0, 0];
      }
      cont = $('<div class="actor"><img class="shadow" src="img/shadow.png"><div class="symbol">' + symbol + '</div></div>');
      cont.children('.symbol').css('color', color);
      cont.data('pos', pos);
      cont.data('hp', 12);
      cont.data('damage', 3);
      return cont;
    },
    move_actor: function(actor, d, callback) {
      var go, pos, px, py;
      if (callback == null) {
        callback = 0;
      }
      if (actor.data('is_player')) {
        if (this.action_lock === 1) {
          return;
        }
      }
      if (!actor.data('pos')) {
        return;
      }
      pos = actor.data('pos');
      if (this.map[pos[1] + d[1]][pos[0] + d[0]] === 0) {
        return;
      }
      if (actor.data('is_player')) {
        this.action_lock = 1;
      }
      px = pos[0] + d[0];
      py = pos[1] + d[1];
      go = $('#game').offset();
      if (this.actor_map[px + ',' + py]) {
        if (this.actor_map[px + ',' + py].length === 0) {
          this.actor_map[pos[0] + ',' + pos[1]] = [];
          this.actor_map[px + ',' + py] = actor;
          pos[0] += d[0];
          pos[1] += d[1];
          actor.animate({
            left: pos[0] * 16 + go.left,
            top: pos[1] * 8 + go.top
          }, 200, 'linear', function() {
            if (callback) {
              return callback();
            }
          });
          return actor.children('.symbol').animate({
            top: -10
          }, 100, 'linear', function() {
            actor.css('z-index', pos[1] * 100);
            return actor.children('.symbol').animate({
              top: 0
            }, 100, 'linear');
          });
        } else {
          actor.animate({
            left: (pos[0] + d[0]) * 16 - (d[0] * 16) / 4 + go.left,
            top: (pos[1] + d[1]) * 8 - (d[1] * 8) / 2 + go.top
          }, 100, 'linear', function() {
            return actor.animate({
              left: pos[0] * 16 + go.left,
              top: pos[1] * 8 + go.top
            }, 100, 'linear', function() {
              if (callback) {
                return callback();
              }
            });
          });
          return this.attack(actor, this.actor_map[px + ',' + py]);
        }
      }
    },
    attack: function(actor1, actor2) {
      var d, info;
      console.log(actor1[0], ' attacking ', actor2[0]);
      d = actor1.data('damage');
      actor2.data('hp', actor2.data('hp') - d);
      info = $('<div class="hurt">' + d + '</div>');
      actor2.append(info);
      info.animate({
        top: -15,
        opacity: .1
      }, 1000, function() {
        return info.detach();
      });
      if (actor2.data('hp') <= 0) {
        return this.kill(actor2);
      }
    },
    kill: function(actor) {
      var idx, pos;
      console.log('killing ', actor);
      pos = actor.data('pos');
      console.log(this.actors);
      idx = this.actors.indexOf(actor);
      if (idx !== -1) {
        console.log('removing from actors');
        this.actors.splice(idx, 1);
      }
      this.actor_map[pos[0] + ',' + pos[1]] = [];
      return actor.detach();
    },
    get_random_tile: function() {
      var t, tiles;
      tiles = ["%u2592", "%u2591", "%u2593"];
      return t = tiles[parseInt(Math.random() * tiles.length)];
    },
    make_map: function(level) {
      var i, j, row, _i, _j, _ref, _ref1;
      if (level == null) {
        level = 0;
      }
      this.map = [];
      this.actor_map = {};
      this.actors = [];
      this.empty_tiles = [];
      for (i = _i = 0, _ref = this.game_height - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        row = [];
        for (j = _j = 0, _ref1 = this.game_width - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
          row.push(0);
        }
        this.map.push(row);
      }
      return this.map;
    },
    draw_map: function() {
      var ctx, ground, i, j, row, t, _i, _j, _len, _len1, _ref, _results;
      if (!this.map) {
        this.make_map();
      }
      ctx = $('#canvas')[0].getContext('2d');
      ground = $('#ground')[0];
      i = 0;
      j = 0;
      _ref = this.map;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        row = _ref[_i];
        for (_j = 0, _len1 = row.length; _j < _len1; _j++) {
          t = row[_j];
          if (t !== 0) {
            ctx.drawImage(ground, j * 16, i * 8);
          }
          j += 1;
        }
        j = 0;
        _results.push(i += 1);
      }
      return _results;
    },
    dig_cave: function(x, y, iterations) {
      var i, _i, _results;
      if (x == null) {
        x = 10;
      }
      if (y == null) {
        y = 10;
      }
      if (iterations == null) {
        iterations = 10;
      }
      if (!this.map) {
        this.make_map();
      }
      _results = [];
      for (i = _i = 0; 0 <= iterations ? _i <= iterations : _i >= iterations; i = 0 <= iterations ? ++_i : --_i) {
        this.map[y][x] = this.get_random_tile();
        if (!this.actor_map[x + ',' + y]) {
          this.actor_map[x + ',' + y] = [];
          this.empty_tiles.push([x, y]);
        }
        if (Math.random() < .5) {
          x += parseInt(Math.random() * 3) - 1;
        } else {
          y += parseInt(Math.random() * 3) - 1;
        }
        if (x < 0) {
          x = 0;
        }
        if (y < 0) {
          y = 0;
        }
        if (x > this.game_width - 1) {
          x = this.game_width - 1;
        }
        if (y > this.game_height - 1) {
          _results.push(y = this.game_height - 1);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },
    populate_map: function() {
      var color, go, i, newguy, p, pos, symbol, _i, _results;
      _results = [];
      for (i = _i = 0; _i <= 5; i = ++_i) {
        p = this.empty_tiles.splice(parseInt(Math.random() * (this.empty_tiles.length - 1)), 1)[0];
        newguy = this.create_actor(color = "orange", symbol = "k", pos = p);
        this.actors.push(newguy);
        this.actor_map[p[0] + ',' + p[1]] = newguy;
        $('#game').append(newguy);
        newguy.css('z-index', p[1] * 100);
        go = $('#game').offset();
        _results.push(newguy.offset({
          left: go.left + p[0] * 16,
          top: go.top + p[1] * 8
        }));
      }
      return _results;
    },
    actor_actions: function() {
      var actor, x, y, _i, _len, _ref, _results;
      _ref = this.actors;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        actor = _ref[_i];
        if (actor) {
          x = parseInt(Math.random() * 3) - 1;
          y = parseInt(Math.random() * 3) - 1;
          if (x !== 0 || y !== 0) {
            _results.push(this.move_actor(actor, [x, y]));
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },
    start_level: function() {
      var go;
      this.map = this.make_map();
      this.dig_cave(12, 25, 200);
      this.populate_map();
      this.player.data('pos', [12, 25]);
      this.actor_map[12 + ',' + 25] = this.player;
      this.player.css('z-index', 25 * 100);
      this.draw_map();
      go = $('#game').offset();
      this.player.offset({
        left: go.left + 12 * 16,
        top: 25 * 8 + go.top
      });
      this.player.children('.symbol').css('top', -200);
      return this.player.children('.symbol').animate({
        top: 0
      }, 1000, 'easeInExpo', function() {
        return window.master.player.children('.symbol').animate({
          top: -10
        }, 100, 'easeOutCirc', function() {
          return window.master.player.children('.symbol').animate({
            top: 0
          }, 100, 'easeInCirc');
        });
      });
    }
  };

}).call(this);