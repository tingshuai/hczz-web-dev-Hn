<template>
  <div>
    <!--<Button type="primary" @click="showMapModal">地图操作</Button>-->
    <Modal
      v-model="modal1"
      title="地图操作"
       width="1200"
      @on-cancel="cancel">
      <div slot="footer">
      	<Button @click="cancel">取消</Button>
      	<Button type="primary" @click="sure">确定</Button>
      </div>
      <div id="mapDiv">
        <div id="searchDiv">
          <Cascader :data="citys" class="cityCascader" @on-change="setCity"></Cascader>
          <Select
            v-model="searchSelect"
            id="searchSelect"
            clearable
            filterable
            remote
            :remote-method="remoteMethod"
            :loading="loading"
            placeholder="请输入您要搜索的地点"
            not-found-text="未能找到您输入的地址，试试 手工打点"
            @on-change="onchange(searchSelect)"
            style="width: 260px">
            <Option v-for="(option, index) in myoptions" :value="option.value" :key="index" :label="option.label">
              <Icon type="ios-search" size="15"/>
              <span>{{option.label}}</span>
              <span style="float:right;color:#ccc">{{option.address}}</span>
            </Option>
          </Select>
          <Button id="searchBtn" @click="searchPage" type="primary" icon="ios-search"></Button>
        </div>

        <div id="search-body-box" v-show="sbodyshow" class="search-body-box">
          <ul class="search-body-ul">
            <li v-for="(item, index) in sbbdydata" @click="selectItem(item.value,index)"
                @mouseenter="overShow(item.value,index)" @mouseleave="overHide(item.value,index)">
              <div class="search-res">
                <h3>{{item.label}}</h3>
                <p>{{item.address}}</p>
              </div>
            </li>
          </ul>
          <Page :total="totalum" @on-change="changePage" size="small" show-total/>
        </div>
        <div id="map">
        </div>
        <Button id="drawBtn" @click="setMarker">
          <Icon type="ios-pin" size=15></Icon>
        </Button>
        <div class="postion-box">
          <span style="font-style: italic">坐标</span><span>{{pointx}}</span><span>经度</span><span>{{pointy}}</span><span>纬度</span>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
  export default {
    name: 'Map',
    props:{
    	show:{
    		type:Boolean,
    		default:false
    	}
    },
    data() {
      return {
        searchSelect: '', // select 的modal
        loading: false, // select 加载
        myoptions: [],// select 的选项
        caseaddress: '', // 结果 地址
        pointx: '--', // 结果 经度
        pointy: '--', // 结果 纬度
        modal1: this.show, // 模态弹窗是否显示
        citys: [],// 行政区划数据
        region: '', // 地区选择
        allRegion:'', //全行政区划
        keyword: '', // 搜索关键字
        sbodyshow: false, // 查询div 是否显示
        sbbdydata: [], // 查询结果分页展示
        totalum: 200, // 总条数
        markers: [], // 保存每次分页加载的marker，切换页面后清空
        clickindex: -1, // 地图中点击覆盖物的索引值
        selectflag:false // 是否被选中--通过覆盖物点击
      }
    },
    mounted: function () {
      this.mymap = null
      this.overlay = ""
    },
    watch:{
    	show(val){
    		this.modal1=val;
    		if(val){
    			this.showMapModal();
    		}
    	}
    },
    methods: {
      /**
       *  模态窗口展示事件
       *  @param obj {Object} 包含 address，postion，type属性的对象
       */
      showMapModal(obj) {
//      this.modal1 = true;
        let temp_this = this
        // 初始化行政区划
        this.getCityData()
        if (!this.mymap) {
          // 当模态显示状态并且地图对象为空，初始化地图
          // 设置延时，等待模态框加载完成再去初始化
          setTimeout(() => {
            // 初始化地图
            temp_this.mymap = temp_this.initMap()
            if (obj) { // 当存在参数时
              // 手动添加
              if (obj.type == 'input') {
                temp_this.addMarker(obj.postion.split(','))
                temp_this.addInfo(this.overlay)
                document.getElementById('address').value = obj.address

              } else if (obj.type == 'select') { // 搜索,选择select项添加
                temp_this.addMarker(obj.postion.split(','))
                temp_this.addLable(this.overlay, obj.address)
                temp_this.searchSelect = obj.address

              }else if(obj.type == 'select-input'){ // 搜索，选择分页项和点击覆盖物添加
                temp_this.addMarker(obj.postion.split(','))
                temp_this.addLable(this.overlay, obj.address)
                let query = document.getElementsByClassName('ivu-select-input')
                if (query.length > 0) {
                  query[0].value = obj.address
                }

              }
            }
          }, 100)
        }
      },
      /**
       * 确定按钮事件
       */
      sure() {
        // 返回坐标和地址信息
        let res = {}
        let type = 'select'
        // 手动标记
        if (document.getElementById('address')) {
          if (document.getElementById('address').value) {
            let address = document.getElementById('address').value
            res.address = address
            this.caseaddress = address
          } else {
            this.$Message.error('请输入地址');
            return
          }
          type = 'input'

        } else if (this.searchSelect) { // 搜索,选择select项添加
          let values = this.searchSelect.split(':')
          let postion = values[0] // 坐标数组
          let lable = values[2] + ' ' + values[1] // name+address
          res.postion = postion
          res.address = lable
          res.allRegion = this.allRegion
          this.caseaddress = lable
          this.pointx = postion.split(',')[0]
          this.pointy = postion.split(',')[1];
          
        }else{ //搜索，选择分页项和点击覆盖物添加
          type = 'select-input'
          let query = document.getElementsByClassName('ivu-select-input')
          if (query.length > 0) {
            res.address = query[0].value
          }
        }
        res.postion = this.pointx+','+this.pointy
        res.type = type
        // 确定后返回的数据
        if(!this.allRegion) {
          this.$Message.error('请选择城市');
          return
        }
        if(!res.address) {
          this.$Message.error('请输入您要搜索的地点');
          return
        }
        res.allRegion = this.allRegion + ' '
        this.$emit('updateMap',res)
      },
      /**
       * 取消按钮事件
       */
      cancel() {
        // 清空文本框和地图
        this.mymap.clear();
        // 清空右下角坐标值
        this.pointx = '--'
        this.pointy = '--'
        // 清除select 内容
        this.searchSelect = ''
        // 清除搜索的input内容
        let query = document.getElementsByClassName('ivu-select-input')
        if (query.length > 0) {
          query[0].value = ''
        }
        // 清除分页内容
        this.sbbdydata = []
        // 关闭分页div
        this.sbodyshow = false
        // 清除已添加的覆盖物
        this.markers = [];
        this.$emit('updateMap')

      },
      /**
       *  初始化地图
       */
      initMap() {
        // 初始化地图
        let mymap = new this.$LeadorMap("map", {
          center: [120.209947, 30.245853],
          minZoom: 3,
          maxZoom: 18,
          zoom: 10,
          apiurl: 'http://api.ishowchina.com',
          key: 'ec85d3648154874552835438ac6a02b2'
        })
        // 注册地图插件
        mymap.registerPlugin(['poiSearch', 'suggest', 'tool', 'districtSearch'])
        // 配置地图控件
        let scale = {
          offset: [-15, -95],
          anchor: 'rb',
          type: 'scale'
        }
        mymap.addControl(scale);
        // 添加版权控件
        let copyright = {
          type: 'copyright',
          isDelDefultCopyrigth: 1,
          offset: [0, 0],
          coptright: []
        };
        mymap.addControl(copyright);
        return mymap;
      },
      /**
       * 搜索选中打点方法
       * @param postion
       */
      addMarker(postion) {
        // TODO 通过名称和坐标在地图中进行打点并弹窗显示地名
        if (this.overlay) {
          this.mymap.clearOverlay(this.overlay)
          this.overlay = null
        }
        // 添加点位
        this.overlay = this.mymap.addMarker({
          postion: postion,
          offset: [0, 0],
          iconurl: 'http://webapi.ishowchina.com/jsmap/3.8.1/images/point_1.png',
          size: [35, 30],
          isPanTo: true
        })
      },
      /**
       * 添加点位的标签
       * @param overlay 地图的点对象
       * @param lable 标签内容
       */
      addLable(overlay, lable) {
        // 展现当前点的名称
        this.mymap.addLable(overlay, {
          type: 1,
          content: lable,
          offset: [0, -50]
        });
      },
      /**
       * 手动打点方法
       */
      setMarker() {
        // 手动选择地点，并在该点弹出input框用来输入地名
        this.mymap.clear() // 清除已添加的点位
        if (this.searchSelect) { // 清除已经输入的select内容
          this.searchSelect = ''
        }
        let query = document.getElementsByClassName('ivu-select-input')
        if (query.length > 0) { // 清除已输入的搜索内容
          query[0].value = ''
        }
        // 清除右下角经纬度信息
        this.pointx = '--'
        this.pointy = '--'
        let temp_this = this

        // 设置绘制点位
        this.mymap.drawMarker({
          iconurl: 'http://webapi.ishowchina.com/jsmap/3.8.1/images/point_1.png',
          size: [35, 30],
          callback: function (res) {
            if (res.id) {
              let overlay = res.overlay
              temp_this.addInfo(overlay)
              temp_this.overlay = overlay
              temp_this.pointx = res.position[0]
              temp_this.pointy = res.position[1]
            }
          }
        });
      },
      /**
       * 添加点位弹窗
       * @param overlay 点位对象
       */
      addInfo(overlay) {
        this.mymap.addMarkerInfoWindow(overlay, {
          type: 2,
          content: '<div><input id="address" type="text" placeholder="请输入地址..." /></div>',
          offset: [0, -50],
          size: [60, 30]
        })
      },
      /**
       * 初始化行政区划
       */
      getCityData() {
        let citydata = [{
          value: 'beijing',
          label: '浙江',
          children: [
            {
              value: 'gugong',
              label: '杭州',
              children: [
                {
                  value: 'fuzimiao',
                  label: '江干区',
                }
              ]
            },
            {
              value: 'tiantan',
              label: '宁波'
            },
            {
              value: 'wangfujing',
              label: '温州'
            }
          ]
        }, {
          value: 'jiangsu',
          label: '安徽',
          children: [
            {
              value: 'nanjing',
              label: '合肥'

            },
            {
              value: 'suzhou',
              label: '芜湖'

            }
          ],
        }]
        this.citys = citydata
      },
      /**
       *  设置城市
       */
      setCity(value, selectedData) {
        let temp_this = this
        if (selectedData.length > 0) {
        	selectedData.forEach(item=>{
        		temp_this.allRegion+=item.label;
        	})
        	console.log(temp_this.allRegion)
          this.region = selectedData[selectedData.length - 1].label // 获取选择的行政区划
          // 根据选择的区划设置地图中心点
          this.mymap.useDistrictSearch({
            keyword: this.region,
            callback: function (res) {
              if (res.message == 'ok') {
                let item = res.results[0]
                temp_this.mymap.panTo(item.center, 10)
              }

            }
          })
        }
      },


      /**
       * 搜索选择框选中事件
       */
      onchange() {
        this.sbodyshow = false
        this.mymap.clear()
        if (this.searchSelect) {
          let values = this.searchSelect.split(':')
          let postion = values[0].split(','); // 坐标数组
          let lable = values[1] + ' ' + values[2] // name+address
          this.pointx = postion[0]
          this.pointy = postion[1]
          this.mymap.panTo(postion, 18)
          this.addMarker(postion)
          this.addLable(this.overlay, lable)
        } else {
          this.mymap.setZoom(10)
          this.pointx = '--'
          this.pointy = '--'
        }

      },
      /**
       * 异步加载选择框中的数据
       * @param query 关键字
       */
      remoteMethod(query) {
        if (this.region == '') {
          this.$Message.error('请先选择地区');
          return
        }
        let temp_this = this
        if (query !== '') {
          temp_this.loading = true;
          setTimeout(() => {
            temp_this.loading = false;
            this.mymap.useSuggest({
              keyword: query,
              region: temp_this.region,
              scope: 'all',
              callback: function (res) {
                if (res.message === 'ok' && res.results.length > 0) {
                  let list = [];
                  for (let i = 0; i < res.results.length; i++) {
                    list.push({
                      value: res.results[i].location.join(',') + ':'
                      + res.results[i].name + ':'
                      + res.results[i].address,
                      address: res.results[i].address,
                      label: res.results[i].name
                    })
                  }
                  temp_this.myoptions = list;
                }
              }
            })
          }, 200);
        } else {
          temp_this.myoptions = [];
        }
      },
      /**
       * 点击搜索按钮触发的事件
       *
       */
      searchPage() {
        if (this.region === '') {
          this.$Message.error('请先选择地区');
          return
        }
        let temp_this = this
        let query = document.getElementsByClassName('ivu-select-input')
        if (query.length > 0) {
          this.keyword = query[0].value
        } else {
          return
        }
        // 清除地图中已经展现的数据，恢复默认值
        this.sbodyshow = true
        this.selectflag = false
        this.clickindex = -1

        this.pointx = '--'
        this.pointy = '--'
        this.mymap.clear()
        temp_this.markers = []

        this.mymap.usePoiSearch({
          keyword: temp_this.keyword,
          region: temp_this.region,
          scope: 'all',
          callback: function (res) {
            if (res.message === 'ok' && res.results.length > 0) {
              temp_this.totalum = Number(res.total)
              let list = [];
              let potions = [];
              for (let i = 0; i < res.results.length; i++) {
                list.push({
                  value: res.results[i].location.join(',') + ':'
                  + res.results[i].name + ':'
                  + res.results[i].address,
                  address: res.results[i].address,
                  label: res.results[i].name
                })
                let overlay = temp_this.mymap.addMarker({
                  postion: res.results[i].location,
                  offset: [-(i + 1) * 33, 0],
                  iconurl: 'http://webapi.ishowchina.com/jsmap/3.8.1/images/point_1.png',
                  size: [35, 30],
                  title: res.results[i].name
                })
                potions.push(res.results[i].location)
                // 存储已经添加的覆盖物用于添加响应事件
                temp_this.markers.push(overlay)
              }
              // 给展现的覆盖物添加事件
              temp_this.addMarkerEvent()
              temp_this.sbbdydata = list;
              temp_this.mymap.fit(potions)
            }
          }
        })
      },

      /**
       * 选中搜索执行的操作
       */
      selectItem(value, index) {
        let values = value.split(':')
        let postion = values[0].split(','); // 坐标数组
        let lable = values[1] + ' ' + values[2] // name+address
        this.pointx = postion[0]
        this.pointy = postion[1]
        this.sbodyshow = false
        let query = document.getElementsByClassName('ivu-select-input')
        if (query.length > 0) {
          query[0].value = lable
          this.keyword = lable
        } else {
          return
        }
        // 关闭分页div
        this.sbodyshow = false
        // 删除选中之外的所有点位
        for (let i = 0; i < this.markers.length; i++) {
          if (i != index) {
            this.mymap.clearOverlay(this.markers[i])
          }
        }
        this.addLable(this.markers[index], lable)
        // 放大地图层级
        this.mymap.panTo(postion, 18)
        // 设置已经选中
        this.selectflag = true
        // 设置选中的索引值
        this.clickindex = index
      },
      /**
       *  分页切换
       */
      changePage(value) {
        if (this.region == '选择地区') {
          this.$Message.error('请先选择地区');
          return
        }
        // 清除一些设置，恢复默认值
        let temp_this = this
        this.selectflag = false
        this.clickindex = -1
        this.mymap.clear()
        temp_this.markers = []
        this.pointx = '--'
        this.pointy = '--'

        this.mymap.usePoiSearch({
          keyword: temp_this.keyword,
          region: temp_this.region,
          scope: 'all',
          pageNumber: value,
          callback: function (res) {
            if (res.message === 'ok' && res.results.length > 0) {
              temp_this.totalum = Number(res.total)
              let list = [];
              let potions = [];
              for (let i = 0; i < res.results.length; i++) {
                list.push({
                  value: res.results[i].location.join(',') + ':'
                  + res.results[i].name + ':'
                  + res.results[i].address,
                  address: res.results[i].address,
                  label: res.results[i].name
                })
                let overlay = temp_this.mymap.addMarker({
                  postion: res.results[i].location,
                  offset: [-(i + 1) * 33, 0],
                  iconurl: 'http://webapi.ishowchina.com/jsmap/3.8.1/images/point_1.png',
                  size: [35, 30],
                  title: res.results[i].name
                })
                potions.push(res.results[i].location)
                // 保存已经添加的覆盖物
                temp_this.markers.push(overlay)
              }
              // 给覆盖物绑定事件
              temp_this.addMarkerEvent()
              temp_this.sbbdydata = list;
              temp_this.mymap.fit(potions)
            }
          }
        })
      },
      /**
       * 鼠标悬停在搜索分页列表上触发的事件
       *  悬停项在地图中高亮显示，并显示地址标签，经纬度也跟着变换
       * @param value
       * @param index
       */
      overShow(value, index) {
        // 更改鼠标移入选项的覆盖物的图片，并添加标签
        let new_marker = this.markers[index]
        // 更改覆盖物图片
        this.mymap.changeMarkerIcon(new_marker, {
          offset: [-index * 35, -30],
          iconurl: 'http://webapi.ishowchina.com/jsmap/3.8.1/images/point_1.png',
          size: [35, 40],
        })
        // 设置右下角显示的坐标
        let values = value.split(':')
        let lable = values[1] + ' ' + values[2] // name+address
        let postion = values[0].split(','); // 坐标数组
        this.pointx = postion[0]
        this.pointy = postion[1]
        // 添加标签
        this.addLable(this.markers[index], lable)
      },
      /**
       * 鼠标离开搜索分页列表触发的事件
       * @param value
       * @param index
       */
      overHide(value, index) {
        // 将更改图标的覆盖物恢复原样
        if(!this.selectflag){
          // 恢复
          let old_marker = this.markers[index]
          // 更改图标
          this.mymap.changeMarkerIcon(old_marker, {
            offset: [-(index + 1) * 33, 0],
            iconurl: 'http://webapi.ishowchina.com/jsmap/3.8.1/images/point_1.png',
            size: [35, 30],
          })
          // 删除标签
          this.mymap.removeLable(old_marker)
          // 恢复右下角坐标默认值
          this.pointx = '--'
          this.pointy = '--'
        }
      },
      /**
       *  给覆盖物绑定事件
       */
      addMarkerEvent() {
        // 对每个marker 添加鼠标经过事件以及点击事件
        let temp_this = this
        if (this.markers.length > 0) {
          // 循环绑定时间
          for (let i = 0; i < this.markers.length; i++) {
            let marker = this.markers[i]
            // 绑定鼠标移入事件。当鼠标移入时，更改覆盖物图标，并添加标签
            this.mymap.addOverlayEvent(marker, 'mouse_over', function (evt) {

              if (marker.getLabel() == undefined) { // 本身没有lable
                let lable = temp_this.sbbdydata[i].label + ' ' + temp_this.sbbdydata[i].address
                if (temp_this.clickindex == -1 || temp_this.clickindex == i) {
                  let value = temp_this.sbbdydata[i].value.split(':')
                  let postion = value[0].split(','); // 坐标数组
                  temp_this.pointx = postion[0]
                  temp_this.pointy = postion[1]
                }
                temp_this.addLable(marker, lable)
                temp_this.mymap.changeMarkerIcon(marker, {
                  offset: [-i * 35, -30],
                  iconurl: 'http://webapi.ishowchina.com/jsmap/3.8.1/images/point_1.png',
                  size: [35, 30],
                })
              } else {

              }

            })
            // 绑定鼠标移出事件。当鼠标移出时，恢复覆盖物图标，并删除已经添加的标签
            this.mymap.addOverlayEvent(marker, 'mouse_out', function (evt) {

              if (marker.getLabel() == undefined || temp_this.clickindex == i) { // 本身没有lable
              } else {
                temp_this.mymap.removeLable(marker)
                temp_this.mymap.changeMarkerIcon(marker, {
                  offset: [-(i + 1) * 33, 0],
                  iconurl: 'http://webapi.ishowchina.com/jsmap/3.8.1/images/point_1.png',
                  size: [35, 30],
                })
                if (temp_this.clickindex == -1) {
                  temp_this.pointx = '--'
                  temp_this.pointy = '--'
                }
              }
            })
            // 绑定鼠标点击事件
            this.mymap.addOverlayEvent(marker, 'click', function (evt) {
              //关闭分页div
              temp_this.sbodyshow = false
              // 删除上一个被点击的覆盖物标签
              if (temp_this.clickindex != -1 && temp_this.clickindex != i) {
                temp_this.mymap.removeLable(temp_this.markers[temp_this.clickindex])
              }
              if (marker.getLabel() == undefined) { // 本身没有lable

              } else {
                temp_this.clickindex = i
                //清除非选中的覆盖物
                for(let j=0;j<temp_this.markers.length;j++){
                  if(j!=i){
                    temp_this.mymap.clearOverlay(temp_this.markers[j])
                  }
                }
                // 设置搜索框中的内容以及右下角的坐标值
                let query = document.getElementsByClassName('ivu-select-input')
                if (query.length > 0) {
                  let lable = temp_this.sbbdydata[i].label + ' ' + temp_this.sbbdydata[i].address
                  query[0].value = lable
                }
              }
            })
          }
        }
      }
    }
  }


