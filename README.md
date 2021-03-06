# PEARLS 
## a real-time three.js+firebase multiplayer scene

[SCULPTURE LIVE HERE](https://pearls-4a785.web.app/) Go crazy. 

A 'social' generative 3D sculpture, which visitors can contribute to by adding or deleting pearls. These changes are then updated real-time to other visitors on the website. Visitors have the choice to do as they please, and build whatever they want (keeping in mind that it might at any time be destroyed by another visitor!).  

This was a coursework for a virtual environments class in which I wanted to concentrate on the theme of collaboration. In this project I attempted to build a visually striking front-end design and gain some experience and understanding in back-end websocket and database management.

Note: Sometimes deleting a lot of spheres quickly results in some lost messages - if the screen freezes, refresh, and continue from where you left off!

## Technical overview

### Front-end

3D world built with [three.js](https://threejs.org/)  

Controls are utilising three.js OrbitControls 
Colours are chosen randomly from 6 different color-palettes upon loading the page. 

At the moment the sculpture is only editable on a computer and a browser. You can view the sculpture and follow its progress on mobile, but you cannot (as of now) contribute to it.

The placement of pearls was implemented with a collision detection system. 

### Back-end

In order to make this project possible and update real-time, hosting and database management was implemented with [Firebase](https://firebase.google.com/).



