<style lang="less" scoped>
	#file {
		position: absolute;
		left: 0;
		width: 100px;
		opacity: 0;
	}
	.fjSpan{
		max-width: 70%;
		display: inline-block;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	ul {
		list-style: none;
	}
	
	.fill {
		animation: move 1.5s;
		text-align: center;
		background-color: #2593f7;
		width: 80%;
		height: 10px;
		display: inline-block;
		border-radius: 20px;
		height: 8px;
		line-height: 8px;
	}
	
	@keyframes move {
		0% {
			width: 0;
		}
		100% {
			width: 100%;
		}
	}
	
	.progressbar {
		display: inline-block;
		width: 20%;
		/*padding-left: 25px;*/
	}
</style>

<template>
	<div>
		<div style="text-align: left;">
			<Button icon="ivu-icon ivu-icon-ios-cloud-upload-outline" class="uploadBtn" @click="upload(files)">上传文件</Button>
			<input type="file" name="files" :accept="accept" id="file" @change="change($event)" :multiple="multiple" />
			<ul>
				<li v-for="(item,index) in obj.fileList" style="padding-top:8px;">
					<span class="fjSpan" :title="item.name">{{item.name}}</span>
					<div class="progressbar">
						<div class="fill" style="height:10px;vertical-align: top;"></div>
						<i class="el-icon-error" @click="del(index)" style="vertical-align: top;"></i>
					</div>
					
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import $ from 'jquery';

	export default {
	    props: {
	        numbers: { // 最多上传文件的个数
	            type: Number,
	            default: 5
	        },
	        multiple: { // 是否可以上传多个文件
	            type: Boolean,
	            default: true
	        },
	        size: { // 上传文件的大小
	            type: Number,
	            default: 10240
	        },
	        accept: {
	            type: String,
	            default: ''
	        },
	        choiceList: {
	            type: Array,
	            default: function () {
	                return [];
	            }
	        }
	    },
	    data () {
	        return {
	            obj: {
	                fileList: [],
	                baseArr: []
	            }
	        };
	    },
	    methods: {
	        change (e) {
	            console.log('ccc');
	            if (this.multiple) { // 支持多选
	                let files = e.target.files;
	                if (files.length > this.numbers || (files.length + this.obj.fileList.length) > this.numbers) { // 判断上传的个数
	                    this.$Notice.warning({
	                        title: '最多只能上传' + this.numbers + '个文件。'
	                    });
	                    return;
	                }
	                let arr = Object.keys(files);
	                for (var key in files) {
	                    if ((files[key].size) / 1024 > this.size) {
	                        this.$Notice.warning({
	                            title: '最多只能上传大小为' + (this.size / 1024) + 'M的文件。'
	                        });
	                        return;
	                    }
	                }
	                if (this.obj.fileList.length >= this.numbers) { // 判断上传的个数
	                    this.$Notice.warning({
	                        title: '最多只能上传' + this.numbers + '个文件。'
	                    });
	                    return;
	                }

	                $.each(files, (index, val) => { // 判断上传是否有重复
	                    let flag = false;
	                    $.each(this.obj.fileList, (indexs, value) => {
	                        if (value.name == val.name) {
	                            flag = true;
	                        }
	                    });
	                    if (this.choiceList && this.choiceList.length) {
	                        $.each(this.choiceList, (i, v) => {
	                            if (val.name == v.filename + '.' + v.category) {
	                                flag = true;
	                            }
	                        });
	                    }
	                    if (flag) {
	                        this.$Notice.warning({
	                            title: '文件' + val.name + '的文件已经上传。'
	                        });
	                        return;
	                    } else {
	                        this.obj.fileList.push(val);
	                        this.upload(val);
	                    }
	                    this.$emit('on-change', this.obj);
	                });
	                e.target.value = '';
	            } else {
	                let files = e.target.files;
	                if (files.size > this.size) {
	                    this.$Notice.warning({
	                        title: '最多只能上传大小为' + this.size + '的文件。'
	                    });
	                    return;
	                }
	                this.obj.fileList = $.extend(true, [], files);
	                this.upload(this.obj.fileList[0]);
	                this.$emit('on-change', this.obj);
	                e.target.value = '';
	            }
	        },
	        upload (files) {
	            let self = this;
	            var reader = new FileReader();
	            reader.readAsDataURL(files);
	            reader.onload = function (event) {
	                var fill = document.getElementsByClassName('fill');
	                var count = 0;
	                // 通过间隔定时器实现百分比文字效果,通过计算CSS动画持续时间进行间隔设置
	                var timer = setInterval(function (e) {
	                    count++;
	                    fill.innerHTML = count + '%';
	                    if (count === 100) clearInterval(timer);
	                    Message.success('文件上传成功');
	                }, 17);
	                self.obj.baseArr.push(event.target.result);
	            };
	            reader.onerror = function () {
                Message.error('文件上传失败');
            };
	        },
	        del (index) {
	            this.obj.fileList.splice(index, 1);
	            this.obj.baseArr.splice(index, 1);
	        },
	        delFile () {

	        }
	    },
	    mounted () {

	    }
	};
</script>