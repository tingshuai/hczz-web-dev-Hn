<template>
	<div class="inputNumber" >
        <el-input-number size="mini" v-model="objTime.hours" label="个" controls-position="right" :max="150" :min="0" @change="changeHours"></el-input-number>&nbsp;&nbsp;时&nbsp;&nbsp;
        <el-input-number size="mini" v-model="objTime.minutes" controls-position="right" :min="0" :max="59" @change="changeMinutes"></el-input-number>&nbsp;&nbsp;分
    </div>
</template>

<script>
	export default {
		props:{
			objTime:{
				type:Object,
				default:function(){
					return {}
				}
			}
		},
		data(){
			return {
                minute:null
			}
        },
        computed:{
            
        },
		methods:{
			changeHours(val){
                this.minute = val * 60 + this.objTime.minutes;
                this.commit();
            },
            changeMinutes(val){
                this.minute = this.objTime.hours * 60 + val;
                this.commit();
            },
            commit(){
                this.$emit(`${this.objTime.event}`,this.minute);
            }
		},
		mounted(){
			
		}
	}
</script>

<style lang="less" scoped>
    .inputNumber{
        /deep/ .el-input-number{
            width: 60px;
            height: 28px;
            .el-input__inner{
                padding-left: 0px;
                padding-right: 32px;
                text-align: center;
            }
        }
    }
</style>