import Main from '@/views/Main.vue';
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () =>
        import ('@/views/login.vue')
};

export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [{
        path: 'home',
        title: '首页',
        name: 'home_index',
        component: () =>
            import ('@/views/pages/workBench/index.vue')
    }, {
        path: 'ksh',
        title: '可视化',
        name: 'ksh',
        component: () =>
            import ('@/views/pages/directive/check/ksh.vue')
    },{
        path: 'ksb',
        title: '可视化',
        name: 'ksb',
        component: () =>
            import ('@/views/pages/provincial/ksb.vue')
    },
     {
        path: 'zbabc',
        title: '导出文档',
        name: 'abc',
        component: () =>
            import ('@/views/pages/fullTime/start/abc.vue')
    }, {
        path: 'ueditor',
        title: '战果总结',
        name: 'zgzjxq',
        component: () =>
            import ('@/views/pages/specialSet/summarize/ueditor.vue')
    } ,{
    	path: 'ueditorLook',
        title: '战果总结查看',
        name: 'ueditorLookIndex',
        component: () =>
            import ('@/views/pages/specialSet/summarize/look.vue')
    },{
        path: 'zbksh',
        title: '可视化',
        name: 'zbksh',
        component: () =>
            import ('@/views/pages/fullTime/search/ksh.vue')
    },{
        path: 'specialStart',
        title: '专案合成研判发起',
        name: 'specialStart',
        component: () =>
            import ('@/views/pages/specialSet/determine/deterStart/deterStart.vue'),
            children:[{
            	path: '/deterStart/myTask',
		        title: '我的任务',
		        name: 'myTask',
		        component: () =>
		            import ('@/views/pages/specialSet/determine/deterStart/task/task.vue')
            }]
    },{
        path: 'fullTimeDetermineStart',
        title: '研判发起',
        name: 'fullTimeDetermineStart',
        component: () =>
            import ('@/views/pages/fullTime/set/determine/deterStart/deterStart.vue')
    },{
    	path: 'oldIndex',
        title: '工作台1',
        name: 'oldIndex',
        component: () =>
            import ('@/views/pages/workBench/oldIndex.vue')
    },{
    	path: 'newIndex',
        title: '工作台2',
        name: 'newIndex',
        component: () =>
            import ('@/views/pages/workBench/newIndex.vue')
    },{
    	path: 'fullTimeStart',
        title: '发起',
        name: 'fullTimeStart',
        component: () =>
            import ('@/views/pages/fullTime/start/start.vue')
    },{
    	path: 'specialCaseStart',
        title: '发起',
        name: 'specialCaseStart',
        component: () =>
            import ('@/views/pages/specialStart/case/caseStart.vue')
    },{
    	path: 'specialWarnStart',
        title: '警情发起',
        name: 'specialWarnStart',
        component: () =>
            import ('@/views/pages/specialStart/warn/warningStart.vue')
    }]
};


