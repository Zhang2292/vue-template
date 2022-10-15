<template>
  <div>
    <el-card style="margin:20px 0px">
      <category-select @getCategoryId="getCategoryId" :show="scene!=0"></category-select>
    </el-card>
    <el-card>
      <!-- 底部这里将来是有三部分进行切换 -->
      <div v-show="scene==0">
        <!-- 展示SPU列表的结构 -->
        <el-button type="primary" icon="el-icon-plus" style="margin-bottom: 20px;" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
        <!-- 表格数据 -->
        <el-table style="width: 100%;" border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="spu描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row}">
              <hint-button type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)"></hint-button>
              <hint-button type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updateSpu(row)"></hint-button>
              <hint-button type="info" icon="el-icon-info" size="mini" title="查看spu全部sku列表" @click="handler(row)"></hint-button>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                <hint-button slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除spu"></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器数据 -->
        <el-pagination
          style="text-align:center"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="page"
          :page-sizes="[3,5,10]"
          :page-size="limit"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="total">
        </el-pagination>
        <!-- 对话框 -->
        <el-dialog :before-close="close" :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible">
          <el-table :data="skuList" style="width:100%;" border v-loading="loading">
            <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
            <el-table-column prop="price" label="价格" width="width"></el-table-column>
            <el-table-column prop="weight" label="重量" width="width"></el-table-column>
            <el-table-column label="默认图片" width="width">
              <template slot-scope="{row}">
                <img :src="row.skuDefaultImg" style="width:100px;height:100px">
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>
      </div>
      <spu-form v-show="scene==1" @changeScene="changeScene" ref="spu">添加SPU|修改SPU</spu-form>
      <sku-form v-show="scene==2" ref="sku" @changeScenes="changeScenes">添加SKU</sku-form>
    </el-card>
  </div>
</template>

<script>
import SkuForm from "./SkuForm";
import SpuForm from "./SpuForm";
export default {
  name: 'Spu',
  data() {
    return {
      // 分类的id
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 控制三级联动的可操作性
      page: 1,  // 分页器当前第几页
      limit: 3,   // 每一页需要找是多少条数据
      records: [],   // spu列表的数据
      total: 0,  // 分页器一共需要展示数据的条数
      scene: 0,   // 0：代表展示SPU列表数据  1：代表添加SPU|修改SPU  2：代表添加SKU
      dialogTableVisible: false,    //控制点击查看sku按钮
      spu: {},
      skuList: [],    // 存储的是SKU列表的数据
      loading: true,  // 饿了么加载
    }
  },
  components: {
    SkuForm,
    SpuForm
  },
  methods: {
    // 点击分页器的第几页按钮的回调
    handleCurrentChange(page){
      this.page = page;
      this.getAttrList()
    },
    // 但分页器的某一个展示数据条数发生改变
    handleSizeChange(limit){
      this.limit = limit;
      this.getAttrList()
    },
    // 三级联动的自定义事件，可以把子组件的相应的id传递给父组件
    getCategoryId({ categoryId, level }) {
      // 区分三级费雷相应的id，以及父组件进行存储
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        // 代表三级分类的id有了
        this.category3Id = categoryId;
        // 发请求获取品牌属性
        this.getAttrList();
      }
    },
    // 获取SPU列表数据的方法
    async getAttrList(){
      const { page,limit,category3Id} = this
      // 携带三个参数：page,limit,this.category3Id
      let result = await this.$API.spu.reqPuList(page,limit,category3Id)
      if(result.code == 200){
        this.total = result.data.total
        this.records = result.data.records
      }
    },
    // 添加Spu按钮的回调
    addSpu(){
      this.scene=1
      // 通知子组件SpuForm发请求---两个
      this.$refs.spu.addSpuData(this.category3Id)
    },
    // 修改按钮的
    updateSpu(row){
      this.scene=1
      // 获取子组件SouForm
      // 使用$ref获取子组件
      this.$refs.spu.initSpuData(row)
    },
    // 自定义事件回调 （SpuForm）
    changeScene({scene,flag}){
      // flag这个形参是为了区分保存按钮与修改按钮
      this.scene = scene
      // 子组件通知父组件切花场景,需再次获取数据进行更新
      if(flag=='修改'){
        this.getAttrList()
      }else{
        this.getAttrList(this.page=1)
      }
    },
    // 删除按钮
    async deleteSpu( row ){
      let result = await this.$API.spu.reqDeleteSpu(row.id)
      if (result.code == 200) {
        // 提示
        this.$message({type: 'success',message:'删除成功'})
        // 在调用接口
        this.getAttrList()
      }
    },
    // 添加Sku按钮
    addSku(row){
      this.scene=2
      // 通知子组件SkuForm发请求
      this.$refs.sku.getData(this.category1Id,this.category2Id,row)
    },
    // skuForm通知父组件修改场景
    changeScenes(scene){
      this.scene = scene
    },
    // 查看sku按钮
    async handler(spu){
      // 对话框显示
      this.dialogTableVisible = true
      // 保存spu
      this.spu = spu
      // 调用接口进行展示
      let result = await this.$API.sku.reqSkuList(spu.id)
      if (result.code == 200) {
        this.skuList = result.data
        // 隐藏loading
        this.loading = false
      }
    },
    // 关闭对话框的回调
    close(done){
      this.loading = true
      // 清楚SKU列表的数据
      this.skuList = []
      // done是关闭对话框
      done()
    }
  },
}
</script>

<style>

</style>