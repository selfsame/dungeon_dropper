
window.game_dimensions = 400
console.log escape('░')
make_map = ->
	

$(window).ready ->

	window.master.init()
	window.master.start_level()

window.master = 
	game_width: 25
	game_height: 50
	map: 0
	player: 0
	action_lock: 0
	init: ->
		@player = @create_actor()
		@player.data('is_player', 1)
		$('#game').append @player

		$(window).keydown (e) ->
			console.log e.keyCode
			if e.keyCode is 37
				window.master.move_actor window.master.player, [-1,0], window.master.free_action_lock
			if e.keyCode is 38
				window.master.move_actor window.master.player, [0,-1], window.master.free_action_lock
			if e.keyCode is 39
				window.master.move_actor window.master.player, [1,0], window.master.free_action_lock
			if e.keyCode is 40
				window.master.move_actor window.master.player, [0,1], window.master.free_action_lock
			if e.keyCode is 36
				window.master.move_actor window.master.player, [-1,-1], window.master.free_action_lock
			if e.keyCode is 33
				window.master.move_actor window.master.player, [1,-1], window.master.free_action_lock
			if e.keyCode is 35
				window.master.move_actor window.master.player, [-1,1], window.master.free_action_lock
			if e.keyCode is 34
				window.master.move_actor window.master.player, [1,1], window.master.free_action_lock

	free_action_lock: ()->
		window.master.action_lock = 0
		window.master.actor_actions()

	create_actor: (color="#ffffff", symbol="@", pos=[0,0])->
		cont = $('<div class="actor"><img class="shadow" src="img/shadow.png"><div class="symbol">'+symbol+'</div></div>')
		cont.children('.symbol').css('color', color)
		cont.data('pos', pos)
		cont.data('hp', 12)
		cont.data('damage', 3)
		return cont


	move_actor: (actor, d, callback=0)->
		if actor.data('is_player')
			if @action_lock is 1
				return
		if not actor.data('pos')
			return
		pos = actor.data('pos')
		if @map[pos[1]+d[1]][pos[0]+d[0]] is 0
			return
		if actor.data('is_player')
			@action_lock = 1

		

		px = pos[0]+d[0]
		py = pos[1]+d[1]
		go = $('#game').offset()
		if @actor_map[px+','+py]
			if @actor_map[px+','+py].length is 0
				#update the actor map if it's a valid move
				@actor_map[pos[0]+','+pos[1]] = []
				@actor_map[px+','+py] = actor
				pos[0] += d[0]
				pos[1] += d[1]
				
				actor.animate { left: pos[0]*16 + go.left, top: pos[1]*8 + go.top }, 200, 'linear', ->
					if callback
						callback()
				actor.children('.symbol').animate { top: -10 }, 100, 'linear', ->
					actor.css('z-index', pos[1]*100)
					actor.children('.symbol').animate { top: 0 }, 100, 'linear'
			else
				actor.animate { left: (pos[0]+d[0])*16 - (d[0]*16)/4 + go.left, top: (pos[1]+d[1])*8 - (d[1]*8)/2 + go.top }, 100, 'linear', ->
					actor.animate { left: pos[0]*16 + go.left, top: pos[1]*8 + go.top }, 100, 'linear', ->
						if callback
							callback()
				#actor.children('.symbol').animate { top: -5 }, 100, 'linear', ->
				#	actor.css('z-index', pos[1]*100)
				#	actor.children('.symbol').animate { top: 0 }, 100, 'linear'
				@attack actor, @actor_map[px+','+py]

	attack: (actor1, actor2)->
		console.log actor1[0], ' attacking ', actor2[0]
		d = actor1.data('damage')
		actor2.data('hp', actor2.data('hp')-d )
		info = $('<div class="hurt">'+d+'</div>')
		actor2.append info
		info.animate {top:-15, opacity:.1}, 1000, ->
			info.detach()
		if actor2.data('hp') <= 0
			@kill actor2

	kill: (actor)->
		console.log 'killing ', actor
		pos = actor.data('pos')
		console.log @actors

		idx = @actors.indexOf(actor)
		if idx isnt -1
			console.log 'removing from actors'
			@actors.splice(idx, 1)
					
		@actor_map[pos[0]+','+pos[1]] = []
		actor.detach()
		

		

	get_random_tile: ->
		tiles = ["%u2592",  "%u2591", "%u2593"]
		t = tiles[parseInt(Math.random()*tiles.length)]

	make_map: (level=0)->
		@map = []
		@actor_map = {}
		@actors = []
		@empty_tiles = []
		for i in [0..(@game_height-1)]
			row = []
			for j in [0..(@game_width-1)]
				row.push 0
			@map.push row
		return @map

	draw_map: ()->
		if not @map
			@make_map()
		ctx = $('#canvas')[0].getContext('2d')
		ground = $('#ground')[0]

		i = 0
		j = 0
		for row in @map
			for t in row
				if t isnt 0
					ctx.drawImage ground, j*16, i*8
				j += 1
			j = 0
			i += 1

	dig_cave: (x=10, y=10, iterations=10)->
		if not @map
			@make_map()
		for i in [0..iterations]
			@map[y][x] = @get_random_tile()
			if not @actor_map[x+','+y]
				@actor_map[x+','+y] = []
				@empty_tiles.push [x,y]
			if Math.random() < .5
				x += parseInt(Math.random()*3)-1
			else
				y += parseInt(Math.random()*3)-1
			if x < 0
				x = 0
			if y < 0
				y = 0
			if x > @game_width-1
				x = @game_width-1
			if y > @game_height-1
				y = @game_height-1

	populate_map: ->
		for i in [0..5]
			p = @empty_tiles.splice(parseInt(Math.random()*(@empty_tiles.length-1)), 1)[0]
			newguy = @create_actor(color="orange", symbol="k", pos=p)
			@actors.push newguy
			@actor_map[p[0]+','+p[1]] = newguy
			$('#game').append newguy
			newguy.css('z-index', p[1]*100)
			go = $('#game').offset()
			newguy.offset( {left: go.left + p[0]*16, top: go.top + p[1]*8} )


	actor_actions: ->
		for actor in @actors
			if actor
				x = parseInt(Math.random()*3)-1
				y = parseInt(Math.random()*3)-1
				if x isnt 0 or y isnt 0
					@move_actor(actor, [x,y])


	start_level: ->
		@map = @make_map()
		@dig_cave(12,25,200)
		@populate_map()
		@player.data('pos', [12,25])
		@actor_map[12+','+25] = @player
		@player.css('z-index', 25*100)
		@draw_map()
		go = $('#game').offset()
		@player.offset({left:go.left+12*16, top:25*8 + go.top})
		@player.children('.symbol').css('top', -200)
		@player.children('.symbol').animate { top: 0 }, 1000, 'easeInExpo', ->
			window.master.player.children('.symbol').animate { top: -10 }, 100, 'easeOutCirc', ->
				window.master.player.children('.symbol').animate { top: 0 }, 100, 'easeInCirc'