export const appRouter = [
//  {
//      path: '/workBench',
//      name: 'workBench',
//      title: '工作台',
//      icon: 'workBench',
//      component: Main,
//      children: [{
//          path:'workindex',
//  	    title:'工作台',
//  	    name:'workIndex',
//  	    component: () =>
//              import ('@/views/pages/workBench/index.vue')
//      }]
//  },
//  {
//      path: '/fullTime',
//      name: 'fullTime',
//      title: '专职专办发起',
//      component: Main,
//      icon: 'daliyCooperate',
//      children: [{
//          path: 'fullTimeIndex',
//          title: '专职专办发起',
//          name: 'startIndex',
//          component: () =>
//              import ('@/views/pages/fullTime/start/index.vue')
//      }]
//  },
//  {
//      path: '/fullTimeSet',
//      name: 'fullTimeSet',
//      title: '专职专办设置',
//      icon: 'dailyStart',
//      component: Main,
//      children: [
//      {
//          path: 'approveIndex',
//          title: '审批',
//          name: 'approveIndex',
//          component: () =>
//              import ('@/views/pages/fullTime/set/approve/index.vue')
//      }, 
//      {
//          path: 'determineIndex',
//          title: '研判',
//          name: 'determineIndex',
//          component: () =>
//              import ('@/views/pages/fullTime/set/determine/index.vue')
//      }, {
//          path: 'evaluateIndex',
//          title: '评价',
//          name: 'evaluateIndex',
//          component: () =>
//              import ('@/views/pages/fullTime/set/evaluate/index.vue')
//      },{
//          path: 'materialIndex',
//          title: '补充材料',
//          name: 'materialIndex',
//          component: () =>
//              import ('@/views/pages/fullTime/set/material/index.vue')
//      }
//      ]
//  },
//  {
//      path: '/dailyCooperate',
//      name: 'dailyCooperate',
//      title: '日常合成查询',
//      component: Main,
//      icon: 'daliyCooperate',
//      children: [{
//          path: 'index',
//          title: '日常合成查询',
//          name: 'index',
//          component: () =>
//              import ('@/views/pages/daliyCooperate/index.vue')
//      }]
//  },
//  {
//      path: '/dailyStart',
//      name: 'dailyStart',
//      title: '日常合成发起',
//      icon: 'dailyStart',
//      component: Main,
//      children: [{
//          path: 'request',
//          title: '请求协查发起',
//          name: 'request',
//          component: () =>
//              import ('@/views/pages/dailyStart/request.vue')
//      }, {
//          path: 'warning',
//          title: '警情发起',
//          name: 'warning',
//          component: () =>
//              import ('@/views/pages/dailyStart/warn/warning.vue')
//      }, {
//          path: 'case',
//          title: '案件发起',
//          name: 'case',
//          component: () =>
//              import ('@/views/pages/dailyStart/case/case.vue')
//      }]
//  },
//  {
//      path: '/dailySet',
//      name: 'dailySet',
//      title: '日常合成设置',
//      icon:'dailyStart',
//		component: Main,
//		children: [{
//			path: 'approve',
//			title: '日常合成审批',
//			name: 'approve',
//			component: () =>
//				import('@/views/pages/dailySet/approve/approve.vue')
//		},{
//			path: 'determine',
//			title: '日常合成研判',
//			name: 'determine',
//			component: () =>
//				import('@/views/pages/dailySet/determine/determine.vue')
//		},{
//			path: 'evaluate',
//			title: '日常合成评价',
//			name: 'evaluate',
//			component: () =>
//				import('@/views/pages/dailySet/evaluate/evaluate.vue')
//		},{
//			path: 'summarize',
//			title: '日常合成总结',
//			name: 'summarize',
//			component: () =>
//				import('@/views/pages/dailySet/summarize/summarize.vue')
//		},{
//			path: 'material',
//			title: '日常合成补充材料',
//			name: 'material',
//			component: () =>
//				import('@/views/pages/dailySet/material/material.vue')
//		},{
//			path: 'distribution',
//			title: '日常合成补录分配',
//			name: 'distribution',
//			component: () =>
//				import('@/views/pages/dailySet/distribution/distribution.vue')
//		},{
//			path: 'procedures',
//			title: '日常合成补录手续',
//			name: 'procedures',
//			component: () =>
//				import('@/views/pages/dailySet/procedures/procedures.vue')
//		}]
//	},
//  {
//      path: '/specialCooperate',
//      name: 'specialCooperate',
//      title: '专案合成查询',
//      component: Main,
//      icon: 'daliyCooperate',
//      children: [{
//          path: 'specialindex',
//          title: '专案合成查询',
//          name: 'specialindex',
//          component: () =>
//              import ('@/views/pages/specialCooperate/index.vue')
//      }]
//  },
//  {
//      path: '/specialStart',
//      name: 'specialStart',
//      title: '专案合成发起',
//      icon: 'dailyStart',
//      component: Main,
//      children: [{
//          path: 'specialwarning',
//          title: '警情发起',
//          name: 'specialwarning',
//          component: () =>
//              import ('@/views/pages/specialStart/warn/warning.vue')
//      }, {
//          path: 'specialcase',
//          title: '案件发起',
//          name: 'specialcase',
//          component: () =>
//              import ('@/views/pages/specialStart/case/case.vue')
//      }]
//  },
//  {
//      path: '/specialSet',
//      name: 'specialSet',
//      title: '专案合成设置',
//      icon:'dailyStart',
//      component: Main,
//      children: [{
//          path: 'specialapprove',
//          title: '专案合成审批',
//          name: 'specialapprove',
//          component: () =>
//              import('@/views/pages/specialSet/approve/approve.vue')
//      },{
//          path: 'specialdetermine',
//          title: '专案合成研判',
//          name: 'specialdetermine',
//          component: () =>
//              import('@/views/pages/specialSet/determine/determine.vue')
//      },{
//          path: 'specialevaluate',
//          title: '专案合成评价',
//          name: 'specialevaluate',
//          component: () =>
//              import('@/views/pages/specialSet/evaluate/evaluate.vue')
//      },{
//          path: 'specialsummarize',
//          title: '专案合成战果总结',
//          name: 'specialsummarize',
//          component: () =>
//              import('@/views/pages/specialSet/summarize/summarize.vue')
//      },{
//          path: 'specialmaterial',
//          title: '专案合成补充材料',
//          name: 'specialmaterial',
//          component: () =>
//              import('@/views/pages/specialSet/material/material.vue')
//      },{
//          path: 'specialdistribution',
//          title: '专案合成补录分配',
//          name: 'specialdistribution',
//          component: () =>
//              import('@/views/pages/specialSet/distribution/distribution.vue')
//      },{
//          path: 'specialprocedures',
//          title: '专案合成补录手续',
//          name: 'specialprocedures',
//          component: () =>
//              import('@/views/pages/specialSet/procedures/procedures.vue')
//      }]
//  },
//  {
//      path: '/directiveCheck',
//      icon: 'check',
//      name: 'directiveCheck',
//      title: '指令核查查询',
//      component: Main,
//      children: [{
//          path: 'checkList',
//          title: '指令核查查询',
//          name: 'checkList',
//          component: () =>
//              import ('@/views/pages/directive/check/index.vue')
//      }]
//  },
//  {
//      path: '/directivePublish',
//      icon: 'publish',
//      name: 'directivePublish',
//      title: '指令核查下发',
//      component: Main,
//      children: [{
//          path: 'publish',
//          title: '指令核查下发',
//          name: 'publish',
//          component: () =>
//              import ('@/views/pages/directive/publish/index.vue')
//      }]
//  },
//  {
//      path: '/directiveDispose',
//      icon: 'dispose',
//      name: 'directiveDispose',
//      title: '指令核查处置',
//      component: Main,
//      // redirect:'/directiveDispose/directApproval',
//      children: [{
//              path: 'approval',
//              title: '指令核查审批',
//              name: 'approval',
//              component: () =>
//                  import ('@/views/pages/directive/dispose/approval/index.vue')
//          },
//          {
//              path: 'signIn',
//              title: '指令核查签收反馈',
//              name: 'signIn',
//              component: () =>
//                  import ('@/views/pages/directive/dispose/signIn/index.vue')
//          },
//          {
//              path: 'comment',
//              title: '指令核查评价',
//              name: 'comment',
//              component: () =>
//                  import ('@/views/pages/directive/dispose/comment/index.vue')
//          }
//      ]
//  },
//  {
//      path: '/myInterest',
//      icon: 'interest',
//      name: 'myInterest',
//      title: '我的关注',
//      component: Main,
//      children: [{
//          path: 'interestIndex',
//          title: '我的关注',
//          name: 'interestIndex',
//          component: () =>
//              import ('@/views/pages/myInterest/index.vue')
//      }]
//  },
//  {
//      path: '/supervise',
//      icon: 'supervise',
//      name: 'supervise',
//      title: '监督管理',
//      component: Main,
//      children: [{
//          path: 'allData',
//          title: '监督管理',
//          name: 'allData',
//          component: () =>
//              import ('@/views/pages/supervise/allData/index.vue')
//      },
//      {
//          path: 'dailyData',
//          title: '日常合成请求统计',
//          name: 'dailyData',
//          component: () =>
//              import ('@/views/pages/supervise/dailyData/index.vue')
//      },
//      {
//          path: 'directive',
//          title: '指令核查统计',
//          name: 'directive',
//          component: () =>
//              import ('@/views/pages/supervise/directive/index.vue')
//      }
//  ]
//  },
//  {
//      path: '/config',
//      title: '系统配置',
//      name: 'config',
//      component: Main,
//      icon: 'config',
//      children: [
//          {
//              path: 'approve',
//              title: '审批流程管理',
//              name: 'approve',
//              component: () =>
//                  import ('@/views/pages/config/approve/index.vue')
//          },
//          {
//              path: 'daliyCooperate',
//              title: '日常合成研判管理',
//              name: 'config-daliyCooperate',
//              component: () =>
//                  import ('@/views/pages/config/daliyCooperate/index.vue')
//          },
//          {
//              path: 'addRecorder',
//              title: '手续补录人员管理',
//              name: 'addRecorder',
//              component: () =>
//                  import ('@/views/pages/config/addRecorder/index.vue')
//          },
//          {
//              path: 'directive',
//              title: '指令级别管理',
//              name: 'config-directive',
//              component: () =>
//                  import ('@/views/pages/config/directive/index.vue')
//          },
//          {
//              path: 'deparment',
//              title: '部门职权配置',
//              name: 'deparment',
//              component: () =>
//                  import ('@/views/pages/config/deparment/index.vue')
//          },
//          {
//              path: 'workFlow',
//              title: '业务流程管理',
//              name: 'workFlow',
//              component: () =>
//                  import ('@/views/pages/config/workFlow/index.vue')
//          }
//      ]
//  }
];

export const routers = [
    loginRouter,
    otherRouter,
    ...appRouter
];