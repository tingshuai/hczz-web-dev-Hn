<template>
    <div>
         <template v-for="item in menuList" v-if="!item.hidden && item.children">
             <router-link v-if="item.children.length==1&&!item.children[0].children" :to="item.path+'/'+item.children[0].path" :key="item.children[0].name">
                 <el-menu-item :index="item.path+'/'+item.children[0].path" >
                    <!-- <svg-icon v-if="item.icon" :name="item.icon"></svg-icon> -->
                        <svg-icon :name="item.icon + '_outline'"
                            v-if="isHightLight(item.children)"></svg-icon>
                        <svg-icon :name="item.icon" v-else></svg-icon>
                        <!-- <span slot="title">{{item.title}}</span> -->
                    <span slot="title">{{item.children[0].title}}</span>
                 </el-menu-item>
             </router-link>
              <el-submenu v-else :index="item.name||item.path" :key="item.name">
              <!-- <el-submenu :index="item.name||item.path" :key="item.name"> -->
                  <template slot="title">
                        <svg-icon :name="item.icon + '_outline'"
                                v-if="isHightLight(item.children)"></svg-icon>
                        <svg-icon :name="item.icon" v-else></svg-icon>
                        <span slot="title">{{item.title}}</span>
                  </template>
                  <template v-for="child in item.children">
                      <sider-menu v-if="child.children&&child.children.length>0" :menu-list="[child]" :key="child.path"></sider-menu>
                      <router-link v-else :to="item.path+'/'+child.path" :key="child.name">
                        <el-menu-item :index="item.path+'/'+child.path" style="padding-left:50px;">
                            <span slot="title">{{child.title}}</span>
                        </el-menu-item>
                    </router-link>
                  </template>
              </el-submenu>
         </template>
    </div>
</template>

<script>
import util from "@/libs/util";
export default {
    name: "siderMenu",
    props: {
        menuList: {
        type: Array,
        required: true
        }
    },
    computed: {
    },
    created(){
    },
    methods: {
        isHightLight(val){
            return val.some(i => {
                // console.log(this.$route.name);
                // console.log(this.$route);
                // console.log(i.name ); 
                return i.name == this.$route.name;
            })
        }
    }
};
</script>
