<style lang="less" scoped>
  /* 修复表格转换pdf时的样式问题 */
  table, tr, td, th, tbody, thead, tfoot {
    page-break-inside: avoid !important;
  }
  #tableone, #tabletwo, #tablethree, #tablefour, #tablefive{
      padding: 20px 30px 30px 30px;
      background: #fff;
      width: 660px;
  }

//   所有的table的title
  .tablealltitle{
    width: 100%;
    margin: 0px auto;
    text-align: center;
    height: 70px;
    line-height: 70px;
    font-size: 24px;
    font-weight: bold;
  }
table{
    word-wrap: break-word;
word-break: break-all;
}
.maincon{
    padding: 20px;
}
.tableonecon{
    width: 600px;
    margin: 0 auto;
}
  .tableone{
        width:600px;
        background: #fff;
        margin: 0 auto;
        .tableonetitle{
            height: 60px;
            line-height: 60px;
            font-size: 20px;
            text-align: center;
            font-weight: bold;
        } 
        .trtwo{
            height: 40px;
            line-height: 40px;
            td{
                text-align: center;
            }
        }
        .trthree{
            height: 40px;
            line-height: 40px;
        }
        // 表格编号证物编号
        .list{
            height: 40px;
            line-height: 40px;
            td{
                text-align: center;
            }
        }
        .last{
            td{
                position: relative;
                :nth-child(2){
                    position: absolute;
                    right: 70px;
                }
                :nth-child(3){
                    position: absolute;
                    right: 150px;
                    bottom: 10px;
                }
            }
        }
        
         
    }
    .tabletwocon{
        width: 600px;
        margin: 0 auto;
    }
    .tabletwo{
        width: 600px;
        background: #fff;
        margin:0 auto;
        tr{
            td{
                height: 40px;
                line-height: 40px;
                text-align: center;
            }
        }
        .tabletwotitle{
             height: 60px;
            line-height: 60px;
            font-size: 20px;
            text-align: center;
            font-weight: bold;
        }
        .trsone{
            height: 80px;
            td{
                line-height: 60px;
                height: 60px;
            }
        }
        .trtwocon {
            height: 150px;
            td{
                height: 150px;
               
            }
        }
    }

    // table4
    .tablefourcom{
        height: 88px;
        td{
            span{
                    display: block;
                padding: 0 20px;
                line-height: 25px;
            }
        }
    }
    // table5 表头
    .tablefivhead{
        padding: 0 120px;
        padding-top: 20px;
        p{
            font-weight: bold;
            font-size: 15px;
            line-height: 30px;
            :nth-child(2){
                padding-left: 150px;
            }
            
        }
    }
    .tablefivdata{
        // height: 24px;
        line-height: 24px;
        font-size: 15px;
        padding: 6px 8px 12px 8px;
        display: block;
        position: relative;
        :nth-child(2){
            position: absolute;
            right: 8px;

        }
    }
  
