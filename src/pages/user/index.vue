<template>
    <view class="page user-center">
        <view class="user-detail-header" @click="goUserInfoPage" :style="{ background: themeColor }">
            <image
                mode="aspectFill"
                class="user-icon"
                :src="baseInfo.avatarUrl || DEFAULT_ICON"
                alt=""
                @click.stop="bindUserIcon"
            />
            <button
                class="login-btn"
                v-if="!baseInfo || !baseInfo.nickName"
                @getuserinfo="bindGetWxUserInfo"
                open-type="getUserInfo"
            >
                登录/注册
            </button>
            <view v-else class="user-detail-info">
                <view class="user-name">{{ baseInfo.nickName }}</view>
                <view class="user-level">Lv1</view>
            </view>
            <image class="user-config" :src="BACK_ICON" alt="" />
        </view>
        <view class="user-base-operate">
            <view
                class="base-operate-item"
                v-for="(item, index) in baseOperate"
                :key="index"
                @click="bindOperate(item)"
            >
                <view class="base-operate-label">{{ item.label }}</view>
                <view class="base-operate-value">{{ item.value }}</view>
            </view>
        </view>

        <view class="user-menu">
            <view
                v-for="(item, index) in userMenu"
                :key="index"
                @click="bindOperate"
                :class="['base-menu-item', item.needBottom ? 'base-border-bottom' : '']"
            >
                <view class="base-menu-label">{{ item.label }}</view>
                <button v-if="item.type === 'openBtn'" :open-type="item.openType" @getphonenumber="bindgetphonenumber">
                    {{ item.value }}
                </button>
                <view class="down-arrow menu-arrow"></view>
            </view>
        </view>
    </view>
</template>

<script>
import pageMixin from '../../mixins/page'
import { wxFunc } from '../../utils/util.js'
import { GENDER_CODE } from '@/utils/globalConst.js'
import { mapState, mapMutations } from 'vuex'

import BACK_ICON from '@/static/images/common/back.png'
import DEFAULT_ICON from '@/static/images/common/default-user.png'

const BASE_OPERATE = [
    {
        label: '我的学校',
        icon: '',
        value: 1,
        url: ''
    },
    {
        label: '关注',
        icon: '',
        value: 2,
        url: ''
    },
    {
        label: '粉丝',
        icon: '',
        value: 12,
        url: ''
    },
    {
        label: '积分',
        icon: '',
        value: 20,
        url: ''
    }
]

const USER_MENU = [
    {
        label: '我的文章'
    },
    {
        label: '我的收藏',
        url: '',
        needBottom: true
    },
    {
        label: '绑定手机号',
        value: '13612817762',
        type: 'openBtn',
        openType: 'getPhoneNumber'
    },
    {
        label: '意见反馈',
        url: 'http://49.235.100.196:3001/feedback' // '/pages/feedback/feedback'
    },
    {
        label: '关于我们'
    },
    {
        label: '隐私政策'
    }
]

export default {
    components: {},
    mixins: [pageMixin],
    data() {
        return {
            BACK_ICON,
            DEFAULT_ICON,
            baseOperate: BASE_OPERATE,
            userMenu: USER_MENU,
            themeColor: ''
        }
    },
    async onLoad() {
        this.getUserInfo()
    },
    computed: {
        ...mapState({
            baseInfo: state => state.baseInfo || {}
        })
    },
    methods: {
        async getUserInfo() {
            const { code, data } = await this.apiReq('/user/getUserInfo')
            console.log('getUserInfo', code, data)
            if (code === 0 && data) {
                this.$store.dispatch('setBaseInfo', data)
            }
        },
        async goUserInfoPage() {
            if (!this.baseInfo || !this.baseInfo.nickName) return

            uni.navigateTo({
                url: '/pages/userInfo/index'
            })
        },
        async bindGetWxUserInfo(e) {
            uni.showLoading({
                title: '请稍后...'
            })
            const { rawData } = e.detail

            if (rawData && rawData !== JSON.stringify(this.baseInfo)) {
                const userInfo = JSON.parse(rawData)
                const { avatarUrl, gender, nickName } = userInfo
                this.$store.dispatch('setBaseInfo', {
                    ...userInfo,
                    photo: avatarUrl,
                    sex: `${gender}`,
                    userName: nickName
                })

                await wxFunc('setStorage', {
                    key: 'rawData',
                    data: rawData
                })
                uni.showToast({
                    title: '登录/注册成功',
                    duration: 2000,
                    icon: 'none'
                })
            }
            uni.hideLoading()
        },
        async bindUserIcon() {
            try {
                await wxFunc('previewImage', {
                    current: this.baseInfo.avatarUrl,
                    urls: [this.baseInfo.avatarUrl]
                })
            } catch (error) {
                uni.showToast({
                    title: '预览失败',
                    duration: 2000,
                    icon: 'none'
                })
            }
        },
        bindOperate(item) {
            if (item.url) {
                if (item.url.startsWith('http')) {
                    // CommonFunc.gotoWebViewPage(item.url);
                    return
                }
                // wepy.navigateTo({
                //     url: item.url
                // });
            }
        },
        bindgetphonenumber(e) {
            console.log(e)
        }
    }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
