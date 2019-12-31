import * as React from 'react';
import { Bar } from '@components/chart'
import { loadWebAssembly } from '@utils/util'

//柱状图数据
export const barOption = {
    color: ['#3398DB'],
    tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    yAxis: [
        {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
                alignWithLabel: true
            }
        }
    ],
    xAxis: [
        {
            type: 'value'
        }
    ],
    series: [
        {
            name: '平均响应时间',
            type: 'bar',
            barWidth: '60%',
            data: [10, 52, 200, 334, 390, 330, 220]
        }
    ]
};

export default class Radar extends React.PureComponent<any, any> {
    constructor(props: any) {
        super(props);
        let assem1 = loadWebAssembly("hello_wasm_bg.wasm");
        assem1.then(instance => {
            const { greet } = instance.exports;
            if(greet&&typeof(greet)=="function"){
                greet("222");
            }
            console.log("2", greet);
        })
        // const assem = import("../../wasm/pkg/hello_wasm.js");
        // assem.then(api => {
        //     api.greet("webassembly");
        //     console.log(api);
        // })
        // //console.log(assem1);
    }

    public render() {
        console.log(barOption);
        return (
            <div><Bar option={barOption} id={this} /></div>
        )
    }
}