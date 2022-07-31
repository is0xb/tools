<template>
  <div class="time-data-chart">
    <div class="data-input">
      <el-input v-model="dataText" placeholder="请输入tab分隔的数据文本  name\tdate\value" type="textarea"></el-input>
    </div>
    <div>
      <el-button type="primary" @click="handleDealText">解析生成</el-button>
    </div>
    <div class="chart-render" ref="chartContainer"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, VNodeRef, watch } from 'vue';
import { init as echartsInit, EChartsOption, ECharts, SeriesOption } from "echarts";


const dataText = ref('');
const dataList = ref<[string, string, string | number][]>([]);
const chartContainer = ref<null | VNodeRef>(null);
let echartsInstance: ECharts | null = null
const echartsOptions = ref<null | EChartsOption>(null)

onMounted(() => {
  if (chartContainer.value) {
    echartsInstance = echartsInit(chartContainer.value, undefined, {
      // devicePixelRatio: 1,
      // renderer: 'canvas',
      // useDirtyRect: false,
      // width: undefined,
      // height: undefined,
      locale: 'ZH'
    })
  }
})

watch(echartsOptions, (newVal) => {
  if (echartsInstance) {
    echartsInstance.setOption((newVal) as EChartsOption, { notMerge: true })
  }
})

function handleDealText() {
  if (!dataText.value) return
  const result: EChartsOption = {
    tooltip: { show: true },
    legend: { show: true },
    xAxis: [{
      type: 'time',
      axisPointer: { show: true, type: 'line', snap: true }
    }],
    yAxis: {
      type: 'value'
    },
    labelLayout: {
      hideOverlap: true
    },
    series: []
  }

  const list = dataText.value.split('\n').filter(line => !!line).map(line => {
    return line && line.split('\t')
  }).filter(row => row.length >= 3).filter(item => !!item[0])

  dataList.value = list as [string, string, string][];

  const seriesSets = new Set(list.map(row => row[0]));

  if (!seriesSets.size) {
    return
  }

  seriesSets.forEach(name => {
    (result.series as SeriesOption[]).push({
      name,
      data: list.filter(item => item[0] === name).map(item => item.slice(1)),
      type: 'line',
      label: { show: true },
      dimensions: [{ type: 'time' }, { type: 'number', name: 'value' }]
    })
  })

  echartsOptions.value = result;

  // 如果echarts实例没有初始化则重新初始化wcharts实例
  if (!echartsInstance) {
    echartsInstance = echartsInit(chartContainer.value)
  }
}

</script>


<style lang="less">
.time-data-chart {
  .chart-render {
    width: 100%;
    height: 500px;
  }
}
</style>
