<template>
    <div class="totalbox">
        <div class="totalhead">
           <p class="title">
               <span><Icon type="ios-menu-outline" />&nbsp;日常合成请求</span>
               <span>更多</span>
           </p>
           <div class="topone">
               <p class="toponetitle">日常合成请求总计</p>
               <div class="boxcon">
                    <p class="toponebox" v-for="(item,index) in List" :key="index">
                        <span class="oneleft">{{item.main}}</span>
                        <span  class="speed"><i class="grad" style="width:5px"></i></span>
                        <span  class="oneright">{{item.number}}条</span>
                    </p>
               </div>
               
           </div>
        </div>
    </div>
</template>
<script>
export default {
		
		data() {
			return {
				List:[
                    {main:'sss',number:'12222'},
                    {main:'sss',number:'566'},
                    {main:'sss',number:'5666'},
                    {main:'sss',number:'22'},
                    {main:'sss',number:'1222'},
                    {main:'sss',number:'4222'},

                ]
			}
		},
		mounted() {
			

		},
		methods: {
			
		}
	}
</script>
 <style lang="less" scoped>
    .totalbox{
        width: 100%;
        height: 100%;
        
        
        .totalhead{
            
            width: 100%;
            height: 400px;
            border: 1Px solid #d6d6d6;
            .title{
                padding: 0 20px;
                height: 40px;
                line-height: 40px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #d6d6d6;
                margin-bottom: 10px;                
            }
            .topone{
                margin: 0 10px;
                width: 300px;
                border: 1Px solid #e5e5e5;
                border-radius: 8px;
                .toponetitle{
                    height: 35px;
                    background: #e5e5e5;
                    width: 100%;
                    text-align: center;
                    line-height: 35px;
                    border-radius: 8px 8px 0 0;
                }
                .boxcon{
                    background: #fff;
                    padding: 10px 0;
                    border-radius: 0 0 10px 10px;
                    .toponebox{
                        height: 30px;
                        line-height: 30px;
                        display: flex;
                        align-items: center;
                        justify-content: space-around;
                        .oneleft{
                            width: 50px;
                            text-align: right;
                            display: inline-block;
                        }
                        .speed{
                            width:100px;
                            height:5px;
                            background:#f2f2f2;
                            display: inline-block;
                            border-radius: 10px;
                            position: relative;
                            .grad{
                                height: 5px;
                                background: #397cbf;
                                display: inline-block;
                                border-radius: 10px 0 0 10px;
                            
                            }
                        }
                        .one{
                            width: 100px;
                            text-align: right;
                            display: inline-block;
                        }

                    }
                }
                

            }
        }
    }
</style>