</style>
<template>
<div class="maincon">
   <!-- table1 -->
    <p v-show="wzListbox" style="width:660px;position:relative;margin:0 auto"> <button type="button" class="ivu-btn ivu-btn-primary" style="position: absolute; right:1px;top:30px;"  @click="getPdf('tableone','电子数据勘察委托书')"><span>导出表单</span></button></p>
    <div  v-show="wzListbox"  class="tableonecon" id="tableone" style="margin-top:85px;">
        <p class="tablealltitle">电子数据勘察委托书</p>
        <table class="tableone" border="1" cellpadding="0" cellspacing="0" style="table-layout: fixed;" v-if="dzcclist">
            <tbody>
                 
                <tr class="trtwo">
                    <td colspan="16">委托单位</td>
                    <td colspan="18"></td>
                    <td colspan="15">委托时间</td>
                    <td colspan="18"></td>
                </tr>
                <tr class="trtwo">
                    <td colspan="16">联系人</td>
                    <td colspan="18"></td>
                    <td colspan="15">联系电话</td>
                    <td colspan="18"></td>
                </tr>
                <tr class="trthree">
                    <td colspan="16" style="text-align: center;">受托单位</td>
                    <td colspan="51"></td>
                </tr>
                <tr class="trtwo">
                    <td colspan="16" style="text-align: center;">案件编号*</td>
                    <td colspan="18">{{ajbh}}</td>
                    <td colspan="15" style="text-align: center;">案件名称*</td>
                    <td colspan="18">{{ajmc}}</td>
                </tr>
                <tr>
                    <td colspan="67" style="padding-bottom:100px;"><span style="padding-left:20px;display:block">简要案（事）情*：<br>{{qbmain}}</span></td>
                </tr>
                    
                <tr class="list" >
                    <td colspan="7" class="xhTh">序号</td>
                    <td class="contentTh" v-for="(thItem,thIndex) in dzcclist[0].children"  :key="thIndex" :colspan="60/dzcclist[0].children.length">{{thItem.mbmc}}</td>
                </tr>
                <tr class="list" v-for="(item,index) in dzcclist[0].children[0].data" :key="index">
                    <td colspan="7" class="xhTh">{{index+1}}</td>
                    <td class="contentTh" v-for="(thItem2,thIndex2) in dzcclist[0].children" :title="thItem2.data[index].value" :colspan="60/dzcclist[0].children.length" :key="thIndex2">
                        {{thItem2.data[index].value}}
                    </td>
                </tr>
                <tr class="list">
                    <td colspan="7"></td>
                     <td colspan="20"></td> 
                     <td colspan="20"></td> 
                     <td colspan="20"></td>
                </tr>
                 <tr class="list">
                    <td colspan="7"></td>
                     <td colspan="20"></td> 
                     <td colspan="20"></td> 
                     <td colspan="20"></td>
                </tr> 
               
                <tr>
                    <td colspan="67" style="padding-bottom:65px"><span>委托要求：</span></td>
                </tr>
                    <tr class="last">
                    <td colspan="67" style="padding-bottom:65px">
                        <p>委托单位负责人意见：</p>
                        <p>（负责人盖章或签字、单位盖章）</p>
                        <span>年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日 </span>
                    </td>
                </tr>
           </tbody>
        </table>
        <table class="tableone" border="1" cellpadding="0" cellspacing="0" style="table-layout: fixed;" v-else>
            <tbody>
                 
                <tr class="trtwo">
                    <td colspan="16">委托单位</td>
                    <td colspan="18"></td>
                    <td colspan="15">委托时间</td>
                    <td colspan="18"></td>
                </tr>
                <tr class="trtwo">
                    <td colspan="16">联系人</td>
                    <td colspan="18"></td>
                    <td colspan="15">联系电话</td>
                    <td colspan="18"></td>
                </tr>
                <tr class="trthree">
                    <td colspan="16" style="text-align: center;">受托单位</td>
                    <td colspan="51"></td>
                </tr>
                <tr class="trtwo">
                    <td colspan="16" style="text-align: center;">案件编号*</td>
                    <td colspan="18">{{ajbh}}</td>
                    <td colspan="15" style="text-align: center;">案件名称*</td>
                    <td colspan="18">{{ajmc}}</td>
                </tr>
                <tr>
                    <td colspan="67" style="padding-bottom:100px;"><span style="padding-left:20px;display:block">简要案（事）情*：<br>{{qbmain}}</span></td>
                </tr>
                    
                <tr class="list" >
                    <td colspan="7" class="xhTh">序号</td>
                    <td colspan="20">证物*</td>
                    <td colspan="20">型号</td>
                    <td colspan="20">持有人身份信息*</td>
                </tr>
                <tr class="list">
                    <td colspan="7" class="xhTh"></td>
                    <td colspan="20"></td>
                    <td colspan="20"></td>
                    <td colspan="20"></td>
                </tr>
                 <tr class="list">
                    <td colspan="7" class="xhTh"></td>
                    <td colspan="20"></td>
                    <td colspan="20"></td>
                    <td colspan="20"></td>
                </tr> <tr class="list">
                    <td colspan="7" class="xhTh"></td>
                    <td colspan="20"></td>
                    <td colspan="20"></td>
                    <td colspan="20"></td>
                </tr>
                <tr>
                    <td colspan="67" style="padding-bottom:65px"><span>委托要求：</span></td>
                </tr>
                    <tr class="last">
                    <td colspan="67" style="padding-bottom:65px">
                        <p>委托单位负责人意见：</p>
                        <p>（负责人盖章或签字、单位盖章）</p>
                         <span>年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日 </span>

                    </td>
                </tr>
           </tbody>
       </table>
       <p style="height: 45px;line-height: 45px;">注：根据市局网警支队要求，带*号为必填项（未立案的填写事件名称）。</p>
   </div>
    <!-- table2 -->
    <p v-if="qbList" style="width:660px;position:relative;margin:0 auto"> <button type="button" class="ivu-btn ivu-btn-primary" style="position: absolute; right:1px;top:30px;"  @click="getPdf('tabletwo','提请公安机关情报侦察部门数据查询审批表')"><span>导出表单</span></button></p>
    <div class="tabletwocon" style="margin-top:80px" id="tabletwo" v-if="qbList">
        <p class="tablealltitle"> 提请公安机关情报侦察部门数据查询审批表</p>
         <p class="tabletwodata" style="height:40px;line-height:40px;position: relative;">
            <span style="position: absolute;right:8px;"> 填表时间：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日  </span>
        </p>
        <table class="tabletwo" border="1" cellpadding="0" cellspacing="0" style="table-layout: fixed;" v-if="list">
            <tbody>
                    <tr class="trtwo">
                        <td  colspan="16">提请单位</td>
                        <td  colspan="18"></td>
                        <td  colspan="15">提请人</td>
                        <td  colspan="18" ></td>
                    </tr>
                    <tr class="trtwo">
                        <td  colspan="16">联系电话 </td>
                        <td  colspan="18"></td>
                        <td  colspan="15">反馈方式</td>
                        <td  colspan="18"></td>
                    </tr>
                    <tr class="">
                        <td colspan="7" style="height:100px;"><span style="letter-spacing: 2px;align-items: center;text-align: center;writing-mode: vertical-lr;display: inline-block;vertical-align: middle;margin-left:-10px">查询事由</span></td>
                        <td colspan="60" style="text-align: left;"><span style="text-align: left;line-height: 24px;padding-left:5px;display:block">{{qbmain}}</span></td>
                    </tr>
                    <tr>
                        <td  colspan="7" :rowspan="list[0].children[0].data.length+1" style="text-align: center;"><span style="align-items: center;text-align: center;vertical-align: middle;">查询内容</span></td>
                        <td class="contentTh" v-for="(thItem,thIndex) in list[0].children"  :key="thIndex" :colspan="60/list[0].children.length">{{thItem.mbmc}}</td>
                    </tr>
                    <tr  v-for="(item,index) in list[0].children[0].data" :key="index">
                        <td class="contentTh" v-for="(thItem2,thIndex2) in list[0].children" :title="thItem2.data[index].value" :colspan="60/list[0].children.length" :key="thIndex2">
                            {{thItem2.data[index].value}}
                        </td>
                    </tr>
                
                    
                    <tr class="tr">
                        <td colspan="67">以上共&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;个查询目标（大写）</td>
                    </tr>
                    <tr class="trtwocon"  style="120px;">
                        <td  colspan="7"  ><span style="align-items: center;text-align: center;writing-mode: vertical-lr;display: inline-block;vertical-align: middle; margin-left:-10px">审核意见</span></td>
                        <td colspan="26" style="position: relative;"><span style=" position: absolute;right:30px;bottom:15px;">年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日</span></td>
                        <td  colspan="7" ><span style="align-items: center;text-align: center;writing-mode: vertical-lr;display: inline-block;vertical-align: middle;">审批意见</span></td>
                        <td colspan="27" style="position: relative;"><span style="position: absolute;right: 20px;line-height:24px">（ 单  位  印 )</span><span style=" position: absolute;right:20px;bottom:15px;">年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日</span></td>
                    </tr>
                
                    <tr style="height:60px;">
                        <td colspan="7" ><span style="align-items: center;text-align: center;writing-mode: vertical-lr;display: inline-block;vertical-align: middle; margin-left:-10px">备注</span></td>
                        <td colspan="60"></td>
                    </tr>
                
                    
            </tbody>
        </table>
        <table class="tabletwo" border="1" cellpadding="0" cellspacing="0" style="table-layout: fixed;" v-else>
            <tbody>
                    <tr class="trtwo">
                        <td  colspan="3" style="width:10%">提请单位</td>
                        <td  colspan="6" style="width:50%"></td>
                        <td  colspan="4" style="width:15%">提请人</td>
                        <td  colspan="3" style="width:25%"></td>
                    </tr>
                    <tr class="trtwo">
                        <td  colspan="3" style="width:10%">联系电话 </td>
                        <td  colspan="6" style="width:50%"></td>
                        <td  colspan="4" style="width:15%">反馈方式</td>
                        <td  colspan="3" style="width:25%"></td>
                    </tr>
                    <tr class="">
                        <td style="height:100px;"><span style="letter-spacing: 2px;align-items: center;text-align: center;writing-mode: vertical-lr;display: inline-block;vertical-align: middle;margin-left:-10px">查询事由</span></td>
                        <td colspan="15" style="text-align: left;"><span style="text-align: left;line-height: 24px;padding-left:5px;display:block">{{qbmain}}</span></td>
                    </tr>
                    <tr class="trsone" style="height：40px">
                        <td  colspan="1" rowspan="5" style="text-align: center;"><span style="align-items: center;text-align: center;writing-mode: vertical-lr;display: inline-block;vertical-align: middle;margin-left:-20px">查询内容</span></td>
                        <td  colspan="7"> 查询目标</td>
                        <td colspan="3" style="text-align: center;">查询数据类型</td>
                        <td colspan="5">查询时间范围</td>
                    </tr>
                    <tr class="tr">
                        <td  colspan="7"> </td>
                        <td colspan="3" style="text-align: center;"></td>
                        <td colspan="5"></td>
                    </tr>
                    <tr class="tr">
                        <td  colspan="7"> </td>
                        <td colspan="3" style="text-align: center;"></td>
                        <td colspan="5"></td>
                    </tr><tr class="tr">
                        <td  colspan="7"> </td>
                        <td colspan="3" style="text-align: center;"></td>
                        <td colspan="5"></td>
                    </tr><tr class="tr">
                        <td  colspan="7"> </td>
                        <td colspan="3" style="text-align: center;"></td>
                        <td colspan="5"></td>
                    </tr>
                    <tr class="tr">
                        <td colspan="16">以上共&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;个查询目标（大写）</td>
                    </tr>
                    <tr class="trtwocon"  style="120px;">
                        <td  colspan="1"  ><span style="align-items: center;text-align: center;writing-mode: vertical-lr;display: inline-block;vertical-align: middle; margin-left:-10px">审核意见</span></td>
                        <td colspan="8" style="position: relative;"><span style=" position: absolute;right:30px;bottom:15px;">年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日</span></td>
                        <td  colspan="2" ><span style="align-items: center;text-align: center;writing-mode: vertical-lr;display: inline-block;vertical-align: middle;">审批意见</span></td>
                        <td colspan="5" style="position: relative;"><span style="position: absolute;right: 20px;line-height:24px">（ 单  位  印 )</span><span style=" position: absolute;right:20px;bottom:15px;">年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日</span></td>

                        <!-- <td colspan="5" style="position: relative;"><span style=" position: absolute;right:20px;bottom:15px;">年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日</span></td> -->

                    </tr>
                
                    <tr>
                        <td colspan="1" >备注</td>
                        <td colspan="15"></td>
                    </tr>
                
                    
            </tbody>
        </table>
         <p style="padding-top:15px">说明：</p>
         <p>查询时间范围： 填写具体日期，如2017.1.1-2017.7.1（若只查询机主资料此栏填“无”）</p>
         <p>审核意见由部门负责人签字，审批意见由局领导签字，后连同受案登记表、立案决定书原件（或复印件）、号码来源佐证材料一齐交技术侦查中心。</p>
   </div>
    <!-- table3 -->
    <p  v-show="wzListbox" style="width:660px;position:relative;margin:0 auto"> <button type="button" class="ivu-btn ivu-btn-primary" style="position: absolute; right:1px;top:30px;"  @click="getPdf('tablethree','呈请采取技术侦查措施报告书')"><span>导出表单</span></button></p>
   
    <div  v-show="wzListbox" class="tabletwocon" id="tablethree" style="margin-top:80px">
        <div class="tablefivhead" style="padding：0 103px;">
            <p><span>密级：</span><span>表格编号：</span></p>
            <p>期限：</p>
        </div>
       <p class="tablealltitle">呈请采取技术侦查措施报告书</p>
        <p class="tablefivdata">
            <span>填表单位：</span>
            <span> 填表日期：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日  </span>
        </p>
       <table class="tabletwo" border="1" cellpadding="0" cellspacing="0" style="table-layout: fixed;">
        <tbody>
                 <tr class="trtwo">
                     <td  colspan="15">案件名称* </td>
                     <td  colspan="61">{{ajmc}}</td>
                 </tr>
                  <tr class="trtwo">
                     <td  colspan="15">案件编号 </td>
                     <td  colspan="23">{{ajbh}}</td>
                     <td  colspan="15">案件类别*</td>
                     <td  colspan="23"></td>
                 </tr>
                  <tr class="">
                     <td colspan="15" style="">案件性质*</td>
                     <td colspan="61"><span style="text-alineg"></span></td>
                 </tr>
                 <tr class="">
                     <td colspan="32">立案决定书/逮捕证/通缉令文号*</td>
                     <td colspan="44"><span style="text-alineg"></span></td>
                 </tr>
                 <tr class="">
                     <td  colspan="15">交案人*</td>
                     <td  colspan="23"></td>
                     <td  colspan="15">联系方式*</td>
                     <td  colspan="23"></td>
                 </tr>
                  <tr class="tr jbqk" style="height:150px;">
                     <td  colspan="15" >基本情况*</td>
                     <td  colspan="61">{{qbmain}}</td>
                 </tr>
                  <tr class="tr jbqk" style="height:210px;">
                     <td  colspan="15" ><span style="padding:0 5px;display: block;line-height: 28px;">已经采取的侦查措施情况及采取技术侦查措施的必要性说明*</span></td>
                     <td  colspan="61"> </td>
                 </tr>
                 <tr class="tr jbqk" style="height:120px;">
                     <td  colspan="15" >备注</td>
                     <td  colspan="61"> </td>
                 </tr>
        </tbody>
       </table>
       <!-- 序号分页table if-->
       <table class="tabletwo" border="1" cellpadding="0" cellspacing="0" style="table-layout: fixed; margin-top:90px;"  v-if="wzjsxclist">        
            <tbody>   
                <tr class="list" v-if="wzjsxclist">
                    <td v-if="wzjsxclist[0].children.length" colspan="9" :rowspan="wzjsxclist[0].children[0].data.length+1" style="width:70px;"><span>采取技术侦查措施适用对象情况*</span></td>
                    <td colspan="7" class="xhTh">序号</td>
                    <td class="contentTh" v-for="(thItem,thIndex) in wzjsxclist[0].children"  :key="thIndex" :colspan="60/wzjsxclist[0].children.length">{{thItem.mbmc}}</td>
                </tr>
                <tr class="list" v-for="(item,index) in wzjsxclist[0].children[0].data" :key="index">
                    <td colspan="7" class="xhTh">{{index+1}}</td>
                    <td class="contentTh" v-for="(thItem2,thIndex2) in wzjsxclist[0].children" :title="thItem2.data[index].value" :colspan="60/wzjsxclist[0].children.length" :key="thIndex2">
                        {{thItem2.data[index].value}}
                    </td>
                </tr>                 
               
                 <tr class="tr">
                     <td  colspan="76" ><span style="line-height: 25px;display: inline-block;padding: 10px;">根据《中华人民共和国刑事诉讼法》第一百四十八条、第一百四十九条之规定，呈请对以上共__个适用对象，共_个侦控目标采取技术侦查措施。</span></td>
                 </tr>
                <tr style="height:100px;">
                     <td colspan="9">交案单位意见*</td>
                     <td colspan="29"></td>
                     <td colspan="9">网安业务部门意见*</td>
                    <td colspan="29"></td>
                    
                 </tr>
                 <tr style="height:100px;">
                     <td colspan="9">网安法制审核意见*</td>
                     <td colspan="29"></td>
                     <td colspan="9">网安部门意见*</td>
                     <td colspan="29"></td>
                 </tr>
                  <tr style="height:120px;">
                     <td colspan="9">公安机关意见*</td>
                    <td colspan="67"></td>
                 </tr>
         </tbody>
       </table>
       <!-- 序号分页table else-->
       <table class="tabletwo" border="1" cellpadding="0" cellspacing="0" style="table-layout: fixed; margin-top:80px;" v-else>        
            <tbody>   
                 <tr class="list">
                    <td style="" colspan="9" rowspan="4"><span>采取技术侦查措施适用对象情况*</span></td>
                    <td colspan="8" class="xhTh">序号</td>
                    <td colspan="25" class="xhTh">查询姓名</td> 
                    <td colspan="25" class="xhTh">侦控目标</td>
                </tr>
                <tr class="list">
                    <td colspan="8" class="xhTh"></td>
                    <td colspan="25" class="xhTh"></td> 
                    <td colspan="25" class="xhTh"></td>
                </tr>       
                  <tr class="list">
                   <td colspan="8" class="xhTh"></td>
                    <td colspan="25" class="xhTh"></td> 
                    <td colspan="25" class="xhTh"></td>
                </tr>                  
                <tr class="list">
                   <td colspan="8" class="xhTh"></td>
                    <td colspan="25" class="xhTh"></td> 
                    <td colspan="25" class="xhTh"></td>
                </tr>       
               
                 <tr class="tr">
                     <td  colspan="67" ><span style="line-height: 25px;display: inline-block;padding: 10px;">根据《中华人民共和国刑事诉讼法》第一百四十八条、第一百四十九条之规定，呈请对以上共__个适用对象，共_个侦控目标采取技术侦查措施。</span></td>
                 </tr>
                <tr style="height:100px;">
                     <td colspan="7">交案单位意见*</td>
                     <td colspan="26"></td>
                     <td colspan="7">网安业务部门意见*</td>
                    <td colspan="27"></td>
                    
                 </tr>
                 <tr style="height:100px;">
                     <td colspan="7">网安法制审核意见*</td>
                     <td colspan="26"></td>
                     <td colspan="7">网安部门意见*</td>
                     <td colspan="27"></td>
                 </tr>
                  <tr style="height:120px;">
                     <td colspan="7">公安机关意见*</td>
                    <td colspan="60"></td>
                 </tr>
         </tbody>
       </table>
   </div>
   <!-- table4 -->
     <p  v-show="sjcxlist" style="width:660px;position:relative;margin:0 auto"> <button type="button" class="ivu-btn ivu-btn-primary" style="position: absolute; right:1px;top:30px;"  @click="getPdf('tablefour','巴彦淖尔市网警数据资源使用审批表')"><span>导出表单</span></button></p>
     <div v-show="sjcxlist"  class="tabletwocon" id="tablefour" style="margin-top:80px">
       <p class="tablealltitle">巴彦淖尔市网警数据资源使用审批表</p>
       <table class="tabletwo" border="1" cellpadding="0" cellspacing="0" style="table-layout: fixed;" v-if="sjcxlist">
             <tbody>
                 <tr class="trtwo">
                     <td  colspan="3">交办单位</td>
                     <td  colspan="4" ></td>
                      <td  colspan="3">交办时间</td>
                     <td  colspan="4" ></td>
                 </tr>
                  <tr class="trtwo">
                     <td  colspan="3" >联系人 </td>
                     <td  colspan="4" ></td>
                     <td  colspan="3" >联系方式</td>
                     <td  colspan="4" ></td>
                 </tr>
                  <tr class="tablefourcom">
                     <td colspan="3" style="height:80px;"><span>使用事由（简要案情)</span></td>
                     <td colspan="11">{{qbmain}}</td>
                 </tr>
                  <tr class="tablefourcom" >
                     <td colspan="3" style="height:80px;"><span>查询线索及网侦目的</span></td>
                     <td colspan="11">{{sjcxlist[0].data[0].value}}</td>
                 </tr>
                 <tr class="tablefourcom" style="height:120px">
                     <td  colspan="3" ><span>交办单位意见</span></td>
                     <td  colspan="4" ></td>
                     <td  colspan="3" ><span>区县级公安机关（市局机关部门）审批意见</span></td>
                     <td  colspan="4" ></td>
                 </tr>
                 <tr class="tablefourcom" style="height:120px">
                     <td  colspan="3" ><span>市级网警部门意见</span></td>
                     <td  colspan="4" ></td>
                     <td  colspan="3" ><span>市级公安机关（省级网警部门）审批意见</span></td>
                     <td  colspan="4" ></td>
                 </tr>
                  <tr class="" style="height:80px;">
                     <td  colspan="3" >承办结果</td>
                     <td  colspan="11" ></td>
                 </tr>
                 <tr class="tr">
                     <td  colspan="3" >承办人</td>
                     <td  colspan="4"> </td>
                     <td  colspan="3" >办结时间</td>
                     <td  colspan="4"> </td>
                 </tr>
         </tbody>
       </table>
       <table class="tabletwo" border="1" cellpadding="0" cellspacing="0" style="table-layout: fixed;" v-else>
            <tbody>
                 <tr class="trtwo">
                     <td  colspan="3">交办单位</td>
                     <td  colspan="4" ></td>
                      <td  colspan="3">交办时间</td>
                     <td  colspan="4" ></td>

                 </tr>
                  <tr class="trtwo">
                     <td  colspan="3" >联系人 </td>
                     <td  colspan="4" ></td>
                     <td  colspan="3" >联系方式</td>
                     <td  colspan="4" ></td>
                 </tr>
                  <tr class="tablefourcom">
                     <td colspan="3" style="height:80px;"><span>使用事由（简要案情)</span></td>
                     <td colspan="11">{{qbmain}}</td>
                 </tr>
                  <tr class="tablefourcom" v-if="sjcxlist" >
                     <td colspan="3" style="height:80px;"><span>查询线索及网侦目的</span></td>
                     <td colspan="11">{{sjcxlist[0].data[0].value}}</td>
                 </tr>
                 <tr class="tablefourcom" style="height:120px">
                     <td  colspan="3" ><span>交办单位意见</span></td>
                     <td  colspan="4" ></td>
                     <td  colspan="3" ><span>区县级公安机关（市局机关部门）审批意见</span></td>
                     <td  colspan="4" ></td>
                 </tr>
                 <tr class="tablefourcom" style="height:120px">
                     <td  colspan="3" ><span>市级网警部门意见</span></td>
                     <td  colspan="4" ></td>
                     <td  colspan="3" ><span>市级公安机关（省级网警部门）审批意见</span></td>
                     <td  colspan="4" ></td>
                 </tr>
                  <tr class="" style="height:80px;">
                     <td  colspan="3" >承办结果</td>
                     <td  colspan="11" ></td>
                 </tr>
                 <tr class="tr">
                     <td  colspan="3" >承办人</td>
                     <td  colspan="4"> </td>
                     <td  colspan="3" >办理时间</td>
                     <td  colspan="4"> </td>
                 </tr>
            </tbody>
        </table>
   </div>
   <!-- table5 -->
    <p  v-show="wzListbox" style="width:660px;position:relative;margin:0 auto"> <button type="button" class="ivu-btn ivu-btn-primary" style="position: absolute; right:1px;top:30px;"  @click="getPdf('tablefive','呈请采取网络信息查询监控措施报告书')"><span>导出表单</span></button></p>
   <div  v-show="wzListbox" class="tabletwocon" id="tablefive" style="margin-top:80px;" >
        <div class="tablefivhead">
            <p><span>密级：</span><span>表格编号：</span></p>
            <p>期限：</p>
        </div>
        <p class="tablealltitle" style="height:50px;line-height:50px">呈请采取网络信息查询监控措施报告书</p>
        <p class="tablefivdata">
            <span>填表单位：</span>
            <span> 填表日期：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日  </span>
        </p>
        <table class="tabletwo" border="1" cellpadding="0" cellspacing="0" style="table-layout: fixed;">
            <tbody>
                 <tr class="">
                     <td colspan="10">案事件名称* </td>
                     <td colspan="57">{{ajmc}}</td>
                 </tr>
                  <tr class="">
                    <td colspan="10">案事件类别*</td>
                    <td colspan="57"></td>
                 </tr>
                 <tr class="">
                     <td  colspan="10">文书号*</td>
                     <td  colspan="57"></td>
                 </tr>
                  <tr class="">
                     <td  colspan="10">承办人*</td>
                     <td  colspan="24"></td>
                     <td  colspan="10">联系方式*</td>
                     <td  colspan="23"></td>
                 </tr>
                 <tr class="">
                     <td colspan="7" style="height:125px;"><span style="letter-spacing: 2px;align-items: center;text-align: center;writing-mode: vertical-lr;display: inline-block;vertical-align: middle;margin-left:-4px">基本情况&nbsp;*</span></td>
                     <td colspan="60"><span style="text-alineg">{{qbmain}}</span></td>
                 </tr>
                   <tr class="">
                     <td  colspan="7" style="height:125px;"><span style="letter-spacing: 2px;align-items: center;text-align: center;writing-mode: vertical-lr;display: inline-block;vertical-align: middle;margin-left:-4px">使用资源&nbsp;*</span></td>
                     <td colspan="60"><span style="text-alineg"></span></td>
                 </tr>
                   <tr class="">
                     <td  colspan="7" style="height:125px;"><span style="letter-spacing: 2px;align-items: center;text-align: center;writing-mode: vertical-lr;display: inline-block;vertical-align: middle;margin-left:-4px">使用目的&nbsp;*</span></td>
                     <td colspan="60"><span style="text-alineg"></span></td>
                 </tr>
                   <tr class="">
                     <td colspan="7" style="height:175px;"><span style="letter-spacing: 2px;align-items: center;text-align: center;writing-mode: vertical-lr;display: inline-block;vertical-align: middle;margin-left:-4px">备注</span></td>
                     <td colspan="60"><span style="text-alineg"></span></td>
                 </tr>
          </tbody>
        </table>
        <!-- table5分页判断if -->
        <table class="tabletwo" border="1" cellpadding="0" cellspacing="0" style="table-layout: fixed;margin-top:80px" v-if="wzxxlist">
            <tbody>
                <tr class="tr">
                    <td colspan="7" class="xhTh">序号</td>
                    <td class="contentTh" v-for="(thItem,thIndex) in wzxxlist[0].children"  :key="thIndex" :colspan="60/wzxxlist[0].children.length">{{thItem.mbmc}}</td>
                </tr>
                <tr class="tr" v-for="(item,index) in dzcclist[0].children[0].data" :key="index">
                    <td colspan="7" class="xhTh">{{index+1}}</td>
                    <td class="contentTh" v-for="(thItem2,thIndex2) in wzxxlist[0].children" :title="thItem2.data[index].value" :colspan="60/wzxxlist[0].children.length" :key="thIndex2">
                        {{thItem2.data[index].value}}
                    </td>
                </tr>
                <tr>
                    <td  colspan="7"></td>
                    <td  colspan="15"></td>
                    <td  colspan="15"></td>
                    <td  colspan="15"></td>
                    <td  colspan="15"></td>
                </tr>
                 <tr>
                    <td  colspan="7"></td>
                    <td  colspan="15"></td>
                    <td  colspan="15"></td>
                    <td  colspan="15"></td>
                    <td  colspan="15"></td>
                </tr> 
                 <tr class="tr">
                     <td colspan="67" ><span>*申请对上述__个对象、__个目标、__个特定信息采取网络信息查询监控。</span></td> 
                 </tr>
                  <tr class="tr">
                     <td  colspan="67" ><span>采取网络信息查询监控措施的方式</span></td> 
                 </tr>
                 <tr class="tr">
                   <td colspan="34" ><span><input name="" type="checkbox"  disabled="disabled" value="" style="margin-right: 6px;margin-top: -2px;vertical-align: middle;padding-right:5px;" /></span><span>手动查询</span></td> 
                    <td colspan="33" ><span style="margin-left：-30px">查询时间：&nbsp;&nbsp; &nbsp;年&nbsp;&nbsp; &nbsp;月 &nbsp;&nbsp; &nbsp; 日至  &nbsp;&nbsp; &nbsp;年 &nbsp;&nbsp; &nbsp; 月 &nbsp;&nbsp;&nbsp;日</span></td> 
                 </tr>
                   <tr class="tr">
                   <td colspan="34" ><span><input name="" type="checkbox"  disabled="disabled" value="" style="margin-right: 6px;margin-top: -2px;vertical-align: middle;padding-right:5px;" /></span><span>自动监控</span></td> 
                    <td colspan="33" ><span style="margin-left：-30px">监控期限：&nbsp;&nbsp; &nbsp;年&nbsp;&nbsp; &nbsp;月 &nbsp;&nbsp; &nbsp; 日至  &nbsp;&nbsp; &nbsp;年 &nbsp;&nbsp; &nbsp; 月 &nbsp;&nbsp;&nbsp;日</span></td> 
                 </tr>
                  <tr class="trtwocon"  style="120px;">
                    <td colspan="7" style="height:125px;"><span style="letter-spacing: 2px;align-items: center;text-align: center;writing-mode: vertical-lr;display: inline-block;vertical-align: middle;margin-left:-4px">提请单位意见&nbsp;*</span></td>
                     <td colspan="27" style="position: relative;"><span style=" position: absolute;right:30px;bottom:15px;"></span></td>
                     <td colspan="7" style="height:125px;"><span style="letter-spacing: 2px;align-items: center;text-align: center;writing-mode: vertical-lr;display: inline-block;vertical-align: middle;margin-left:-4px">网安部门意见&nbsp;*</span></td>
                     <td colspan="26" style="position: relative;"><span style=" position: absolute;right:20px;bottom:15px;"></span></td>
                 </tr>
                  <tr class="trtwocon"  style="120px;">
                     <td  colspan="7"  ><span style="align-items: center;text-align: center;writing-mode: vertical-lr;display: inline-block;vertical-align: middle;margin-left:-4px">公安机关意见</span></td>
                     <td colspan="60" style="position: relative;"><span style=" position: absolute;right:30px;bottom:15px;"></span></td>
                 </tr>
         </tbody>
        </table>
         <!-- table5分页判断else -->
        <table class="tabletwo" border="1" cellpadding="0" cellspacing="0" style="table-layout: fixed;margin-top:80px" v-else>
            <tbody>
                <tr >
                    <td colspan="67">拟采取网络信息查询监控措施的对象、目标或特定信息*</td>
                </tr>
                <tr class="tr" >
                    <td colspan="7" class="xhTh">序号</td>
                    <td colspan="15">姓名</td>
                    <td colspan="15">证件种类与号码</td>
                    <td colspan="15">目标或特定信息	</td>
                    <td colspan="15">备注</td>
                </tr>
                <tr>
                    <td  colspan="7"></td>
                    <td  colspan="15"></td>
                    <td  colspan="15"></td>
                    <td  colspan="15"></td>
                    <td  colspan="15"></td>
                </tr>
                 <tr>
                    <td  colspan="7"></td>
                    <td  colspan="15"></td>
                    <td  colspan="15"></td>
                    <td  colspan="15"></td>
                    <td  colspan="15"></td>
                </tr> 
                 <tr class="tr">
                     <td colspan="67" ><span>*申请对上述__个对象、__个目标、__个特定信息采取网络信息查询监控。</span></td> 
                 </tr>
                  <tr class="tr">
                     <td  colspan="67" ><span>采取网络信息查询监控措施的方式</span></td> 
                 </tr>
                 <tr class="tr">
                    <td colspan="34" ><span><input name="" type="checkbox"  disabled="disabled" value="" style="margin-right: 6px;margin-top: -2px;vertical-align: middle;padding-right:5px;" /></span><span>手动查询</span></td> 
                    <td colspan="33" ><span style="margin-left：-30px">查询时间：&nbsp;&nbsp; &nbsp;年&nbsp;&nbsp; &nbsp;月 &nbsp;&nbsp; &nbsp; 日至  &nbsp;&nbsp; &nbsp;年 &nbsp;&nbsp; &nbsp; 月 &nbsp;&nbsp;&nbsp;日</span></td> 
                 </tr>
                   <tr class="tr">
                    <td colspan="34" ><span><input name="" type="checkbox"  disabled="disabled" value="" style="margin-right: 6px;margin-top: -2px;vertical-align: middle;padding-right:5px;" /></span><span>自动监控</span></td> 
                    <td colspan="33" ><span style="margin-left：-30px">监控期限：&nbsp;&nbsp; &nbsp;年&nbsp;&nbsp; &nbsp;月 &nbsp;&nbsp; &nbsp; 日至  &nbsp;&nbsp; &nbsp;年 &nbsp;&nbsp; &nbsp; 月 &nbsp;&nbsp;&nbsp;日</span></td> 
                 </tr>
                  <tr class="trtwocon"  style="130px;">
                    <td colspan="7" style="height:125px;"><span style="letter-spacing: 2px;align-items: center;text-align: center;writing-mode: vertical-lr;display: inline-block;vertical-align: middle;margin-left:-4px">提请单位意见&nbsp;*</span></td>
                     <td colspan="27" style="position: relative;"><span style=" position: absolute;right:30px;bottom:15px;"></span></td>
                     <td colspan="7" style="height:125px;"><span style="letter-spacing: 2px;align-items: center;text-align: center;writing-mode: vertical-lr;display: inline-block;vertical-align: middle;margin-left:-4px">网安部门意见&nbsp;*</span></td>
                     <td colspan="26" style="position: relative;"><span style=" position: absolute;right:20px;bottom:15px;"></span></td>
                 </tr>
                  <tr class="trtwocon"  style="120px;">
                     <td  colspan="7"  ><span style="align-items: center;text-align: center;writing-mode: vertical-lr;display: inline-block;vertical-align: middle;margin-left:-4px">公安机关意见</span></td>
                     <td colspan="60" style="position: relative;"><span style=" position: absolute;right:30px;bottom:15px;"></span></td>
                 </tr>
         </tbody>
       </table>
         <p style="padding-top:15px;">说明：</p>
         <p>查询时间范围： 填写具体日期，如2017.1.1-2017.7.1（若只查询机主资料此栏填“无”）</p>
         <p>审核意见由部门负责人签字，审批意见由局领导签字，后连同受案登记表、立案决定书原件（或复印件）、号码来源佐证材料一齐交技术侦查中心。</p>
   </div>
   <!-- table6视侦 -->
      <!-- table2 -->
    <p v-if="szListt" style="width:660px;position:relative;margin:0 auto"> <button type="button" class="ivu-btn ivu-btn-primary" style="position: absolute; right:1px;top:30px;"  @click="getPdf('tabletwo','提请公安机关视频侦察部门数据查询审批表')"><span>导出表单</span></button></p>
    <div v-if="szListt" class="tabletwocon" style="margin-top:80px" id="tabletwo">
        <p class="tablealltitle">提请公安机关视频侦察部门数据查询审批表</p>
         <p class="tabletwodata" style="height:40px;line-height:40px;position: relative;">
            <span style="position: absolute;right:8px;"> 填表时间：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日  </span>
        </p>
        <table class="tabletwo" border="1" cellpadding="0" cellspacing="0" style="table-layout: fixed;" v-if="szlist">
            <tbody>
                    <tr class="trtwo">
                        <td  colspan="16">提请单位</td>
                        <td  colspan="18"></td>
                        <td  colspan="15">提请人</td>
                        <td  colspan="18" ></td>
                    </tr>
                    <tr class="trtwo">
                        <td  colspan="16">联系电话 </td>
                        <td  colspan="18"></td>
                        <td  colspan="15">反馈方式</td>
                        <td  colspan="18"></td>
                    </tr>
                    <tr class="">
                        <td colspan="7" style="height:100px;"><span style="letter-spacing: 2px;align-items: center;text-align: center;writing-mode: vertical-lr;display: inline-block;vertical-align: middle;margin-left:-10px">查询事由</span></td>
                        <td colspan="60" style="text-align: left;"><span style="text-align: left;line-height: 24px;padding-left:5px;display:block">{{qbmain}}</span></td>
                    </tr>
                    <tr>
                        <td  colspan="7" :rowspan="szlist[0].children[0].data.length+1" style="text-align: center;"><span style="align-items: center;text-align: center;vertical-align: middle;">查询内容</span></td>
                        <td class="contentTh" v-for="(thItem,thIndex) in szlist[0].children"  :key="thIndex" :colspan="60/szlist[0].children.length">{{thItem.mbmc}}</td>
                    </tr>
                    <tr  v-for="(item,index) in list[0].children[0].data" :key="index">
                        <td class="contentTh" v-for="(thItem2,thIndex2) in szlist[0].children" :title="thItem2.data[index].value" :colspan="60/szlist[0].children.length" :key="thIndex2">
                            {{thItem2.data[index].value}}
                        </td>
                    </tr>
                
                    
                    <tr class="tr">
                        <td colspan="67">以上共&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;个查询目标（大写）</td>
                    </tr>
                    <tr class="trtwocon"  style="120px;">
                        <td  colspan="7"  ><span style="align-items: center;text-align: center;writing-mode: vertical-lr;display: inline-block;vertical-align: middle; margin-left:-10px">审核意见</span></td>
                        <td colspan="26" style="position: relative;"><span style=" position: absolute;right:30px;bottom:15px;">年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日</span></td>
                        <td  colspan="7" ><span style="align-items: center;text-align: center;writing-mode: vertical-lr;display: inline-block;vertical-align: middle;">审批意见</span></td>
                        <td colspan="27" style="position: relative;"><span style="position: absolute;right: 20px;line-height:24px">（ 单  位  印 )</span><span style=" position: absolute;right:20px;bottom:15px;">年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日</span></td>
                    </tr>
                
                    <tr style="height:60px;">
                        <td colspan="7" ><span style="align-items: center;text-align: center;writing-mode: vertical-lr;display: inline-block;vertical-align: middle; margin-left:-10px">备注</span></td>
                        <td colspan="60"></td>
                    </tr>
                
                    
            </tbody>
        </table>
        <table class="tabletwo" border="1" cellpadding="0" cellspacing="0" style="table-layout: fixed;" v-else>
            <tbody>
                    <tr class="trtwo">
                        <td  colspan="3" style="width:10%">提请单位</td>
                        <td  colspan="6" style="width:50%"></td>
                        <td  colspan="4" style="width:15%">提请人</td>
                        <td  colspan="3" style="width:25%"></td>
                    </tr>
                    <tr class="trtwo">
                        <td  colspan="3" style="width:10%">联系电话 </td>
                        <td  colspan="6" style="width:50%"></td>
                        <td  colspan="4" style="width:15%">反馈方式</td>
                        <td  colspan="3" style="width:25%"></td>
                    </tr>
                    <tr class="">
                        <td style="height:100px;"><span style="letter-spacing: 2px;align-items: center;text-align: center;writing-mode: vertical-lr;display: inline-block;vertical-align: middle;margin-left:-10px">查询事由</span></td>
                        <td colspan="15" style="text-align: left;"><span style="text-align: left;line-height: 24px;padding-left:5px;display:block">{{qbmain}}</span></td>
                    </tr>
                    <tr class="trsone" style="height：40px">
                        <td  colspan="1" rowspan="5" style="text-align: center;"><span style="align-items: center;text-align: center;writing-mode: vertical-lr;display: inline-block;vertical-align: middle;margin-left:-20px">查询内容</span></td>
                        <td  colspan="7"> 查询目标</td>
                        <td colspan="3" style="text-align: center;">查询数据类型</td>
                        <td colspan="5">查询时间范围</td>
                    </tr>
                    <tr class="tr">
                        <td  colspan="7"> </td>
                        <td colspan="3" style="text-align: center;"></td>
                        <td colspan="5"></td>
                    </tr>
                    <tr class="tr">
                        <td  colspan="7"> </td>
                        <td colspan="3" style="text-align: center;"></td>
                        <td colspan="5"></td>
                    </tr><tr class="tr">
                        <td  colspan="7"> </td>
                        <td colspan="3" style="text-align: center;"></td>
                        <td colspan="5"></td>
                    </tr><tr class="tr">
                        <td  colspan="7"> </td>
                        <td colspan="3" style="text-align: center;"></td>
                        <td colspan="5"></td>
                    </tr>
                    <tr class="tr">
                        <td colspan="16">以上共&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;个查询目标（大写）</td>
                    </tr>
                    <tr class="trtwocon"  style="120px;">
                        <td  colspan="1"  ><span style="align-items: center;text-align: center;writing-mode: vertical-lr;display: inline-block;vertical-align: middle; margin-left:-10px">审核意见</span></td>
                        <td colspan="8" style="position: relative;"><span style=" position: absolute;right:30px;bottom:15px;">年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日</span></td>
                        <td  colspan="2" ><span style="align-items: center;text-align: center;writing-mode: vertical-lr;display: inline-block;vertical-align: middle;">审批意见</span></td>
                        <td colspan="5" style="position: relative;"><span style="position: absolute;right: 20px;line-height:24px">（ 单  位  印 )</span><span style=" position: absolute;right:20px;bottom:15px;">年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日</span></td>

                        <!-- <td colspan="5" style="position: relative;"><span style=" position: absolute;right:20px;bottom:15px;">年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日</span></td> -->

                    </tr>
                
                    <tr>
                        <td colspan="1" >备注</td>
                        <td colspan="15"></td>
                    </tr>
                
                    
            </tbody>
        </table>
         <p style="padding-top:15px">说明：</p>
         <p>查询时间范围： 填写具体日期，如2017.1.1-2017.7.1（若只查询机主资料此栏填“无”）</p>
         <p>审核意见由部门负责人签字，审批意见由局领导签字，后连同受案登记表、立案决定书原件（或复印件）、号码来源佐证材料一齐交技术侦查中心。</p>
   </div>
    <!-- table7技侦  -->
    <!-- table2 -->
    <p v-show="jzListt" style="width:660px;position:relative;margin:0 auto"> <button type="button" class="ivu-btn ivu-btn-primary" style="position: absolute; right:1px;top:30px;"  @click="getPdf('tabletwo','提请公安机关技术侦察部门数据查询审批表')"><span>导出表单</span></button></p>
    <div v-show="jzListt" class="tabletwocon" style="margin-top:80px" id="tabletwo">
        <p class="tablealltitle">提请公安机关技术侦察部门数据查询审批表</p>
         <p class="tabletwodata" style="height:40px;line-height:40px;position: relative;">
            <span style="position: absolute;right:8px;"> 填表时间：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日  </span>
        </p>
        <table class="tabletwo" border="1" cellpadding="0" cellspacing="0" style="table-layout: fixed;" v-if="jzlist">
            <tbody>
                    <tr class="trtwo">
                        <td  colspan="16">提请单位</td>
                        <td  colspan="18"></td>
                        <td  colspan="15">提请人</td>
                        <td  colspan="18" ></td>
                    </tr>
                    <tr class="trtwo">
                        <td  colspan="16">联系电话 </td>
                        <td  colspan="18"></td>
                        <td  colspan="15">反馈方式</td>
                        <td  colspan="18"></td>
                    </tr>
                    <tr class="">
                        <td colspan="7" style="height:100px;"><span style="letter-spacing: 2px;align-items: center;text-align: center;writing-mode: vertical-lr;display: inline-block;vertical-align: middle;margin-left:-10px">查询事由</span></td>
                        <td colspan="60" style="text-align: left;"><span style="text-align: left;line-height: 24px;padding-left:5px;display:block">{{qbmain}}</span></td>
                    </tr>
                    <tr>
                        <td  colspan="7" :rowspan="jzlist[0].children[0].data.length+1" style="text-align: center;"><span style="align-items: center;text-align: center;vertical-align: middle;">查询内容</span></td>
                        <td class="contentTh" v-for="(thItem,thIndex) in jzlist[0].children"  :key="thIndex" :colspan="60/jzlist[0].children.length">{{thItem.mbmc}}</td>
                    </tr>
                    <tr  v-for="(item,index) in list[0].children[0].data" :key="index">
                        <td class="contentTh" v-for="(thItem2,thIndex2) in jzlist[0].children" :title="thItem2.data[index].value" :colspan="60/jzlist[0].children.length" :key="thIndex2">
                            {{thItem2.data[index].value}}
                        </td>
                    </tr>
                
                    
                    <tr class="tr">
                        <td colspan="67">以上共&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;个查询目标（大写）</td>
                    </tr>
                    <tr class="trtwocon"  style="120px;">
                        <td  colspan="7"  ><span style="align-items: center;text-align: center;writing-mode: vertical-lr;display: inline-block;vertical-align: middle; margin-left:-10px">审核意见</span></td>
                        <td colspan="26" style="position: relative;"><span style=" position: absolute;right:30px;bottom:15px;">年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日</span></td>
                        <td  colspan="7" ><span style="align-items: center;text-align: center;writing-mode: vertical-lr;display: inline-block;vertical-align: middle;">审批意见</span></td>
                        <td colspan="27" style="position: relative;"><span style="position: absolute;right: 20px;line-height:24px">（ 单  位  印 )</span><span style=" position: absolute;right:20px;bottom:15px;">年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日</span></td>
                    </tr>
                
                    <tr style="height:60px;">
                        <td colspan="7" ><span style="align-items: center;text-align: center;writing-mode: vertical-lr;display: inline-block;vertical-align: middle; margin-left:-10px">备注</span></td>
                        <td colspan="60"></td>
                    </tr>
                
                    
            </tbody>
        </table>
        <table class="tabletwo" border="1" cellpadding="0" cellspacing="0" style="table-layout: fixed;" v-else>
            <tbody>
                    <tr class="trtwo">
                        <td  colspan="3" style="width:10%">提请单位</td>
                        <td  colspan="6" style="width:50%"></td>
                        <td  colspan="4" style="width:15%">提请人</td>
                        <td  colspan="3" style="width:25%"></td>
                    </tr>
                    <tr class="trtwo">
                        <td  colspan="3" style="width:10%">联系电话 </td>
                        <td  colspan="6" style="width:50%"></td>
                        <td  colspan="4" style="width:15%">反馈方式</td>
                        <td  colspan="3" style="width:25%"></td>
                    </tr>
                    <tr class="">
                        <td style="height:100px;"><span style="letter-spacing: 2px;align-items: center;text-align: center;writing-mode: vertical-lr;display: inline-block;vertical-align: middle;margin-left:-10px">查询事由</span></td>
                        <td colspan="15" style="text-align: left;"><span style="text-align: left;line-height: 24px;padding-left:5px;display:block">{{qbmain}}</span></td>
                    </tr>
                    <tr class="trsone" style="height：40px">
                        <td  colspan="1" rowspan="5" style="text-align: center;"><span style="align-items: center;text-align: center;writing-mode: vertical-lr;display: inline-block;vertical-align: middle;margin-left:-20px">查询内容</span></td>
                        <td  colspan="7"> 查询目标</td>
                        <td colspan="3" style="text-align: center;">查询数据类型</td>
                        <td colspan="5">查询时间范围</td>
                    </tr>
                    <tr class="tr">
                        <td  colspan="7"> </td>
                        <td colspan="3" style="text-align: center;"></td>
                        <td colspan="5"></td>
                    </tr>
                    <tr class="tr">
                        <td  colspan="7"> </td>
                        <td colspan="3" style="text-align: center;"></td>
                        <td colspan="5"></td>
                    </tr><tr class="tr">
                        <td  colspan="7"> </td>
                        <td colspan="3" style="text-align: center;"></td>
                        <td colspan="5"></td>
                    </tr><tr class="tr">
                        <td  colspan="7"> </td>
                        <td colspan="3" style="text-align: center;"></td>
                        <td colspan="5"></td>
                    </tr>
                    <tr class="tr">
                        <td colspan="16">以上共&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;个查询目标（大写）</td>
                    </tr>
                    <tr class="trtwocon"  style="120px;">
                        <td  colspan="1"  ><span style="align-items: center;text-align: center;writing-mode: vertical-lr;display: inline-block;vertical-align: middle; margin-left:-10px">审核意见</span></td>
                        <td colspan="8" style="position: relative;"><span style=" position: absolute;right:30px;bottom:15px;">年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日</span></td>
                        <td  colspan="2" ><span style="align-items: center;text-align: center;writing-mode: vertical-lr;display: inline-block;vertical-align: middle;">审批意见</span></td>
                        <td colspan="5" style="position: relative;"><span style="position: absolute;right: 20px;line-height:24px">（ 单  位  印 )</span><span style=" position: absolute;right:20px;bottom:15px;">年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日</span></td>

                        <!-- <td colspan="5" style="position: relative;"><span style=" position: absolute;right:20px;bottom:15px;">年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日</span></td> -->

                    </tr>
                
                    <tr>
                        <td colspan="1" >备注</td>
                        <td colspan="15"></td>
                    </tr>
                
                    
            </tbody>
        </table>
         <p style="padding-top:15px">说明：</p>
         <p>查询时间范围： 填写具体日期，如2017.1.1-2017.7.1（若只查询机主资料此栏填“无”）</p>
         <p>审核意见由部门负责人签字，审批意见由局领导签字，后连同受案登记表、立案决定书原件（或复印件）、号码来源佐证材料一齐交技术侦查中心。</p>
   </div>
