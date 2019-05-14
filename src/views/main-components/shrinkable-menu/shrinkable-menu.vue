<template>
    <div class="shrinkable-menu">
        <!--<transition name="collapse">-->
            <el-menu :collapse="isCollapse" mode="vertical" :default-active="activeLink">
                    <sider-menu :menuList="menuList"></sider-menu>
            </el-menu>
        <!--</transition>-->
    </div>
</template>
<script>
import siderMenu from "./sider-menu.vue"
export default {
    components:{
        siderMenu
    },
    props:{
        menuList:{
            type:Array,
            default:[]
        },
        shrink:{
            type:Boolean
        }
    },
    computed:{
         activeLink(){
            return this.$route.path;
        },
        isCollapse(){
            return this.shrink
        }
    }
}
</script>
<style lang="less">
@import "./styles/menu.less";
    /*.collapse-enter-active, .collapse-leave-active {*/
        /*transition:width .3s ease;*/
    /*}*/
    /*.collapse-enter {*/
        /*width: 60px;*/
    /*}*/
     /*.collapse-enter-to {*/
         /*width:180px;*/
     /*}*/
    /*.collapse-leave {*/
        /*width: 60px;*/
    /*}*/
     /*.collapse-leave-to {*/
         /*width:180px;*/
     /*}*/
</style>
