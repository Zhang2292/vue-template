<template>
  <div>
    <el-card style="margin:20px 0px">
      <category-select @getCategoryId="getCategoryId" :show="!isShowTable"></category-select>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <!-- 添加按钮 -->
        <el-button @click="addAttr" type="primary" icon="el-icon-plus" :disabled="!category3Id" style="marginBottom: 20px;">添加属性</el-button>
        <!-- 表格 -->
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150"></el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{row}">
              <el-tag type="success" v-for="attrValue in row.attrValueList" :key="attrValue.id" style="margin:0px 20px">{{attrValue.valueName}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{row,$index}">
              <el-button type="warning" icon="el-icon-edit" @click="updateAttr(row)" size="mini"></el-button>
              <el-popconfirm :title="`确定要删除：${row.attrName}?`" @onConfirm="deleteRow($index)">
                <el-button type="danger" icon="el-icon-delete" slot="reference" size="mini"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 修改属性|添加属性的结构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性值</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
        <el-table style="width:100%; margin: 20px 0px;" border :data="attrInfo.attrValueList">
          <el-table-column align="center" type="index" label="序号" width="80"></el-table-column>
          <el-table-column width="width" prop="prop" label="属性值名称" >
            <template slot-scope="{row,$index}">
              <!-- 这里结构需要span和input来回切换显示 -->
              <el-input :ref="$index" v-if="row.flag" @blur="toLook(row)" @keyup.native.enter="toLook(row)" v-model="row.valueName" placeholder="请输入属性值名称" size="mini"></el-input>
              <span v-else @click="toEdit(row,$index)" style="display:block;" >{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column width="width" prop="prop" label="操作" >
            <template slot-scope="{row,$index}">
              <!-- 点击删除弹出提示框 -->
              <el-popconfirm :title="`确定要删除：${row.valueName}?`" @onConfirm="deleteAttrValue($index)">
                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length<1">保存</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
  // 按需引入lodash当中的深拷贝
  import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      // 接受平台属性的字段
      attrList: [],
      // 控制表格是否显示隐藏
      isShowTable: true,
      // 收集新增属性|修改属性使用的
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [
          //属性值，因为属性值可以有多个 因此用数组，每一个属性值都是一个对象需要attrId,valueName
        ],
        categoryId: 0, //三级分类的id
        categoryLevel: 3, //因为服务器也需要区分几级id
      },
    };
  },
  methods: {
    // 自定义事件的回调
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
    // 请求接口
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    // 添加属性值回调
    addAttrValue(){
      // 向属性值的数组里面添加元素
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,   // 对于修改某一个属性的时候，可以在已有的属性值基础之上新政新的属性值（需要把已有的属性值的id带上）
        valueName: '',
        flag: true, // flag给每一个属性值添加一个标记flag，用户切换查看模式与编辑模式
      })
      // 实现自动聚焦
      // 需要使用$nextTick，当节点渲染完毕了，会执行一次
      this.$nextTick(()=>{
        // 获取相应的input表单元素 实现聚焦
        this.$refs[this.attrInfo.attrValueList.length-1].focus()
      })
    },
    // 添加属性按钮的回调
    addAttr(){
      // 切换table显示与隐藏
      this.isShowTable=false
      // 清除数据
      this.attrInfo = {
        attrName: "", //属性名
        attrValueList: [
          //属性值，因为属性值可以有多个 因此用数组，每一个属性值都是一个对象需要attrId,valueName
        ],
        categoryId: this.category3Id, //三级分类的id
        categoryLevel: 3, //因为服务器也需要区分几级id
      }
    },
    // 修改属性
    updateAttr(row){
      // 隐藏isShowTable
      this.isShowTable = false;
      // 键选中的属性赋值给attrInfo
      this.attrInfo = cloneDeep(row)
      // 在修改某一个属性的时候，将相应的属性值元素添加上flag这个标记
      this.attrInfo.attrValueList.forEach(item=>{
        //$set: 第一个参数：对象，第二个参数：添加新的响应式属性，第三个参数：新的属性的属性值
        this.$set(item,'flag',false)
      })
    },
    // 删除1
    deleteRow(index){
      this.attrList.splice(index, 1)
    },
    // 失去焦点事件————切换为查看模式，展示span
    toLook(row){
      if(row.valueName.trim()==''){
        // 如果属性值为空不能作为性的属性值，并提示用户
        this.$message("内容开始和结尾不能是“空格”！！！")
        return
      }
      // 新增的属性值不能与已有的属性值重复
      let isRePat = this.attrInfo.attrValueList.some(item => {
        // 需要将row从数组里界面判断的时候去除
        if(row!==item){
          return row.valueName == item.valueName
        }
      })
      if(isRePat)return
      // 当前编辑模式变为查看模式{让input消失，显示span}
      row.flag = false;
    },
    // 点击span的回调，变为编辑模式
    toEdit(row,index){
      row.flag = true
      // 获取input节点，实现自动聚焦
      // 需要使用$nextTick，当节点渲染完毕了，会执行一次
      this.$nextTick(()=>{
        // 获取相应的input表单元素 实现聚焦
        this.$refs[index].focus()
      })
    },
    // 气泡确认框：点击确定的时候删除
    deleteAttrValue(index){
      // 当前删除属性值的操作时不需要发请求的
      this.attrInfo.attrValueList.splice(index, 1)
    },
    // 保存按钮，进行添加属性或者修改属性的操作
    async addOrUpdateAttr(){
      // 提交给服务器数据当中不能带有flag属性
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item=>{
        // 过滤掉属性值不是空时
        if(item.valueName!=''){
          // 删除掉flag属性
          delete item.flag;
          return true
        }
      })
      try {
      // 发请求
        await this.$API.attr.reqAddAttr(this.attrInfo)
        // 切换对话框
        this.isShowTable = true
        // 弹出提示框
        this.$message({type: 'success', message:'保存成功'})
        // 保存成功以后需要再次获取平台属性进行展示
        this.getAttrList()
      } catch (error) {
        this.$message('保存失败')
      }
    },
  },
};
</script>

<style scoped>
  .el-button{
    margin-left: 10px;
  }
</style>
