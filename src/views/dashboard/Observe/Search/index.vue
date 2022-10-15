<template>
  <el-card>
    <div slot="header" class="header">
      <div class="search-header">
        <span>线上热门搜索</span>
        <el-dropdown>
          <span>
            <i class="el-icon-more"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="12">
          <line-Charts></line-Charts>
        </el-col>
        <el-col :span="12">
          <line-Charts></line-Charts>
        </el-col>
      </el-row>
      <el-table size="mini" :data="tableData" border style="width: 100%; margin-top: 20px">
        <el-table-column label="排名" type="index" width="80"></el-table-column>
        <el-table-column label="搜索关键字" width="180"></el-table-column>
        <el-table-column label="用户数" width="160" sortable></el-table-column>
        <el-table-column label="周涨幅" width="width" sortable></el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        layout="prev, pager, next"
        :total="1000">
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
import lineCharts from "./lineCharts";
export default {
  data() {
    return {
      tableData: [{}],
    }
  },
  components: {
    lineCharts,
  }
}
</script>

<style scoped>
.search-header {
  display: flex;
  justify-content: space-between;
}
.header{
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}
.pagination{
  float: right;
}
</style>