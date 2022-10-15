<template>
  <el-card>
    <div slot="header">
      <div class="category-header">
        <span>销售额类别占比</span>
        <el-radio-group v-model="value" size="mini">
          <el-radio-button label="全部渠道"></el-radio-button>
          <el-radio-button label="线上"></el-radio-button>
          <el-radio-button label="门店"></el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div>
      <div class="charts" ref="charts"></div>
    </div>
  </el-card>
</template>

<script>
import echarts from "echarts";
export default {
  data() {
    return {
      value: '全部渠道'
    }
  },
  mounted(){
    let myChart = echarts.init(this.$refs.charts)
    myChart.setOption({
      tooltip: {
        trigger: 'item'
      },
      title:{
        text:'',
        subtext: '',
        left: 'center',
        top: 'center',
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            position: 'outside',
          },
          labelLine: {
            show: true
          },
          data: [
            { value: 1048, name: '搜索引擎' },
            { value: 735, name: '直接访问' },
            { value: 580, name: '邮件营销' },
            { value: 484, name: '联盟广告' },
            { value: 300, name: '视频广告' }
          ]
        }
      ]
    })
    myChart.on("mouseover",(params)=>{
      const{name,value} = params.data
      myChart.setOption({
        title:{
          text:name,
          subText:'value'
        }
      })
    })
  }
}
</script>

<style scoped>
.category-header{
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}
.charts{
  width: 100%;
  height: 300px;
}
</style>