<template>
  <div>
    <div class="header">
      <span class="search-header">搜索用户数</span>
      <i class="el-icon-warning-outline"></i>
    </div>
    <div class="main">
      <span class="main-title">12321</span>
      <span class="main-content">17.1</span>
      <i class="el-icon-caret-top" style="color: greenyellow"></i>
      <i class="el-icon-caret-bottom" style="color: red"></i>
    </div>
    <div class="footer">
      <div class="charts" ref="charts"></div>
    </div>
  </div>
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
            color:"blue"
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
                  color: "blue"
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
.header {
  display: flex;
  align-items: center;
}
.search-header{
  margin-right: 20px;
  font-size: 14px;
  color: #d9d9d9;
}
.el-icon-warning-outline{
  font-size: 12px;
}
.main{
  margin: 10px 0px;
}
.main-title{
  margin-right: 30px;
  font-size: 18px;
}
.main-content{
  font-size: 1px;
}
.charts{
  width: 100%;
  height: 50px;
}
</style>