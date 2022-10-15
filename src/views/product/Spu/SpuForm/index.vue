<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="请输入SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请输入品牌" v-model="spu.tmId">
          <el-option :label="tm.tmName" :value="tm.id" v-for="tm in tradeMarkList" :key="tm.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea" rows="4" placeholder="SPU描述" v-model="spu.description"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 图片墙 -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handlerSuccess"
          :file-list="spuImageList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectSaleAttr.length}未选择`" v-model="attrIdAndAttrName">
          <el-option :label="unselect.name" :value="`${unselect.id}:${unselect.name}`" v-for="unselect in unSelectSaleAttr" :key="unselect.id"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" style="margin-left: 20px" :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button>
        <el-table style="width: 100%; margin-top: 20px" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{row}">
              <el-tag :key="tag.id" v-for="(tag,index) in row.spuSaleAttrValueList" closable :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index,1)">
                {{tag.saleAttrValueName}}
              </el-tag>
              <!-- @blur="handleInputConfirm" @keyup.enter.native="handleInputConfirm" -->
              <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" @blur="handleInputConfirm(row)" size="small" ref="saveTagInput"></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{$index}">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false, // 存储SPU信息属性
      spu: {
        // 三级分类的id
        category3Id: 0,
        // 描述
        description: "",
        // SPU的名称
        spuName: "",
        // 平台的id
        tmId: 0,
        // 收集SPU图片的信息
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        // 平台属性与属性值收集
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     // {
          //     //   baseSaleAttrId: 0,
          //     //   id: 0,
          //     //   isChecked: "string",
          //     //   saleAttrName: "string",
          //     //   saleAttrValueName: "string",
          //     //   spuId: 0,
          //     // },
          //   ],
          // },
        ],
      },
      tradeMarkList: [], //存储品牌信息
      spuImageList: [], //存储SPU图片的数据
      saleAttrList: [], //存储销售属性的数据
      attrIdAndAttrName:'',    // 手机未选择的销售属性id
    };
  },
  methods: {
    // 照片墙删除某一个图片触发
    handleRemove(file, fileList) {
      // file代表的是删除的那张图片
      // fileList照片墙三处某一张图片以后，剩余的其他的图片
      console.log(file, fileList);
    },
    // 照片墙预览功能
    handlePictureCardPreview(file) {
      // file.url是图片地址  下面这行是吧地址存到dialogImageUrl
      this.dialogImageUrl = file.url;
      // 对话框显示
      this.dialogVisible = true;
    },
    // 初始化SpuForm数据  父组件点击修改按钮 在这里调用接口
    async initSpuData(spu) {
      // 获取SPU信息的数据
      let spuResult = await this.$API.spu.reqSpu(spu.id);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }
      // 获取品牌的信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      // 获取SPU图片
      let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImageResult.code == 200) {
        let listArr = spuImageResult.data;
        // 由于照片墙展示图片数据,数组里面的元素需要有name与url
        listArr.forEach(item => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        // 把整理好的赋值给spuImageList
        this.spuImageList = listArr
      }
      // 获取平台全部销售属性
      let saleAttrList = await this.$API.spu.reqBaseSaleAttrList();
      if (saleAttrList.code == 200) {
        this.saleAttrList = saleAttrList.data;
      }
    },
    // 照片墙图片上传成功的回调
    handlerSuccess(response,file,fileList){
      // 收集图片的信息
      this.spuImageList = fileList
    },
    // 添加新的销售属性
    addSaleAttr(){
      // 已经收集需要添加的销售属性的信息
      // 因为收集到的数据是字符串格式 包收集到的销售属性数据进行分割
      const [baseSaleAttrId,saleAttrName]  = this.attrIdAndAttrName.split(':')
      // 向SPU对象的spuSaleAttrList属性添加新的销售属性
      let newSaleAttr = {baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[]}
      // 添加新的销售属性
      this.spu.spuSaleAttrList.push(newSaleAttr)
      // 清空数据
      this.attrIdAndAttrName = ''
    },
    // 添加按钮的回调
    addSaleAttrValue(row){
      // 点击销售属性值当中添加按钮的时候，需要由button变为input，通过当前销售属性的inputVisible控制
      this.$set(row,'inputVisible',true)
      // 通过响应式数据inputValue字段收集新增的销售属性值
      this.$set(row,'inputValue','')
    },
    // 失去焦点事件
    handleInputConfirm(row){
      // 结构出数据
      const {baseSaleAttrId,inputValue} = row
      // 新增的销售属性值的名称不能为空
      if (inputValue.trim()=='') {
        this.$message('属性值不能为空')
        return
      }
      // 属性值不能重复
      let result = row.spuSaleAttrValueList.every(item=>item.saleAttrValueName!=inputValue)
      if(!result) return
      // 新政的销售属性值
      let newSaleAttrValue = {baseSaleAttrId,saleAttrValueName:inputValue}
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      // 修改inputVisible为false 让他显示button
      row.inputVisible = false
    },
    // 保存按钮的回调  
    async addOrUpdateSpu(){
      // 整理参数: 需要整理照片墙的数据
      this.spu.spuImageList = this.spuImageList.map( (item) =>{
        return {
          imgName: item.name,
          imgUrl: (item.response&&item.response.data) || item.url,
        }
      })
      // 发请求
      let result = await this.$API.spu.reqAddOrUpDareSpu(this.spu)
      if(result.code == 200){
        // 提示
        this.$message({type: 'success', message: '保存成功'})
        // 通知父组件回到scene=0的对话框
        this.$emit('changeScene',{scene:0,flag:this.spu.id ? '修改' : '添加'})
      }
      // 清除数据
      Object.assign(this._data,this.$options.data())
    },
    // 点击添加SPU按钮的时候,发售那个请求的函数
    async addSpuData(category3Id){
      // 添加SPU的时候收集三级id
      this.spu.category3Id = category3Id
      // 获取品牌的信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      // 获取平台全部销售属性
      let saleAttrList = await this.$API.spu.reqBaseSaleAttrList();
      if (saleAttrList.code == 200) {
        this.saleAttrList = saleAttrList.data;
      }
    },
    // 取消按钮的回调
    cancel(){
      this.$emit('changeScene', {scene:0,flag:''})
      // 清除数据
      Object.assign(this._data,this.$options.data())
    }
  },
  computed:{
    // 计算出还未选择的销售属性
    unSelectSaleAttr(){
      // 整个平台的销售属性一共三个,颜色,尺寸,版本 ===== saleAttrList
      let result = this.saleAttrList.filter(item => {
        // every数组的方法,会返回一个布尔值{真,假}
        return this.spu.spuSaleAttrList.every(item1 => {
          return item.name != item1.saleAttrName
        })
      })
      return result
    }
  }
};
</script>
<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
