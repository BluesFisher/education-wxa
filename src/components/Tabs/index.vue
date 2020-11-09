<template>
    <scroll-view class="my-tab" scroll-x="true" :scroll-into-view="toViewId" style="width: 100%"
        :scroll-with-animation="true">
        <template v-for="(item, index) in tabItems">
            <view class="my-tab__item" :id="`myTab_${index}`" v-if="item.isShow" :key="item.label"
                :class="{ 'is-active': currentTab.value === item.value }" @click="tabClick(item, index)">
                <span class="my-tab__item-text">{{ item.label }}</span>
            </view>
        </template>
    </scroll-view>
</template>

<script>
export default {
    name: 'Tabs',
    props: {
        tabItems: {
            type: Array,
            default: () => [
                { label: '概况', value: 0, isShow: true },
                { label: '资讯', value: 1, isShow: true },
                { label: '院校消息', value: 2, isShow: true },
                { label: '院校列表', value: 3, isShow: true },
                { label: '专业大全', value: 4, isShow: true }
            ]
        },
        initTab: {
            type: Object,
            default: () => ({ label: '概况', value: 0, isShow: true })
        }
    },
    data() {
        return {
            currentTab: {},
            toViewId: 'myTab_0'
        }
    },
    components: {},
    watch: {
        initTab(val) {
            this.currentTab = val
        }
    },
    mounted() {
        this.currentTab = this.initTab || this.tabItems[0] || []
    },
    methods: {
        tabClick(item, index) {
            this.setScroll(item, index)

            this.$emit('tabClick', { item, index })
        },
        setCurrentTab(index) {
            this.setScroll(this.tabItems[index] || this.tabItems[0] || [], index)
        },
        setScroll(item, index) {
            const toViewIndex = index === this.tabItems.length - 1 ? index : Math.max(0, index - 1)
            this.$scope.setData({
                toViewId: `myTab_${toViewIndex}`,
                currentTab: item
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import './index';
</style>
