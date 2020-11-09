<template>
    <view class="page" @touchstart="touchStart" @touchend="touchEnd">
        <!-- <view class="main-back" :animation="animationData">
            <view class="back-mask"></view>
            <image class="back-img" mode="aspectFill" :src="MAIN_BACK" alt="" />
            <view class="main-tips">
                <text>{{ mainTitle }}</text>
                <text class="main-tip-time">{{ diffDay }}</text>
            </view>

            <view class="main-date">
                <view class="main-date-day">{{ date.date() }}</view>
                <view class="main-date-yearMonth">
                    <view>{{ date.year() }}</view>
                    <view class="main-date-month">{{ MONTH[date.month()] }}</view>
                </view>
            </view>
        </view> -->
        <view class="tab-container">
            <view class="main-tips-ctrl" @click="showMainTips">惊喜</view>
            <Tabs @tabClick="tabClick" ref="tabs" />
        </view>

        <!-- <view class="inform-btn" @click="getCode">获取code</view> -->

        <view class="page-section">
            <swiper
                class="swiper"
                :indicator-dots="indicatorDots"
                :autoplay="autoplay"
                :duration="duration"
                :current="swiperCurrent"
                @change="swiperChange"
            >
                <swiper-item class="swiper-item">
                    <view class="main-back">
                        <view class="back-mask"></view>
                        <image class="back-img" mode="aspectFill" :src="MAIN_BACK" alt="" />
                        <view class="main-tips">
                            <text>{{ mainTitle }}</text>
                            <text class="main-tip-time">{{ diffDay }}</text>
                        </view>
                    </view>
                    <!-- <LineChart /> -->
                </swiper-item>
                <swiper-item class="swiper-item">
                    <NewsList
                        ref="newsList"
                        :infoList.sync="newsList"
                        :noMoreList.sync="noMoreNews"
                        @updateData="updateNewsList"
                    />
                </swiper-item>
                <swiper-item class="swiper-item">
                    <SchoolNewsList
                        ref="schoolNewsList"
                        :blockList.sync="schoolNewsList"
                        :noMoreList.sync="noMoreSchoolNews"
                        @updateData="updateSchoolNewsList"
                    />
                </swiper-item>
                <swiper-item class="swiper-item">
                    <SchoolIntrList
                        ref="schoolIntrList"
                        :intrList.sync="schoolIntrList"
                        :noMoreList.sync="noMoreSchoolIntr"
                        @updateData="updateSchoolIntrList"
                    />
                </swiper-item>
                <swiper-item class="swiper-item">
                    <SchoolIntrList
                        ref="professionList"
                        :professionList.sync="professionList"
                        :noMoreList.sync="noMoreProfession"
                        @updateData="updateProfessionList"
                    />
                </swiper-item>
            </swiper>
        </view>
    </view>
</template>

<script>
import apiReq from '../../utils/request/index'
import pageMixin from '../../mixins/page'
import { wxFunc } from '../../utils/util.js'
import dayjs from 'dayjs'

import Tabs from '@/components/Tabs'
import LineChart from '@/components/LineChart'
import InfoList from '@/components/InfoList'

import MAIN_BACK from '@/static/images/main/main-back.png'

const R = require('ramda')
const MONTH = {
    1: 'JAN',
    2: 'FEB',
    3: 'MAR',
    4: 'APR',
    5: 'MAY',
    6: 'JUN',
    7: 'JUL',
    8: 'AUG',
    9: 'SEPT',
    10: 'OCT',
    11: 'NOV',
    12: 'DEC'
}
const EXAM_DATE = '2021-07-16'
const SCENTENCE = [
    '生活明朗，万物可爱',
    '青春如梦，岁月如花',
    '走过的路，就会留下痕迹',
    '青春，一半明媚，一半忧伤',
    '青春，是人生最美丽的季节',
    '世界偶尔薄情，愿你一如既往深情'
]

let touchDotX = 0 //X按下时坐标
let touchDotY = 0 //y按下时坐标
let interval //计时器
let time = 0 //从按下到松开共多少时间*100

const ARTICLE_LIST = [
    {
        title: '广东2020年关于做好军队院校招收普通高中毕业生工作的通知',
        author: '老夫子',
        image: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3822439549,3302829143&fm=26&gp=0.jpg',
        scanNum: 2300
    },
    {
        title: '2020年广东高考将于23日放榜分数线下午公布',
        author: '凯',
        image: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2016789535,1857339869&fm=26&gp=0.jpg',
        scanNum: 4312
    },
    {
        title: '高考补习班，你值得拥有',
        author: '广告',
        type: 'ads',
        image: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2823107684,92305753&fm=26&gp=0.jpg',
        scanNum: 0
    },
    {
        title: '广东文科600分以上考生可报考院校推荐',
        author: '高考网',
        image: '',
        scanNum: 8300
    },
    {
        title: '2020年广东省卫生健康委等四部门关于做好订单定向培养农村卫生人才工作的通知',
        author: '高考网',
        image: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2017255556,2694578044&fm=26&gp=0.jpg',
        scanNum: 13120
    }
]

