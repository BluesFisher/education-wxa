<script>
import { gRequest } from './utils/request/index'

const CONFIG = process.env.config

export default {
    globalData: {
        csrfToken: '',
        jwt: ''
    },
    onLaunch: async function() {
        uni.setNavigationBarTitle({
            title: CONFIG.barTitle
        })
    },
    onShow: function() {},
    onHide: function() {}
}
</script>

<style lang="scss">
page {
    background-color: #f8f8f8;
}
</style>
