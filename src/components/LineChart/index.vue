<template>
    <view class="qiun-charts">
        <canvas canvas-id="ec-canvas" :id="canvasId" class="charts" @touchstart="touchLineA"></canvas>
    </view>
</template>

<script>
import uCharts from '@/js_sdk/u-charts/u-charts/u-charts.js'

let LineChart = null

export default {
    components: {},
    mixins: [],
    props: {
        lineData: {
            type: Object,
            default: () => ({
                categories: ['2010', '2012', '2014', '2016', '2018', '2020'],
                series: [
                    {
                        name: '广东',
                        data: [120, 150, 100, 180, 60, 130],
                        color: '#409eff'
                    }
                ],
                minValue: ''
            })
        }
    },
    data() {
        return {
            canvasId: 'ec-canvas',
            cWidth: '',
            cHeight: '',
            pixelRatio: 1
        }
    },
    watch: {
        lineData(val) {
            this.cWidth = uni.upx2px(670)
            this.cHeight = uni.upx2px(400)
            this.$nextTick(() => {
                this.showLineA(this.canvasId, val)
            })
        }
    },
    async mounted() {
        // uni.upx2px(750) 这是uni-app自带的自适应，以750的尺寸为基准。动态变化
        this.cWidth = uni.upx2px(670)
        this.cHeight = uni.upx2px(400)
        this.$nextTick(() => {
            this.showLineA(this.canvasId, this.lineData)
        })
    },
    methods: {
        // 展示图标的函数 接收参数，一个块的id,一个数据
        showLineA(canvasId, chartData) {
            LineChart = new uCharts({
                $this: this,
                canvasId,
                // 图标类型
                type: 'line',
                fontSize: 11,
                legend: { show: true },
                dataLabel: false,
                dataPointShape: true,
                background: '#FFFFFF',
                pixelRatio: this.pixelRatio,
                categories: chartData.categories,
                series: chartData.series,
                animation: true,
                // x轴显示的内容
                xAxis: {
                    type: 'grid',
                    gridColor: 'transparent',
                    gridType: 'dash',
                    dashLength: 8
                },
                // y轴显示的内容
                yAxis: {
                    gridType: 'dash',
                    gridColor: '#CCCCCC',
                    dashLength: 8,
                    splitNumber: 5,
                    min: chartData.minValue - 50,
                    // max: 180,
                    format: (val) => {
                        return val.toFixed(0)
                    }
                },
                width: this.cWidth * this.pixelRatio,
                height: this.cHeight * this.pixelRatio,
                extra: {
                    line: {
                        type: 'straight'
                    }
                }
            })
        },
        // 点击图表显示的内容
        touchLineA(e) {
            // 使用声明的变量canvaLineA
            LineChart.showToolTip(e, {
                format: (item, category) => {
                    return `${category} ${item.name}:  ${item.data}分`
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
/*样式的width和height一定要与定义的cWidth和cHeight相对应*/
.qiun-charts {
    width: 100%;
    height: 400upx;
    background-color: #ffffff;
}

.charts {
    width: 100%;
    height: 400upx;
    background-color: #ffffff;
}
</style>
