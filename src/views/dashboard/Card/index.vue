<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <Detail title="总销售额" count="￥ 13424">
            <template slot="charts">
              <span>
                周同比  56.67%
                <svg style="width:10px; padding-top:5px;" t="1665405746810" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3056" width="16" height="16"><path d="M71.675 893.33l440.325-762.683 440.325 762.683z" p-id="3057" fill="#1afa29"></path></svg>
              </span>
              <span>
                日同比 19.97%
                <svg style="width:10px; padding-top:5px;" t="1665405729693" class="icon" viewBox="0 0 1369 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2751" width="16" height="16"><path d="M684.840764 1024L1369.681529 0H0z" p-id="2752" fill="#d81e06"></path></svg>
              </span>
            </template>
            <template slot="footer">
              <span>日销售额：￥ 1232</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="访问量" count="5432">
            <template slot="charts">
              <line-chart></line-chart>
            </template>
            <template slot="footer">
              <span>日访问量 1232</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="支付笔数" count="14334">
            <template slot="charts">
              <bar-chart></bar-chart>
            </template>
            <template slot="footer">
              <span>转化率 1232</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="运营活动效果" count="78%">
            <template slot="charts">
              <progress-chart></progress-chart>
            </template>
            <template slot="footer">
              <span>
                周同比  12%
                <svg style="width:10px; padding-top:5px;" t="1665405746810" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3056" width="16" height="16"><path d="M71.675 893.33l440.325-762.683 440.325 762.683z" p-id="3057" fill="#1afa29"></path></svg>
              </span>
              <span>
                日同比 11%
                <svg style="width:10px; padding-top:5px;" t="1665405729693" class="icon" viewBox="0 0 1369 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2751" width="16" height="16"><path d="M684.840764 1024L1369.681529 0H0z" p-id="2752" fill="#d81e06"></path></svg>
              </span>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from "./Detail";
import lineChart from "./lineChart";
import barChart from "./barChart";
import progressChart from "./progressChart";
export default {
  components:{
    Detail,
    lineChart,
    barChart,
    progressChart
  }
}
</script>

<style>

</style>