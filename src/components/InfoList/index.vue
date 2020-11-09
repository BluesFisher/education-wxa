<template>
    <scroll-view style="height: 100%" scroll-y="true" :refresher-enabled="true" :lower-threshold="0"
        :refresher-triggered="triggered" :refresher-threshold="100" :enable-back-to-top="true"
        refresher-default-style="black" refresher-background="#f8f8f8" @refresherrefresh="onRefresh"
        @scrolltolower="onBottom">
        <view class="base-info-list">
            <view class="base-info-list-header" v-if="title">
                <view class="list-header-title">{{ title }}</view>
                <view class="list-header-more" @click="handleMore" v-if="needMore">
                    <text>查看更多</text>
                    <view class="down-arrow menu-arrow"></view>
                </view>
            </view>

            <view class="base-info-list-content">
                <slot name="base-info-list" />
                <template v-if="infoListShow.length > 0">
                    <view class="list-content-item" v-for="(item, index) in infoListShow" :key="index">
                        <template v-if="item.type === 'ads'">
                            <view class="list-ads">
                                <view class="list-ads-img">
                                    <image mode="aspectFill" :src="item.image" />
                                    <view class="list-ads-img-tips">广告</view>
                                </view>
                                <view class="list-ads-img-title">
                                    <text>{{ item.title }}</text>
                                    <view class="ads-close" @click="adsClose(item, index)">X</view>
                                </view>
                            </view>
                        </template>
                        <template v-else>
                            <view class="list-content-item-left" :class="{'list-content-with-img': item.image}">
                                <view class="list-content-item-title ellipsis-2">{{ item.title }}</view>
                                <view class="list-content-item-tips">
                                    <text>{{ item.author }}</text>
                                    <text v-if="item.scanNum > 0">{{ item.scanNum }}浏览</text>
                                </view>
                            </view>
                            <view class="list-content-item-right" v-if="item.image">
                                <image mode="aspectFill" :src="item.image" />
                            </view>
                        </template>
                    </view>
                </template>

                <template v-else-if="blockList.length > 0">
                    <view v-for="(item, index) in blockList" class="block-item" :key="index">
                        <view class="block-item-title">
                            <image :src="item.img" mode="aspectFill" lazy-load="true" />
                            <view class="block-item-title-context">{{item.title}}</view>
                            <view class="block-item-more">更多</view>
                        </view>

                        <view v-for="(info, infoIndex) in item.infos" :key="infoIndex" class="list-content-item block-content-item">
                            <view class="list-content-item-left" :class="{'list-content-with-img': info.image}">
                                <view class="list-content-item-title ellipsis-2">
                                    {{ info.title }}
                                </view>
                                <view class="list-content-item-tips">
                                    <text>{{ info.author }}</text>
                                    <text v-if="info.scanNum > 0">{{ info.scanNum }}浏览</text>
                                </view>
                            </view>
                        </view>
                    </view>
                </template>

                <template v-else-if="intrList.length > 0">
                    <view v-for="(item, index) in intrList" class="intr-item" :key="index" @click="toSchoolDetail(item, index)">
                        <view class="intr-item-left">
                            <image :src="item.img" mode="aspectFit" lazy-load="true" />
                        </view>
                        <view class="intr-item-right">
                            <view class="intr-item-name">{{item.name}}</view>
                            <view class="intr-item-desc">{{item.desc}}</view>
                            <view class="intr-item-note">
                                <text v-if="item.is985" class="intr-item-nature">{{item.nature}}</text>
                                <text v-if="item.type" class="intr-item-type">{{item.type}}</text>
                                <text v-if="item.category" class="intr-item-category">{{item.category}}</text>
                            </view>
                            <view class="intr-item-level">{{item.level}}</view>
                        </view>

                    </view>
                </template>

                <template v-else-if="professionList.length > 0">
                    <view v-for="(item, index) in professionList" class="profession-item" :key="index"
                        @click="toProfessionDetail(item, index)">
                        <view class="profession-name">
                            <text>{{item.name}}</text>
                            <image v-if="item.isHot" class="hot-icon" :src="HOT" mode="scaleToFill" />
                        </view>
                        <view class="profession-content">
                            <view class="profession-detail">学历：<text>{{item.education}}</text></view>
                            <view class="profession-detail">门类：<text>{{item.category}}</text></view>
                            <view class="profession-detail">学科：<text>{{item.subject}}</text></view>
                            <view class="profession-detail">授予学位：<text>{{item.degree}}</text></view>
                            <view class="profession-detail">代码：<text>{{item.code}}</text></view>
                        </view>
                    </view>
                </template>

                <template v-else-if="audioList.length > 0">
                    <view class="list-content-item" v-for="(item, index) in audioList" :key="index">
                        <view class="audio-list-item-left">
                            <view class="audio-item-title">{{ item.title }}</view>
                            <view class="audio-item-author">
                                <text>{{ item.author }}</text>
                                <text>{{ item.currentTime }}
                                    <text v-if="item.duration">/{{ item.duration }}</text>
                                </text>
                            </view>
                            <view class="audio-item-tips">已经播放{{ item.playNum }}次</view>
                        </view>
                        <view class="audio-list-item-right">
                            <image mode="aspectFill" :src="item.image" />
                            <view class="audio-control" @click="handleAudioCtrl(item, index)">
                                <image :src="item.audioCtrl" />
                            </view>
                        </view>
                    </view>
                </template>
            </view>
        </view>
        <view class="list-loading" :style="{'visibility': toBottom ? 'visible' : 'hidden'}" v-if="!noMoreList">正在努力加载...</view>
        <view class="list-loading" v-if="noMoreList">--暂无更多内容--</view>
    </scroll-view>
