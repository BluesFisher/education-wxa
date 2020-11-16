<template>
    <view class="page user-info">
        <view class="user-menu">
            <view class="base-menu-item" v-for="(item, index) in userMenu" :key="index">
                <view class="base-menu-label">{{ item.label }}</view>
                <picker
                    v-if="item.type === 'pickerDate'"
                    mode="date"
                    :value="item.value"
                    :end="nowDate"
                    :disabled="!isModify"
                    @change="bindUserMenuChange($event, item, index)"
                >
                    <text class="base-menu-value" :class="{ 'no-fill-data': !item.value }">{{
                        item.value || item.placeholder
                    }}</text>
                </picker>

                <view
                    v-else-if="item.type === 'image'"
                    class="user-info-icon"
                    @click="bindUserMenuChange($event, item, index)"
                >
                    <image mode="aspectFill" :src="item.value" alt="" />
                </view>

                <input
                    v-else-if="item.type === 'input'"
                    :placeholder="item.placeholder"
                    :value="item.value"
                    :disabled="!isModify"
                    @input="bindUserMenuChange($event, item, index)"
                />

                <picker
                    v-else-if="item.type === 'pcikerRegion'"
                    mode="region"
                    @change="bindRegionChange($event, item, index)"
                    :value="region"
                    :custom-item="customItem"
                    :disabled="!isModify"
                >
                    <text class="base-menu-value" :class="{ 'no-fill-data': !item.value }">
                        {{ item.value || item.placeholder }}
                    </text>
                </picker>

                <picker
                    v-else-if="item.type === 'pickerGender'"
                    @change="bindUserMenuChange(e, item, index)"
                    :range="item.range"
                    range-key="label"
                    :disabled="!isModify"
                >
                    <text class="base-menu-value" :class="{ 'no-fill-data': !item.value }">
                        {{ item.value || item.placeholder }}
                    </text>
                </picker>

                <view v-else class="base-menu-value" :class="{ 'no-fill-data': !item.value }">
                    {{ item.value || item.placeholder }}
                </view>
                <view v-if="isModify" class="down-arrow menu-arrow"></view>
            </view>
        </view>
        <view class="glb-btn-default modify-btn" @click="modifyClick">{{ isModify ? '保存' : '修改信息' }}</view>
    </view>
</template>

<style lang="scss" src="./index.scss"></style>

<script>
import pageMixin from '../../mixins/page'
import { mapState, mapMutations } from 'vuex'
import { GENDER_CODE } from '@/utils/globalConst'
import { wxFunc } from '../../utils/util.js'
import dayjs from 'dayjs'
const R = require('ramda')

const genderItems = [
    {
        value: '0',
        label: '女'
    },
    {
        value: '1',
        label: '男'
    }
]

const USER_MENU = [
    {
        label: '头像',
        value: '',
        code: 'photo',
        type: 'image'
    },
    {
        label: '昵称',
        value: '',
        code: 'userName',
        type: 'input',
        placeholder: '请输入'
    },
    {
        label: '性别',
        value: '',
        code: 'sex',
        range: genderItems,
        type: 'pickerGender',
        placeholder: '请选择'
    },
    {
        label: '所在地',
        value: '',
        code: 'locate',
        type: 'pcikerRegion',
        placeholder: '请选择'
    },
    {
        label: '我的生日',
        value: '',
        code: 'birthday',
        type: 'pickerDate',
        placeholder: '请选择'
    }
]
const ICON_INDEX = 0
const NICK_NAME_INDEX = 1
const GENDER_INDEX = 2

export default {
    mixins: [pageMixin],
    computed: {
        ...mapState({
            baseInfo: state => state.baseInfo || {}
        })
    },
    data() {
        return {
            userMenu: USER_MENU,
            nowDate: dayjs()
                .add(-1, 'day')
                .format('YYYY-MM-DD'),

            region: ['广东省', '深圳市', '南山区'],
            customItem: '全部',
            isModify: false,
            cacheUserInfo: {}
        }
    },
    mounted() {
        this.userMenu[GENDER_INDEX].value = GENDER_CODE[+this.baseInfo.gender || 0]
        this.userMenu[NICK_NAME_INDEX].value = this.baseInfo.nickName
        this.userMenu[ICON_INDEX].value = this.baseInfo.avatarUrl
    },
    methods: {
        bindUserMenuChange(e, item, index) {
            if (!this.isModify) return

            if (item.type === 'image') {
                this.chooseUserIcon(e, item, index)
                return
            }

            console.log(e)

            const { value } = e.target
            this.userMenu[index].value = item.range ? item.range[value].label : value
            let setBaseInfoValue = this.userMenu[index].value

            if (item.type === 'pickerGender') {
                setBaseInfoValue = this.userMenu[index].value === '女' ? 0 : 1
            }

            if (item.code) {
                let baseInfo = R.clone(this.baseInfo)
                baseInfo[item.code] = setBaseInfoValue
                this.$store.dispatch('setBaseInfo', baseInfo)
            }
        },
        bindRegionChange(e, item, index) {
            if (!this.isModify) return
            this.userMenu[index].value = e.target.value.join(' ')
        },
        async chooseUserIcon(e, item, index) {
            if (!this.isModify) return
            const { res } = await wxFunc('chooseImage', {
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera']
            })
            const tempFilePaths = res.tempFilePaths
            let baseInfo = R.clone(this.baseInfo)
            baseInfo.avatarUrl = tempFilePaths[0]

            this.$store.dispatch('setBaseInfo', baseInfo)
            this.userMenu[index].value = tempFilePaths[0]
        },
        async modifyClick() {
            if (!this.isModify) {
                this.cacheUserInfo = this.userMenu.map(item => ({ [item.code]: item.value }))
            } else {
                let userInfoObj = {}
                const aimUserInfo = this.userMenu.map(item => {
                    userInfoObj[item.code] = item.value
                    return { [item.code]: item.value }
                })
                if (JSON.stringify(this.cacheUserInfo) !== JSON.stringify(aimUserInfo)) {
                    uni.showLoading({
                        title: '更新中...'
                    })
                    const { code, data, msg } = await this.apiReq('/user/setUserInfo', userInfoObj)
                    uni.hideLoading()

                    if (code !== 0) {
                        uni.showToast({
                            title: `修改失败[${msg}(${code})]`,
                            icon: 'none'
                        })
                    }
                }
            }

            this.isModify = !this.isModify
        }
    }
}
</script>
