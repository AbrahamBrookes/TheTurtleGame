<script setup>
import { ref } from 'vue'
import { FbxModel } from 'troisjs'
import { AnimationMixer, Clock } from 'three'

const props = defineProps({
    renderer: {
        type: Object,
    },
})

const Diver  = ref()
const clock = ref()
const mixer = ref()
const swimAction = ref()

function onLoad(object) {
	// animate the diver to play the swim animation
	mixer.value = new AnimationMixer(object)
	swimAction.value = mixer.value.clipAction(object.animations[5])
	swimAction.value.play()

    // from the example, not sure if I'm going to need it
	// object.traverse(function (child) {
	// 	if (child.isMesh) {
	// 		child.castShadow = true
	// 		child.receiveShadow = true
	// 	}
	// })

	clock.value = new Clock()
	props.renderer.onBeforeRender(updateMixer)
}
function updateMixer() {
	mixer.value.update(clock.value.getDelta());
}

</script>

<template>
    <FbxModel
        src="assets/models/3DKit/diver/diver.fbx"
        ref="Diver"
        @load="onLoad"
        :scale="{ x: 0.001, y: 0.001, z: 0.001 }"
    />
</template>