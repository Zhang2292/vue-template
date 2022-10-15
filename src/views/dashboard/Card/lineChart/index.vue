<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import echarts from "echarts";
export default {
  mounted() {
    // 初始化echarts实例
    let lineCharts = echarts.init(this.$refs.charts)
    // 配置数据
    lineCharts.setOption({
      xAxis:{show: false,type:'category'},
      yAxis:{show: false},
      series:[
        {
          smooth: true,
          type: 'line',
          data:[66,27,66,32,88,77,69,47,21],
          itemStyle: {
            opacity: 0
          },
          lineStyle:{
            color:"purple"
          },
          areaStyle: {
            color:{
              type: "linear",
              x:0,
              y:0,
              X2:0,
              y2:1,
              colorStops:[
                {
                  offset: 0,
                  color: "purple"
                },
                {
                  offset: 1,
                  color: "#fff"
                }
              ],
              global: false,
            }
          }
        }
      ],
      grid:{
        left:10,
        top:0,
        right:0,
        bottom:10,
      }
    })
  },
}
</script>

<style scoped>
  .charts{
    width: 100%;
    height: 100%;
  }
</style>