</script>
<style>
  #mapDiv {
    width: 100%;
    height: 400px;
    margin: 0px;
    padding: 0px;
  }

  #map {
    height: 100%;
    width: 100%;
  }

  #searchDiv {
    position: absolute;
    left: 28px;
    top: 75px;
    width: 500px;
    z-index: 1000
  }

  #drawBtn {
    position: absolute;
    float: right;
    right: 20px;
    bottom: 120px;
    z-index: 1000;
  }

  #searchBtn {
    left: 422px;
    position: absolute;
  }

  .cityCascader {
    position: absolute;
    float: left;
    width: 150px;
  }

  #searchSelect {
    position: relative;
    left: 156px;
  }

  .search-body-box {
    position: absolute;
    left: 20px;
    top: 110px;
    width: 400px;
    height: 250px;
    background-color: #fff;
    z-index: 410
  }

  .search-body-box .search-body-ul {
    list-style: none;
    overflow: hidden;
    height: 85%;
    position: relative;
    overflow-y: scroll;
  }

  .search-body-box .search-body-ul li {
    position: relative;
    border-top: 1px solid #eaeaea;
    padding: 10px 0;
    cursor: pointer;
    overflow: hidden;
  }

  .search-body-box .search-body-ul li .search-res {
    max-width: 320px;
    padding-left: 8px;
  }

  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  .search-body-box .search-body-ul::-webkit-scrollbar {
    width: 5px;
    height: 16px;
    background-color: #F5F5F5;
  }

  /*定义滚动条轨道 内阴影+圆角*/
  .search-body-box .search-body-ul::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #F5F5F5;
  }

  /*定义滑块 内阴影+圆角*/
  .search-body-box .search-body-ul::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
    background-color: #555;
  }

  .postion-box {
    bottom: 82px;
    background-color: #F2F2F2;
    width: 420px;
    position: absolute;
    float: right;
    right: 20px;
    z-index: 1000;
    height: 30px;
  }

  .postion-box span {
    width: 20%;
    text-align: center;
    font-weight: bold;
    position: relative;
    float: left;
    line-height: 30px;
    font-size: 16px;
  }

</style>