</div>

</template>
<script>
import api from '@/fetch/api';
export default {
  data() {
    
    return {
      htmlTitle: '',
      list:null,//情报
      qbmain:'',
      ajmc:'',//案件名称
      ajdz:'',//案件地址
      ajbh:'',//案件编号
      slbm:'',//受理部门
      slsj:'',//受理时间
    //   dzcclist:[],//电子勘察list
      mainlist:[],//整个list
      qbList:null,//情报wrap

      szListt:null,//视侦wrap
      jzListt:null,//技侦wrap
    
      sjcxlist:null,//数据查询
      szlist:null,//视侦
      jzlist:null,//技侦
      wzListbox:[],//网侦wrap
      dzcclist:null,//电子侦察
      wzjsxcListbox:[],//网侦技术协查wrap
      wzjsxclist:null,//网侦技术协查
      wzxxlist:null, //网侦信息协查



    }
  },
  mounted() {
         this.getDetail()
  },
  created(){
    //   this.getDetail()
  },
   computed:{
        zbid(){
            return this.$route.query.zbid
        }
    },
  methods:{
       getDetail(){
				api.api('get',api.configUrl+'/hczz/zhb/queryDetail/'+this.zbid).then(res=>{
                        this.mainlist = res.jzList
                        this.qbmain=res.sqxx.jyrwnr
                        this.ajmc=res.sqxx.ajmc
                        this.ajdz=res.sqxx.ajdz
                        this.ajbh=res.sqxx.sabjbh
                        this.slsj=res.sqxx.slsj
                        this.slsj=res.sqxx.slsj
        
                    	this.qbList = this.mainlist.filter(item => {
						return item.jzjc.includes('情报') == true
                        })[0]
                      
					    this.wzListbox = this.mainlist.filter(item => {
                        return item.jzjc.includes('网侦') == true 
                        })[0]


                          // 情报里面的 视侦wrap
                        this.szListt = this.mainlist.filter(item => {
						return item.jzjc.includes('视侦') == true
                        })[0]
                        // 技侦wrap
                        this.jzListt = this.mainlist.filter(item => {
						return item.jzjc.includes('技侦') == true
                        })[0]
                        if(this.qbList){
                         this.list=this.qbList.mbList.filter(item => {
                         return item.mbdm=='QBXC'
                        
                          })
                    }
                    
                    // 视侦
                    if(this.szListt){
                        this.szlist=this.szListt.mbList.filter(item => {
                            return item.mbmc=='视频协查'
                            
                        }) 
                    }
                    //技侦
                    if(this.jzListt){
                         this.jzlist=this.jzListt.mbList.filter(item => {
                            return item.mbmc=='技侦查询'
                            
                        })
                    }
                  
                    // 数据查询
                    if(this.wzListbox){
                        this.sjcxlist=this.wzListbox.mbList.filter(item => {
                         return item.mbdm=="SJCX"
                    })
                    this.dzcclist=this.wzListbox.mbList.filter(item => {
                         return item.mbdm=="DZKY"
                    })
                    this.wzjsxclist=this.wzListbox.mbList.filter(item => {
                         return item.mbmc=="网侦技术协查"
                    })
                    this.wzxxlist=this.wzListbox.mbList.filter(item => {
                         return item.mbmc=="网侦信息协查"
                    })
                    }
                    
                })
			},
  }
}

</script>