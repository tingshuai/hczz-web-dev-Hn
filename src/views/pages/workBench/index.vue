<template>
	<div class="workbench-page">
		<div v-if="visible" class="workbench-page">
			<old-index></old-index>
		</div>
		<div v-else>
			<newIndex></newIndex>
		</div>
		<!--<el-button @click="buttonthree" style="float:right" v-if="visible">
			简洁版
		</el-button>-->
		<!--<el-button @click="buttonthree" style="float:right" v-else>
			图表版
		</el-button>-->
	</div>
</template>
<script>
	import oldIndex from './oldIndex';
	import newIndex from './newIndex';
	export default {
		components: {
			oldIndex,
			newIndex
		},
		data() {
			return {
				visible: true
			}
		},
		methods: {
			buttonthree() {
				this.visible = !this.visible;
			}
		}
	}
</script>