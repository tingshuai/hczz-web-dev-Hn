<template>
    <section ref="print">
        打印的内容。。。。。。。。。。。。
        <div class="no-print">不打印的内容。。。。。。。。。。</div>
    </section>
   <!-- <div>
        <section ref="print">
            打印的内容。。。。。。。。。。。。
            <div class="no-print">不打印的内容。。。。。。。。。。</div>
        </section>
        <Button type="primary"  @click="print">打印</Button>
    </div>-->
</template>

<script>
    export default {
        data() {
            return {
                theme: this.$store.state.app.themeColor
            };
        },
        mounted() {
            this.print();
        },
        beforeDestroy() {

        },
        methods: {
            print() {
                this.$print(this.$refs.print)
            }
        }
    };
</script>

<style>
    html, body {
        width: 100%;
        height: 100%;
        background: #f0f0f0;
        overflow: hidden;
    }

    .app-main {
        width: 100%;
        height: 100%;
    }
</style>
