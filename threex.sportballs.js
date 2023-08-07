import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
/**
 * declare THREEx namespace
 * @type {[type]}
 */
var THREEx	= THREEx	|| {};

/**
 * THREEx extension
 * 
 * @constructor
 */
THREEx.SportBalls	= {};

THREEx.SportBalls.baseURL	= '../'


THREEx.SportBalls.createBasket	= function(){
	var texture	= THREE.ImageUtils.loadTexture('images/BasketballColor.jpg')
	var geometry	= new THREE.SphereGeometry(0.5, 32, 16);
	var material	= new THREE.MeshPhongMaterial({
		map	: texture,
		bumpMap	: texture,
		bumpScale: 0.01,
	})
	var mesh	= new THREE.Mesh( geometry, material );
	return mesh	
}

THREEx.SportBalls.createBeach	= function(){
	var texture	= THREE.ImageUtils.loadTexture('images/BeachBallColor.jpg')
	var geometry	= new THREE.SphereGeometry(0.5, 32, 16);
	var material	= new THREE.MeshPhongMaterial({
		map	: texture,
		bumpMap	: texture,
		bumpScale: 0.01,
	})
	var mesh	= new THREE.Mesh( geometry, material );
	return mesh	
}

THREEx.SportBalls.createTennis	= function(){
	var textureColor= THREE.ImageUtils.loadTexture('images/NewTennisBallColor.jpg')
	var textureBump	= THREE.ImageUtils.loadTexture('images/TennisBallBump.jpg')
	var geometry	= new THREE.SphereGeometry(0.5, 32, 16);
	var material	= new THREE.MeshPhongMaterial({
		map	: textureColor,
		bumpMap	: textureBump,
		bumpScale: 0.01,
	})
	var mesh	= new THREE.Mesh( geometry, material );
	return mesh	
}

THREEx.SportBalls.createFootball	= function(){
	var texture	= THREE.ImageUtils.loadTexture('images/Footballballfree.jpg59a2a1dc-64c8-4bc3-83ef-1257c9147fd1Large.jpg')
	var geometry	= new THREE.SphereGeometry(0.5, 32, 16);
	var material	= new THREE.MeshPhongMaterial({
		map	: texture,
		bumpMap	: texture,
		bumpScale: 0.01,
	})
	var mesh	= new THREE.Mesh( geometry, material );
	return mesh	
}

THREEx.SportBalls.createSoftball	= function(){
	var textureColor= THREE.ImageUtils.loadTexture('images/SoftballColor.jpg')
	var textureBump	= THREE.ImageUtils.loadTexture('images/SoftballBump.jpg')
	var geometry	= new THREE.SphereGeometry(0.5, 32, 16);
	var material	= new THREE.MeshPhongMaterial({
		map	: textureColor,
		bumpMap	: textureBump,
		bumpScale: 0.01,
	})
	var mesh	= new THREE.Mesh( geometry, material );
	return mesh	
}