const SCHOOL_ARTICLE_LIST = [
    {
        title: '中山大学',
        code: '10558',
        img: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3828847532,298230998&fm=26&gp=0.jpg',
        infos: [
            {
                title: '广东2020年关于做好军队院校招收普通高中毕业生工作的通知',
                author: '老夫子',
                scanNum: 2300
            },
            {
                title: '2020年广东高考将于23日放榜分数线下午公布',
                author: '凯',
                scanNum: 4312
            },
            {
                title: '广东文科600分以上考生可报考院校推荐',
                author: '高考网',
                image: '',
                scanNum: 8300
            }
        ]
    },
    {
        title: '华南理工大学',
        code: '10561',
        img: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3305662085,4086643105&fm=26&gp=0.jpg',
        infos: [
            {
                title: '广东2020年关于做好军队院校招收普通高中毕业生工作的通知',
                author: '老夫子',
                scanNum: 2300
            },
            {
                title: '2020年广东高考将于23日放榜分数线下午公布',
                author: '凯',
                scanNum: 4312
            },
            {
                title: '2020年广东省卫生健康委等四部门关于做好订单定向培养农村卫生人才工作的通知',
                author: '高考网',
                scanNum: 13120
            }
        ]
    }
]

const INTR_ARTICLE_LIST = [
    {
        name: '中山大学',
        desc: '广州 1924年 ',
        img: '/static/images/school/中山大学.png',
        type: '公立',
        category: '综合',
        level: '一本',
        nature: '985',
        code: '10558'
    },
    {
        name: '华南理工',
        desc: '广东 1952年 卓越大学联盟',
        img: '/static/images/school/华南理工.png',
        type: '公立',
        category: '综合',
        level: '一本',
        nature: '985',
        code: '10561'
    },
    {
        name: '北京师范大学珠海分校',
        desc: '广东 2001年',
        img: '/static/images/school/北京师范大学.png',
        type: '独立学院',
        category: '综合',
        level: '一本',
        code: '13177'
    },
    {
        name: '东莞理工学院',
        desc: '东莞 1992年 广东省高水平理工科大学',
        img: '/static/images/school/东莞理工学院.png',
        type: '公立',
        category: '理工',
        level: '一本',
        code: '11819'
    },
    {
        name: '广州中医药大学',
        desc: '广东 1992年 双一流',
        img: '/static/images/school/广州中医药大学.png',
        type: '公立',
        category: '医药',
        level: '一本',
        code: '10572'
    },
    {
        name: '佛山科学技术学院',
        desc: '佛山 1958年 广东省高水平理工科大学',
        img: '/static/images/school/佛山科学技术学院.png',
        type: '公立',
        category: '理工',
        level: '二本',
        code: '11847'
    },
    {
        name: '广东海洋大学',
        desc: '广东 1935年 省部共建大学',
        img: '/static/images/school/广东海洋大学.png',
        type: '公立',
        category: '农林',
        level: '二本',
        code: '10566'
    }
]

const PROFESSION_LIST = [
    { name: '哲学', code: '010101', category: '哲学', subject: '哲学类', degree: '哲学学士', education: '本科' },
    {
        name: '中国少数民族语言文学',
        code: '050104',
        category: '文学',
        subject: '中国语言文学类',
        degree: '文学学士',
        education: '本科',
        isHot: true
    },
    {
        name: '自然地理与资源环境',
        code: '070502',
        category: '理学',
        subject: '地理科学类',
        degree: '理学或管理学学士',
        education: '本科'
    }
]

