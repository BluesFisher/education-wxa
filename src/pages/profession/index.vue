
<template>
    <view class="page">
        <view class="base-container profession-title">
            <view class="base-title">
                <view>{{profession.name}}</view>
                <view class="profession-tag">
                    <view v-for="(item, index) in profession.label" :key="index" class="intr-item-note">
                        <text class="intr-item-category">{{item}}</text>
                    </view>
                </view>
            </view>

            <view class="profession-info-detail">
                <view v-for="(item, index) in profession.baseInfo" :key="index" class="profession-info-item">
                    <view class="profession-info-label">{{item.label}}：</view>
                    <text class="profession-info-value">{{item.value || '--'}}</text>
                </view>
            </view>
        </view>

        <view class="base-container profession-detail">
            <text class="base-title">教学实践</text>
            <text class="profession-detail-value">{{profession.education}}</text>
        </view>

        <view class="base-container profession-detail">
            <text class="base-title">培养目标</text>
            <text class="profession-detail-value">{{profession.aim}}</text>
        </view>

        <view class="base-container profession-detail">
            <text class="base-title">培养要求</text>
            <text class="profession-detail-value">{{profession.require}}</text>
        </view>

        <view class="base-container profession-detail">
            <text class="base-title">就业方向</text>
            <text class="profession-detail-value">{{profession.work}}</text>
        </view>
    </view>
</template>

<script>
import pageMixin from '../../mixins/page'

export default {
    components: {},
    mixins: [pageMixin],
    data() {
        return {
            profession: {
                name: '哲学',
                label: ['哲学', '哲学类', '哲学学士', '本科'],
                baseInfo: [
                    { label: '开设高校数量', value: '75所' },
                    { label: '主干学科', value: '哲学' },
                    {
                        label: '主要课程',
                        value:
                            '哲学概论、马克思主义哲学原理、马克思主义哲学史、中国哲学史、西方哲学史、现代西方哲学、科学技术哲学、伦理学、宗教学、美学、逻辑学、心理学、中外哲学原著导读、马克思主义哲学原著导读等。'
                    }
                ],
                education: '包括社会实习、社会调查、社会公益活动等，一般安排10周左右。',
                aim:
                    '本专业培养具有一定马克思主义哲学理论素养和系统的专业基础知识，有进一步培养潜质的哲学专门人才，以及能在国家机关、文教事业、新闻出版、企业等部门从事实际工作的应用型、复合型高级专门人才。',
                require:
                    '本专业学生主要学习马克思主义的基本理论与历史，以及社会科学，自然科学和思维科学的基础知识，受到中西方哲学的基本理论和发展线索的系统教育，以及创造性思维的培养和业务能力的训练。',
                work:
                    '1．比较系统地掌握马克思主义哲学、中国哲学和西方哲学的理论和历史；\n2．具有一定的社会科学、人文科学。自然科学、思维科学的相关知识；\n3．掌握哲学学科的基本研究方法、治学方法和相应的社会调查能力；\n4．了解国内外哲学界最重要的理论前沿和发展动态；\n5．了解国内外最重大的实践问题和发展动态；\n6．具有分析和解决社会现实问题的初步能力。'
            }
        }
    },
    async onLoad() {},
    methods: {}
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
