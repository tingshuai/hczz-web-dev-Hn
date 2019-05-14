<template>
	<div>
		<el-dialog title="处理日志" :visible.sync="visible" :modal="false"  @close='cancelBtn'>
			<div style="height:600px;">
				<el-steps direction="vertical">
					<el-step :title="item.status" v-for="(item,index) in list" :key="item.id">
						<div slot="title">
							{{item.czsj | timestampToTime}}
						</div>
						<div slot="description">
							<span>{{item.zxr}}</span>
							<span>{{item.czlx}}</span>
						</div>
					</el-step>
				</el-steps>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import api from '@/fetch/api';
	export default {
	    props: {
	        show: {
	            type: Boolean,
	            default: false
	        },
	        flowFnc: {
	            type: Promise
	        }
	    },
	    data () {
	        return {
	            visible: this.show,
	            list: []
	        };
	    },
	    mounted () {
	        this.flowFnc.then(res => {
	            this.list = res.clrzList;
	        });
	    },
	    watch: {
	        show (val) {
	            this.visible = val;
	        }
	    },
	    methods: {
	        cancelBtn () {
	            this.$emit('update');
	        }
	    }
	};
</script>

<style>

</style>