export function filterNull(val) {
	if(val == null || val == '' || val == undefined || val == 'null') {
		return '--'
	} else {
		return val
	}
}

export function filterSex(val) {
	if(val == 0) {
		return '男'
	} else if(val == 1) {
		return '女'
	} else {
		return '未知'
	}
}

export function typeFilter(val) {
	if(val == 0) {
		return '菜单'
	} else if(val == 1) {
		return '控制器'
	} else {
		return '方法'
	}
}

export function isFilter(val) {
	if(val == 0) {
		return '有效'
	} else {
		return '无效'
	}
}
export function taskStatus(val) {
	if(val == 0) {
		return '未审核'
	} else if(val == 1) {
		return '已审核'
	} else if(val == 2) {
		return '已签收'
	} else if(val == 3) {
		return '已反馈'
	} else if(val == 4) {
		return '已研判'
	} else if(val == 5) {
		return '已评价'
	} else if(val == 'a') {
		return '审批中'
	} else {
		return '出战果'
	}
}
export function taskZt(val) {
	if(val == 1) {
		return '待签收'
	} else if(val == 2) {
		return '待反馈'
	} else if(val == 3) {
		return '待结束'
	} else {
		return '已完成'
	}
}
export function taskZt2(val) {
	if(val == 1) {
		return '待签收'
	} else if(val == 2) {
		return '待反馈'
	} else {
		return '已完成'
	}
}
export function status(val) {
	if(val == 0) {
		return '未处理'
	} else {
		return '在处理'
	}
}
export function formatSelect(val, obj) {
	return obj.find(item => {
		return val === item.key
	}).label
}
export function parseTime(time, cFormat) {
	const format = cFormat || '{y}-{m}-{d}';
	if(time == null || time == '') {
		return null;
	} else {
		let date = typeof time === 'number' ? new Date(time) : time;
		const formatObj = {
			y: date.getFullYear(),
			m: date.getMonth() + 1,
			d: date.getDate()
		};
		const time_str = format.replace(/{(y|m|d)+}/g, (result, key) => {
			let value = formatObj[key]
			if(result.length > 0 && value < 10) {
				value = '0' + value;
			}
			return value || 0;
		});
		return time_str;
	}
}
export function timestampToTime(timestamp) { //时间戳转为YYYY-MM-DD
	if(timestamp != null) {
		var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
		var Y = date.getFullYear() + '-';
		var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
		var D = date.getDate() + ' ';
		var H = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
		var F = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
		var S = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()) + ' ';

		return Y + M + D + H + F + S;
	}

}
export function zacxztFilter(val) {
	switch(val) {
		case '0':
			return '发起失败'
			break;
		case '1':
			return '已审批'
			break;
		case '2':
			return '研判中'
			break;
		case '4':
			return '已研判'
			break;
		case '5':
			return '已评价'
			break;
		case '6':
			return '已完成'
			break;
		case '7':
			return '审批不通过'
			break;
		case 'a':
			return '审批中'
			break;
		default:
			break;
	}
}
export function ztFilter(val) {
	switch(val) {
		case '0':
			return '未审核'
			break;
		case '1':
			return '待签收'
			break;
		case '2':
			return '已签收'
			break;
		case '3':
			return '已反馈'
			break;
		case '4':
			return '已研判'
			break;
		case '5':
			return '已评价'
			break;
		case '6':
			return '出战果'
			break;
		case '7':
			return '审批不通过'
			break;
		case 'a':
			return '待审批'
			break;
		case '8':
			return '已退回'
			break;
		default:
			break;
	}
}
export function qqxcztFilter(val) {
	switch(val) {
		case '0':
			return '发起失败'
			break;
		case '1':
			return '已审批'
			break;
		case '2':
			return '已签收'
			break;
		case '3':
			return '已反馈'
			break;
		case '4':
			return '已研判'
			break;
		case '5':
			return '已完成'
			break;
		case '6':
			return '出战果'
			break;
		case '7':
			return '审批不通过'
			break;
		case 'a':
			return '审批中'
			break;
		case '8':
			return '已退回'
			break;
		default:
			break;
	}
}
export function zlcxFilter(val) {
	switch(val) {
		case '1':
			return '待签收'
			break;
		case '2':
			return '已签收'
			break;
		case '3':
			return '已反馈'
			break;
		case '4':
			return '已评价'
			break;
	}
}