/**
 * 雷达图
 */


import * as React from 'react';
import * as echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/chart/radar';

export default class Radar extends React.PureComponent<any, any> {

    chart: any;
    id: any;

    constructor(props: any) {
        super(props)
        this.initChart = this.initChart.bind(this);
    }


    /**
     * 初始化图形
     */
    initChart() {
        const { option = {} } = this.props //外部传入的data数据
        console.log(option);

        // 只创建一个对象
        if (!this.chart) {
            this.chart = echarts.init(this.id) //初始化echarts
            this.chart.on('click', this.props.onClick);
        }

        let myChart = this.chart;

        //设置options
        myChart.setOption(option);

        window.onresize = function () {
            myChart.resize()
        }
    }

    

    /**
     * 
     */
    componentDidUpdate() {
        this.initChart()
    }

    /**
     * 输出
     */
    render() {
        const { width = "100%", height = '200px' } = this.props
        return <div ref={id => this.id = id} style={{ width, height }}></div>
    }
}