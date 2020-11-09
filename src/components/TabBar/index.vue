<template>
    <cover-view class="bottom-tab-bar">
        <cover-view :class="['tab-bar-item', currentTabIndex === index ? 'tab-active' : '']" v-for="(item, index) in tabBar"
            :key="index" @click="bindTabClick(item, index)">
            <cover-image :src="currentTabIndex === index ? item.activeSrc : item.src" alt="" />
            <cover-view>{{ item.name }}</cover-view>
        </cover-view>
    </cover-view>
</template>

<script>
import UserIcon from '@/static/images/common/user2.png'
import UserSelectIcon from '@/static/images/common/user2-select.png'
import HomeIcon from '@/static/images/common/home2.png'
import HomeSelectIcon from '@/static/images/common/home2-select.png'

export default {
    components: {},
    mixins: [],
    data() {
        return {
            currentTabIndex: 0,
            currentPage: 'home',
            tabBar: [
                {
                    name: '首页',
                    src: HomeIcon,
                    activeSrc: HomeSelectIcon,
                    code: 'home',
                    mtaKey: 'home'
                },
                {
                    name: '我的',
                    src: UserIcon,
                    activeSrc: UserSelectIcon,
                    code: 'user',
                    mtaKey: 'user'
                }
            ]
        }
    },
    async onLoad() {},
    methods: {
        bindTabClick(item, index) {
            this.currentTabIndex = index
            this.currentPage = item.code
        }
    }
}
</script>

<style lang="scss" scoped>
.bottom-tab-bar {
    position: fixed;
    bottom: 0;
    height: 98rpx;
    width: 100%;
    display: flex;
    justify-content: space-around;
    background: #ffffff;
    border-top: 2rpx solid rgba(241, 241, 241, 0.8);
    z-index: 200;

    .tab-bar-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        cover-image {
            height: 46rpx;
            width: 46rpx;
        }

        cover-view {
            margin-top: 4rpx;
            font-size: 20rpx;
            color: #babec1;
        }
    }

    .tab-active {
        cover-view {
            color: #4d88ff;
        }
    }
}
</style>
