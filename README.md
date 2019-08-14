# TheTurtleGame
A game where there's turtles and it's a game with turtles in a game about turtles

TheTurtleGame is a mutiplayer 3D browser game in html, css and javascript. It uses nodejs and sockets.io on the backend, and three.js
combined with html and javascript on the client. 

The 'client' is actually two separate screens. The three.js 3D environment is non-interactive, and is designed to go on a shared screen
that all players can see. The second environment is the controller, which is designed for use on mobile phone screens. The idea is that 
people can connect their phones to the game and it would spawn in a new player. They can then play on their phones, and their avatar 
would move about on the screen.

So the server listens for new http requests to the controller "page" - which would simply be people visiting a website after scanning a 
qr code or inputting a short url - the url to the "controller" page. The server creates a new "player", and facilitates a connection
between the player and the screen. The heavy lifting is done by nodejs and sockets.io, really a stellar team. The latency was quite 
acceptable even on a dodgy cpanel hosting webserver, allowing screens and controllers to be situated anywhere really. Worldwide even.

The game itself was to be turtles and humans. Two teams. The turtles start at bottom left of the screen - next to a den - and the humans 
start at top right, next to their boat. All over the screen are what look like jellyfish. As a turtle, you swim up, find a jellyfish, and
bring it back to your cave, to eat. As a human, you grab a jelly and take it back to your boat, to check if it's a plastic bag.

If you're a turtle, and the jellyfish you brought back to your den turns out to be a plastic bag, you lose points. If it's a jellyfish,
you gain points. As a human, every plastic bag you retrieve nets you points, and the jellys you simply throw back, because now the turtles 
know it's a jellyfish. It's up to all players to help the turtles win points.

As far as I remember this is still installed and running on my pi3. I got as far as a multiplayer turtle sandbox - you could log in and a
new turtle would appear on the screen, and you could swim around and be a turtle, with your friends. I was just starting to add in the
jellyfish, and I think that's the last work, I don't even remember if I pushed it. bleh