export default {
    components: {
        Tabs,
        LineChart,
        NewsList: InfoList,
        SchoolNewsList: InfoList,
        SchoolIntrList: InfoList,
        ProfessionList: InfoList
    },
    mixins: [pageMixin],
    data() {
        const diffDay = dayjs(EXAM_DATE).diff(dayjs(), 'day')
        return {
            MAIN_BACK,
            mainTitle: `生活明朗，万物可爱`,
            diffDay: `--距离高考还有${diffDay}天--`,
            MONTH,
            indicatorDots: false,
            autoplay: false,
            duration: 500,
            swiperCurrent: 0,
            date: dayjs(),
            animationData: {},
            animationTimer: null,
            mainTopShow: true,

            updateTimer: null,

            newsList: ARTICLE_LIST,
            noMoreNews: false,

            schoolNewsList: SCHOOL_ARTICLE_LIST,
            noMoreSchoolNews: false,

            schoolIntrList: INTR_ARTICLE_LIST,
            noMoreSchoolIntr: false,

            professionList: PROFESSION_LIST,
            noMoreProfession: false
        }
    },
    async onLoad() {
        const res = await apiReq('/user/setUserInfo', {
            userName: 'yuzhen',
            sex: '0',
            phone: '13612817761'
        })

        console.log('-------', res)
    },
    onShow() {
        const animation = uni.createAnimation({
            duration: 300,
            timingFunction: 'ease-out'
        })

        this.animation = animation
        this.hideMainTips()
    },
    onHide() {
        this.animationTimer && clearTimeout(this.animationTimer)
        this.updateTimer && clearTimeout(this.updateTimer)
        interval && clearInterval(interval)
    },
    methods: {
        hideMainTips(timeout = 3000) {
            this.animationTimer && clearTimeout(this.animationTimer)
            this.animationTimer = setTimeout(() => {
                this.mainTopShow = false
                this.animation
                    .height(0)
                    .opacity(0)
                    .step()
                this.animationData = this.animation.export()
            }, timeout)
        },
        showMainTips() {
            if (this.mainTopShow) {
                this.hideMainTips(0)
                return
            }
            this.mainTopShow = true
            this.mainTitle = SCENTENCE[Math.floor(Math.random() * SCENTENCE.length)]
            this.animation
                .height('300rpx')
                .opacity(1)
                .step()
            this.animationData = this.animation.export()
        },
        updateNewsList(type) {
            this.updateTimer && clearTimeout(this.updateTimer)
            this.updateTimer = setTimeout(() => {
                this.updateTimer && clearTimeout(this.updateTimer)
                this.$refs.newsList.refreshFinish()
                if (type !== 'onBottom') {
                    this.noMoreNews = false
                    uni.showToast({ title: '已更新' })
                } else {
                    this.noMoreNews = true
                }
            }, 1000)
        },
        updateSchoolNewsList(type) {
            this.updateTimer && clearTimeout(this.updateTimer)
            this.updateTimer = setTimeout(() => {
                this.updateTimer && clearTimeout(this.updateTimer)
                this.$refs.schoolNewsList.refreshFinish()
                if (type !== 'onBottom') {
                    this.noMoreSchoolNews = false
                    uni.showToast({ title: '已更新' })
                } else {
                    this.noMoreSchoolNews = true
                }
            }, 1000)
        },
        updateSchoolIntrList(type) {
            this.updateTimer && clearTimeout(this.updateTimer)
            this.updateTimer = setTimeout(() => {
                this.updateTimer && clearTimeout(this.updateTimer)
                this.$refs.schoolIntrList.refreshFinish()
                if (type !== 'onBottom') {
                    this.noMoreSchoolIntr = false
                    uni.showToast({ title: '已更新' })
                } else {
                    this.noMoreSchoolIntr = true
                }
            }, 1000)
        },
        updateProfessionList(type) {
            this.updateTimer && clearTimeout(this.updateTimer)
            this.updateTimer = setTimeout(() => {
                this.updateTimer && clearTimeout(this.updateTimer)
                this.$refs.professionList.refreshFinish()
                if (type !== 'onBottom') {
                    this.noMoreProfession = false
                    uni.showToast({ title: '已更新' })
                } else {
                    this.noMoreProfession = true
                }
            }, 1000)
        },
        async getCode() {
            try {
                const { res } = await wxFunc('login')
                console.log('wxLogin', res)
                return ''
            } catch (e) {
                console.log('登录失败！' + JSON.stringify(e))
            }
        },
        tabClick({ item, index }) {
            // console.log('tabClick: ', { item, index })
            this.$scope.setData({
                swiperCurrent: index
            })
        },
        swiperChange(e) {
            // console.log('swiperChange', e.detail)
            const { current } = e.detail || {}
            this.swiperCurrent = current
            this.$refs.tabs.setCurrentTab(current)
        },
        // 触摸开始事件
        touchStart(e) {
            touchDotX = e.touches[0].pageX // 获取触摸时的原点
            touchDotY = e.touches[0].pageY
            // 使用js计时器记录时间
            interval = setInterval(() => {
                time++
            }, 100)
        },
        // 触摸结束事件
        touchEnd(e) {
            let touchMoveX = e.changedTouches[0].pageX
            let touchMoveY = e.changedTouches[0].pageY
            let tmX = touchMoveX - touchDotX
            let tmY = touchMoveY - touchDotY
            if (time < 20) {
                let absX = Math.abs(tmX)
                let absY = Math.abs(tmY)
                if (absX > 2 * absY) {
                    if (tmX < 0) {
                        console.log('左滑=====')
                    } else {
                        console.log('右滑=====')
                    }
                }
                if (absY > absX * 2 && tmY < 0) {
                    console.log('上滑动=====')
                    this.hideMainTips(0)
                }

                if (tmY > 300) {
                    console.log('下滑动=====')
                    // this.showMainTips(0)
                }
            }
            interval && clearInterval(interval) // 清除setInterval
            time = 0
        }
    }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
