<template>
    <div id="main" class="app-main">
        <div style="height: 500px;" id="map">

        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                theme: this.$store.state.app.themeColor
            };
        },
        mounted() {
            this.initmap()
        },
        beforeDestroy() {

        },
        methods: {
            initmap() {
                let mymap = new this.$LeadorMap("map", {
                    center: [120.209947, 30.245853],
                    minZoom: 3,
                    maxZoom: 18,
                    zoom: 10,
                    apiurl: 'http://api.ishowchina.com',
                    key: 'ec85d3648154874552835438ac6a02b2'
                })
                mymap.registerPlugin(['tool', 'vectorTileLayer', 'panoramaControl', 'dataCluster', 'heatmapOverlay', 'geocoder', 'poiSearch', 'transfer', 'driving', 'walking', 'suggest', 'districtSearch', 'busInfoSearch'])
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
