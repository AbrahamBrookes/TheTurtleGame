<script setup>
// deps
import { ref, onMounted } from 'vue'

// our components
import Diver from '@/Models/Diver.vue'

// three/trois
import {
  AmbientLight,
  Camera,
  DirectionalLight,
  HemisphereLight,
  Renderer,
  PhongMaterial,
  Plane,
  PointLight,
  Scene,
} from 'troisjs';

import { io } from 'socket.io-client'
var socket = io()
socket.emit('what')
// client-side
socket.on("hello", (arg) => {
    console.log(arg); // world
});

const renderer = ref()
const scene = ref()

</script>

<template>
	<Renderer
		ref="renderer"
		antialias
		:orbit-ctrl="{ enableDamping: true }"
		resize="window"
	>
		<Camera :position="{ z: 10 }" />
		<Scene ref="scene">
			<HemisphereLight />

			<DirectionalLight
				:position="{ x: 0, y: 200, z: 100 }"
				cast-shadow :shadow-camera="{ top: 180, bottom: -120, left: -120, right: 120 }"
			/>
			<Diver
				:renderer="renderer"
			/>
		</Scene>
	</Renderer>
</template>

<style>
	body {
		margin: 0;
	}
	canvas {
		display: block;
	}
</style>