<template>
        <div class="content" id="water-mark-area">
            <!--<h3>一点点文字，主要关心水印</h3>-->
        </div>
</template>

<script>
    import Cookies from 'js-cookie';
    import Watermark from './Watermark';
    export default {
        data () {
            return {
            //              theme: this.$store.state.app.themeColor
            };
        },
        mounted () {
            Watermark('#water-mark-area', {
                text: Cookies.get('user') + ' ' + Cookies.get('IdCard'),
                color: '#000000',
                fontSize: '16px'
                // imageSrc: 'src/images/login-logo.png',
                // imageWidth: '60px'
            });
        },
        beforeDestroy () {

        },
        methods: {

        }
    };
</script>

<style scoped>
    .content {
        height: 600px;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
