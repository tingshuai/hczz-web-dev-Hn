<style lang="less">
    @import '../../../styles/common.less';
    @import 'upload.less';
</style>
<template>
    <div class="uploadImg">
    	<div style="position: relative;">
			<Upload ref="upload" 
	            :show-upload-list="uploadSuccessShow"
	            :default-file-list="defaultList"
	            :on-success="handleSuccess"
	            :format="accept"
	            :max-size="maxSize"
	            :on-format-error="handleFormatError"
	            :on-exceeded-size="handleMaxSize"
	            :before-upload="handleBeforeUpload"
	            multiple="multiple"
	            type="select"
	            action="/api/v1/imageManage/save?login=admin">
	            <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
	       </Upload>
       </div>
    </div>
</template>

<script>
	import api from '@/fetch/api';
	import $ from 'jquery';
export default {
    name: 'file-upload',
    props: {
    	uploadSuccessShow: {
    		type: Boolean,
    		default: false
    	},
    	accept: {
    		type: Array,
    		default: function () {
    			return [];
    		}
    	},
    	maxSize: {
    		type: Number,
    		default: 1024
    	},
    	multiple: {
    		type: Boolean,
    		default: false
    	},
    	url: {
    		type: String,
    		default: 'http://192.168.0.71:7080/imageManage/save?login=admin'
    	}
    },
    data () {
        return {
        	defaultList: [],
        	acceptType: '',
        	uploadList: [],
        };
    },
    methods: {
    	handleFormatError (file) {
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
            });
       },
        handleSuccess (evnet, file) {
            this.$Notice.success({
                title: '文件上传成功',
                desc: '文件 ' + file.name + ' 上传成功。'
            });
        },
        handleRemove (file) {
            // 从 upload 实例删除数据
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
        },
        handleMaxSize (file) {
            this.$Notice.warning({
                title: '超出文件大小限制',
                desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
            });
        },
        handleBeforeUpload () {
            const check = this.uploadList.length < 5;
            if (!check) {
                this.$Notice.warning({
                    title: '最多只能上传 5个附件。'
                });
            }
            return check;
        }
    },
    mounted () {
        this.uploadList = this.$refs.upload.fileList;
        this.acceptType = this.accept.join(',');
    }
};
</script>
<style type="text/css">
	.uploadImg .ivu-upload-drag{
		height: 68px;
		width: 68px;
	}
	.uploadImg .accept{
		width:100px;
	    border:1px solid #ddd;
	    overflow: hidden;
	    white-space: nowrap;
	    text-overflow: ellipsis;
	    float: left;
	    height: 68px !important;
	    line-height: 68px !important;
	    margin-left: 10px;
	    border: 1px solid #ffffff !important;
	}
</style>
