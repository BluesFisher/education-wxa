<template>
    <view>
        <web-view v-if="url" :src="url"></web-view>
    </view>
</template>
<script>
export default {
    data () {
        return {
            url: '',
        }
    },
    async onLoad(options) {
        this.url = decodeURIComponent(options.url)
        console.log('webview url: ', this.url)
    },
}
</script>