</template>

<style lang="scss" src="./index.scss"></style>

<script>
import dayjs from 'dayjs'
import PLAY_ICON from '@/static/images/common/play.png'
import PAUSE_ICON from '@/static/images/common/pause.png'
import HOT from '@/static/images/common/hot.png'

const R = require('ramda')

export default {
    name: 'InfoList',
    props: {
        title: {
            type: String,
            default: ''
        },
        infoList: {
            type: Array,
            default: () => []
        },
        blockList: {
            type: Array,
            default: () => []
        },
        intrList: {
            type: Array,
            default: () => []
        },
        audioList: {
            type: Array,
            default: () => []
        },
        professionList: {
            type: Array,
            default: () => []
        },
        moreUrl: {
            type: String,
            default: ''
        },
        needMore: {
            type: Boolean,
            default: false
        },
        noMoreList: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            HOT,

            triggered: false,
            freshing: false,
            toBottom: false,

            infoListShow: [],
            // 音频data
            innerAudioContext: null,
            lastAudioIndex: null,
            currentAudioTime: '00:00',
            currentAudioDuration: '00:00'
        }
    },
    watch: {
        infoList(val) {
            this.infoListShow = R.clone(val)
        }
    },
    mounted() {
        this.infoListShow = R.clone(this.infoList)
    },
    methods: {
        onRefresh() {
            if (this.freshing) return
            this.$scope.setData({
                triggered: true,
                freshing: true
            })
            this.$emit('updateData')
        },
        refreshFinish() {
            this.$scope.setData({
                triggered: false,
                freshing: false,
                toBottom: false
            })
        },
        onBottom() {
            if (this.noMoreList) return

            this.$scope.setData({
                toBottom: true
            })
            this.$emit('updateData', 'onBottom')
        },
        handleMore() {
            if (this.moreUrl.startsWith('http')) {
                // CommonFunc.gotoWebViewPage(this.moreUrl);
                return
            }
            // uni.navigateTo({
            //     url: this.moreUrl
            // });
        },
        handleAudioCtrl(item, index) {
            // 当点击的是上一次控制的音频
            if (this.lastAudioIndex === index) {
                this.setAudioCtrlIcon(index)
                return
            }
            if (this.innerAudioContext) {
                this.innerAudioContext.stop()
                this.innerAudioContext.destroy()
            }

            // 点击的不是上一次控制的音频
            this.setAudioCtrlIcon(index, true)

            // 初始化音频播放
            this.initAudio(index, item)
        },
        setAudioCtrlIcon(index = 0, needSetlastCtrl = false) {
            if (needSetlastCtrl) {
                if (this.lastAudioIndex !== null) {
                    this.audioList[this.lastAudioIndex].audioCtrl = PLAY_ICON
                    this.audioList[this.lastAudioIndex].currentTime = '00:00'
                }
                this.lastAudioIndex = index
            }

            if (this.audioList[index].audioCtrl === PLAY_ICON) {
                this.audioList[index].audioCtrl = PAUSE_ICON
                this.innerAudioContext && this.innerAudioContext.play()
            } else {
                this.audioList[index].audioCtrl = PLAY_ICON
                this.innerAudioContext && this.innerAudioContext.pause()
            }
        },

        initAudio(index, item) {
            this.innerAudioContext = uni.createInnerAudioContext()
            this.innerAudioContext.autoplay = true
            this.innerAudioContext.src = item.src
            // this.innerAudioContext.startTime = 100;

            this.innerAudioContext.onPlay(() => {
                console.log('开始播放', item.title)
            })
            this.innerAudioContext.onTimeUpdate(() => {
                const { currentTime, duration } = this.innerAudioContext

                this.audioList[index].currentTime = dayjs.unix(currentTime).format('mm:ss')
                this.audioList[index].duration = dayjs.unix(duration).format('mm:ss')
            })
            this.innerAudioContext.onCanplay(() => {
                console.log(this.innerAudioContext.duration)
            })
            this.innerAudioContext.onEnded(() => {
                this.audioList[index].audioCtrl = PLAY_ICON
                this.audioList[index].currentTime = '00:00'
            })
            this.innerAudioContext.onError((res) => {
                console.log(res.errCode, res.errMsg)
            })
        },
        adsClose(item, index) {
            this.infoListShow = R.remove(index, 1, this.infoListShow)
        },
        toSchoolDetail(item, index) {
            console.log('toSchoolDetail', item, index)
            uni.navigateTo({
                url: '/pages/school/index'
            })
        },
        toProfessionDetail(item, index) {
            console.log('toProfessionDetail', item, index)
            uni.navigateTo({
                url: '/pages/profession/index'
            })
        }
    }
}
</script>
