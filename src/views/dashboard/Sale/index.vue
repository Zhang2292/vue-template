<template>
  <el-card class="box-card" style="margin-top: 10px">
    <div slot="header" class="clearfix">
      <!-- @tab-click="handleClick" -->
      <el-tabs class="tab" v-model="activeName" >
        <el-tab-pane label="用户管理" name="sale"></el-tab-pane>
        <el-tab-pane label="配置管理" name="visits"></el-tab-pane>
      </el-tabs>
      <div class="right">
        <span style="cursor:pointer;" @click="setDay">今日</span>
        <span style="cursor:pointer;" @click="setWeek">本周</span>
        <span style="cursor:pointer;" @click="setMonth">本月</span>
        <span style="cursor:pointer;" @click="setYear">今年</span>
        <el-date-picker
          v-model="date"
          class="date"
          size="mini"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="18">
          <div class="charts" ref="charts"></div>
        </el-col>
        <el-col :span="6">
          <h3 style="margin: 0px 0px 20px 0px;">门店{{title}}排名</h3>
          <ul>
            <li>
              <span class="rinDex">1</span>
              <span>肯德基</span>
              <span class="rValue">323.234</span>
            </li>
            <li>
              <span class="rinDex">2</span>
              <span>麦当劳</span>
              <span class="rValue">299.132</span>
            </li>
            <li>
              <span class="rinDex">3</span>
              <span>正新鸡排</span>
              <span class="rValue">283.998</span>
            </li>
            <li>
              <span class="rMargin">4</span>
              <span>海底捞</span>
              <span class="rValue">266.233</span>
            </li>
            <li>
              <span class="rMargin">5</span>
              <span>西贝素面村</span>
              <span class="rValue">223.445</span>
            </li>
            <li>
              <span class="rMargin">6</span>
              <span>汉堡王</span>
              <span class="rValue">218.663</span>
            </li>
            <li>
              <span class="rMargin">7</span>
              <span>真功夫</span>
              <span class="rValue">200.997</span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
// 引入echarts
import echarts from "echarts";
// 引入dayjs
import dayjs from "dayjs";
import {mapState} from "vuex";
export default {
  data() {
    return {
      activeName: "sale",
      lineCharts:null,
      date: '',
    }
  },
  mounted() {
    this.lineCharts = echarts.init(this.$refs.charts)
  },
  computed: {
    title(){
      return this.activeName=='sale'?'销售额':'访问量'
    },
    ...mapState({
      listState:state=>state.home.list
    })
  },
  watch: {
    title(){
      this.lineCharts.setOption({
        title:{
          text:  this.title+"趋势"
        },
        xAxis:{
          data:this.title=="销售额"?this.listState.orderFullYearAxis:this.listState.userFullYearAxis
        },
        series:[
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            data: this.title=='销售额'?this.listState.orderFullYear:this.listState.userFullYear,
            color: 'yellowgreen',
          }
        ]
      })
    },
    listState(){
      this.lineCharts.setOption({
        title:{
          text: this.title+"趋势",
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data:this.listState.orderFullYearAxis,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            data: this.listState.orderFullYear,
            color: 'yellowgreen',
          }
        ]
      })
    }
  },
  methods: {
    setDay(){
      const day = dayjs().format('YYYY-MM-DD')
      this.date = [day,day]
    },
    setWeek(){
      const start = dayjs().day(1).format('YYYY-MM-DD')
      const end = dayjs().day(7).format('YYYY-MM-DD')
      this.date = [start, end]
    },
    setMonth(){
      const start = dayjs().startOf('month').format('YYYY-MM-DD')
      const end = dayjs().endOf('month').format('YYYY-MM-DD')
      this.date = [start, end]
    },
    setYear(){
      const start = dayjs().startOf('year').format('YYYY-MM-DD')
      const end = dayjs().endOf('year').format('YYYY-MM-DD')
      this.date = [start, end]
    }
  },
}
</script>

<style scoped>
.clearfix{
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tab{
  width: 100%;
}
.right{
  position: absolute;
  right: 0;
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}
.right span{
  margin-left: 8px;
}

.date{
  margin-left: 10px;
  width: 220px !important;
}
.charts{
  width: 100%;
  height: 300px;
}
ul{
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0px;
}
ul li{
  height: 20px;
  margin: 10px 0px;
}
.rinDex{
  float: left;
  display: block;
  width: 15px;
  height: 15px;
  font-size: 13px;
  margin-right: 20px;
  border-radius: 50%;
  background: black;
  color: white;
  text-align: center;
  text-align: center;
}
.rMargin{
  text-align: center;
  font-size: 13px;
  margin-left: 4px;
  margin-right: 25px;
}
.rValue{
  float: right;
}
</style>