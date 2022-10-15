<template>
  <div>
    <!-- 表格 -->
    <el-table border style="width: 100%" :data="records">
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width"></el-table-column>
      <el-table-column prop="prop" label="默认图片" width="110">
        <template slot-scope="{row}">
          <img :src="row.skuDefaultImg" style="width:80px;height:80px">
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(KG)" width="80"></el-table-column>
      <el-table-column prop="price" label="价格(元)" width="80"></el-table-column>
      <el-table-column prop="prop" label="操作" width="300">
        <template slot-scope="{row,$index}">
          <el-button type="success" icon="el-icon-bottom" size="mini" @click="sale(row)" v-if="row.isSale==0"></el-button>
          <el-button type="info" icon="el-icon-top" size="mini" @click="cancel(row)" v-else></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit"></el-button>
          <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuInfo(row)"></el-button>
          <el-popconfirm :title="`你确定删除: ${row.skuName}吗？`" style="margin-left:10px" @onConfirm="deleteRow($index)">
            <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      @current-change="handleExpandChange"
      @size-change="handleSizeChange"
      style="text-align:center"
      layout="prev, pager, next, jumper, ->, sizes, total" 
      :current-page="page"
      :page-size="limit"
      :page-sizes="[3,5,10]"
      :total="total"
    >
    </el-pagination>
    <!-- 抽屉效果 -->
    <el-drawer :visible.sync="drawer" :show-close="false" size="45%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{skuInfo.skuName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{skuInfo.price}}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag style="margin-right: 10px;" type="success" v-for="attr in skuInfo.skuAttrValueList" :key="attr.id">
            {{attr.attrId}}——{{attr.valueId}}
          </el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="500px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" alt="" style="width:100%">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      page: 1,  //当前第几页
      limit: 10,  //当前页面有几条数据
      records: [],    //存储SKU列表的数据
      total: 0,   // 一共多少条数据
      skuInfo: {},  // 存储sku详情
      drawer: false,  // 控制抽屉效果显示隐藏
    }
  },
  mounted() {
    // 获取sku列表的方法
    this.getSkuList()
  },
  methods: {
    // 获取接口
    async getSkuList(){
      // 解构出默认的参数
      const {page,limit} = this
      let result = await this.$API.sku.reqSkuAll(page, limit)
      if (result.code == 200) {
        this.records = result.data.records
        this.total = result.data.total
      }
    },
    // 当前分页器是第几页
    handleExpandChange(pager) {
      this.page = pager;
      this.getSkuList();
    },
    // 当分页器某一页需要展示数据条数发生变化的时候会触发
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSkuList();
    },
    // 上架
    async sale(row){
      console.log(row);
      let result = await this.$API.sku.reqSale(row.id)
      if(result.code == 200){
        row.isSale = 1
        this.$message({type: "success" ,message: "上架成功"})
      }
    },
    // 下架
    async cancel(row){
      let result = await this.$API.sku.reqCancel(row.id)
      if(result.code == 200){
        row.isSale = 0
        this.$message({type: "info" ,message: "下架成功"})
      }
    },
    edit(){
      this.$message("正在开发中")
    },
    // 获取sku详情的方法
    async getSkuInfo(sku){
      this.drawer = true
      let result = await this.$API.sku.reqSkuById(sku.id)
      if (result.code == 200) {
        this.skuInfo = result.data
      }
    },
    // 删除
    deleteRow(index){
      this.records.splice(index, 1)
    },
  },
}
</script>

<style scoped>
  .el-row .el-col-5{
    font-size: 18px;
    text-align: right;
    font-weight: bold;
  }
  .el-col{
    margin: 10px;
  }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }
</style>