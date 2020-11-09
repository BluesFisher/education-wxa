
<template>
    <view class="page">
        <view class="school-img">
            <swiper class="swiper" :indicator-dots="indicatorDots" :circular="true" :autoplay="autoplay"
                :interval="interval" :duration="duration" indicator-color="#999"
                indicator-active-color="rgba(255,255,255,.8)">
                <swiper-item v-for="item in schoolImg" :key="item" class="swiper-item">
                    <image :src="item" mode="scaleToFill" lazy-load="true" />
                </swiper-item>
            </swiper>
        </view>
        <view class="school-info base-container">
            <view class="school-info-name">{{school.name}}<text class="title-tips" v-if="school.engName">{{school.engName}}</text></view>
            <view class="school-info-motto" v-if="school.motto">{{school.motto}}</view>
            <view class="intr-item-note">
                <text class="intr-item-nature" v-if="school.nature">{{school.nature}}</text>
                <text class="intr-item-type" v-if="school.level">{{school.level}}</text>
                <text class="intr-item-category" v-if="school.category">{{school.category}}</text>
            </view>
            <view class="school-info-detail">
                <view v-for="(item, index) in baseInfo" :key="index" class="school-info-item">
                    <view class="school-info-label">{{item.label}}</view>
                    <text class="school-info-value">{{item.value || '--'}}</text>
                </view>
            </view>
        </view>

        <view class="base-container">
            <view class="base-title">学校简介<text class="title-from" v-if="school.intrFrom">来源：{{school.intrFrom}}</text></view>
            <text class="school-intr">{{school.intr}}</text>
        </view>

        <view class="base-container">
            <view class="base-title">历年分数线</view>
            <LineChart :lineData="lineData" />
        </view>

        <view class="base-container">
            <view class="base-title">学校推荐</view>
            <view class="recommend-swiper">
                <view class="recommend-swiper-content">
                    <view v-for="item in recommendSchool" :key="item.code" class="recommend-swiper-item">
                        <image :src="item.img" mode="scaleToFill" lazy-load="true" />
                        <view class="recommend-swiper-name">{{item.name}}</view>
                    </view>
                </view>

            </view>
        </view>
    </view>
</template>

<script>
import pageMixin from '../../mixins/page'
import LineChart from '@/components/LineChart'

const SCHOOL_IMG = [
    'https://bkimg.cdn.bcebos.com/pic/3b292df5e0fe992596ab36d131a85edf8cb1718f?x-bce-process=image/resize,m_lfit,w_790,limit_1',
    'https://bkimg.cdn.bcebos.com/pic/08f790529822720eb0c0a2f475cb0a46f21fabb6?x-bce-process=image/resize,m_fill,w_640,h_360,align_0,limit_0',
    'https://bkimg.cdn.bcebos.com/pic/cefc1e178a82b9014a90d44bbbc5be773912b31b4138'
]

const BASE_INFO = [
    { label: '创办时间', value: '1924年（甲子年）' },
    { label: '属性', value: '双一流（世界一流大学建设高校A类）、211工程、985工程、全国重点大学、珠峰计划等' },
    { label: '主管部门', value: '中华人民共和国教育部' },
    { label: '办学性质', value: '公立大学' },
    { label: '学校类别', value: '综合' },
    { label: '院系设置', value: '49个学院、8个系部' },
    { label: '本科专业', value: '132个' },
    { label: '硕士点', value: '学术学位授权一级学科59个\n学术学位授权二级学科4个（不含一级学科覆盖）' },
    { label: '博士点', value: '学术学位授权一级学科49个' },
    { label: '热门专业', value: '生态学，汉语学' }
]

const LINE_DATA = {
    categories: ['2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019'],
    series: [
        {
            name: '理科',
            data: [590, 610, 607, 615, 641, 603, 581, 607, 595],
            color: '#2ac5d9'
        },

        {
            name: '文科',
            data: [596, 601, 610, 622, 615, 577, 590, 612, 607],
            color: '#ffa726'
        }
    ],
    minValue: 577
}

const RECOMEND_SCHOOL = [
    {
        name: '华南理工',
        code: '10561',
        img: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3305662085,4086643105&fm=26&gp=0.jpg'
    },
    {
        name: '华南师范大学',
        code: '10574',
        img:
            'https://bkimg.cdn.bcebos.com/pic/d000baa1cd11728b2b6be950c2fcc3cec3fd2c79?x-bce-process=image/resize,m_fill,w_640,h_360,align_0,limit_0'
    },
    {
        name: '暨南大学',
        code: '10559',
        img:
            'https://bkimg.cdn.bcebos.com/pic/7aec54e736d12f2ec68e674448c2d5628535680f?x-bce-process=image/resize,m_lfit,w_220,limit_1'
    }
]

export default {
    components: { LineChart },
    mixins: [pageMixin],
    data() {
        return {
            indicatorDots: true,
            autoplay: true,
            interval: 5000,
            duration: 500,

            school: {
                name: '中山大学',
                code: '10558',
                engName: 'Sun Yat-sen University (SYSU)',
                motto: '博学 审问 慎思 明辨 笃行',
                nature: '985',
                level: '一本',
                category: '综合',
                intrFrom: '百度百科',
                intr:
                    '中山大学（Sun Yat-sen University, SYSU），简称“中大”，由中华人民共和国教育部直属，是教育部、国家国防科技工业局和广东省共建的综合性全国重点大学，位列首批国家“双一流”A类、“985工程”、“211工程”，入选国家“珠峰计划”、“111计划”、“2011计划”、卓越法律人才教育培养计划、卓越医生教育培养计划、国家大学生创新性实验计划、国家级大学生创新创业训练计划、国家建设高水平大学公派研究生项目、新工科研究与实践项目、中国政府奖学金来华留学生接收院校、全国深化创新创业教育改革示范高校、国家大学生文化素质教育基地、国家创新人才培养示范基地、国家国际科技合作基地、首批高等学校科技成果转化和技术转移基地、学位授权自主审核单位等，是中国高校行星科学联盟、中国人工智能教育联席会、粤港澳高校联盟、粤港澳大湾区物流与供应链创新联成员。\n1924年，孙中山先生亲手将广州地区多所高校整合创立国立广东大学。学校于1926年定名为国立中山大学。今日的中山大学，由1952年院系调整后分设的中山大学和中山医科大学于2001年10月合并而成。\n截至2019年9月，中山大学由广州校区、珠海校区、深圳校区三个校区、五个校园及十家附属医院组成；开设132个本科专业；有博士后科研流动站41个，一级学科博士学位授权点49个，一级学科硕士学位授权点59个；有专业学位类别37种；有全日制学生53789人，其中本科生32160人，硕士研究生14463人，博士研究生7166人；有专任教师4028人。'
            },
            schoolImg: SCHOOL_IMG,
            baseInfo: BASE_INFO,
            lineData: LINE_DATA,
            recommendSchool: RECOMEND_SCHOOL
        }
    },
    async onLoad() {},
    methods: {}
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
