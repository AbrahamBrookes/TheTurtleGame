
<script setup>
import Diver from '@/Models/Diver.vue'
import { Fog } from 'three';
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

import { ref, onMounted } from 'vue'

const renderer = ref()
const scene = ref()

onMounted(() => {
    scene.value.fog = new Fog(0xa0a0a0, 200, 1000);
	// const renderer = renderer.value
	// console.log('onMounted', Diver.value);
	// // const mesh = Diver.value.mesh
	// renderer.onBeforeRender(() => {
	// 	// mesh.rotation.x += 0.01
	// })
})
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