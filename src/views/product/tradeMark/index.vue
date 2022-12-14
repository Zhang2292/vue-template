<template>
  <div>
    <!-- 按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0px"
      @click="showDialog"
      >添加</el-button
    >
    <!--表单组件-->
    <el-table style="width: 100%" border :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column
        prop="tmName"
        label="品牌名称"
        width="width"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="logoUrl"
        label="品牌LOGO"
        width="width"
        align="center"
      >
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" style="width: 80px; height: 40px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width" align="center">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :page-size="limit"
      :total="total"
      :pager-count="7"
      :page-sizes="[3, 5, 10]"
      @current-change="handleExpandChange"
      @size-change="handleSizeChange"
      layout="prev, pager, next, jumper, ->, sizes, total"
    >
    </el-pagination>
    <!-- 对话框 -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- form表单 -->
      <el-form :model="tmForm" style="width: 80%" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!--上传头像-->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            list-type="picture-card"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    // 自定义校验规则
    var validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 8) {
        callback(new Error("请输入品牌名称2~8之内"));
      } else {
        callback();
      }
    };
    return {
      page: 1, //当前分页器是第几页
      limit: 3, //当前页数展示数据条数
      total: 0, //总共个多少数据
      list: [], //列表展示的数据
      dialogFormVisible: false, //对话框显示隐藏
      // 收集品牌信息
      tmForm: {
        // tmName收集的是品牌名称的input值
        tmName: "",
        logoUrl: "",
      },
      // 表单验证规则
      rules: {
        // 品牌名称验证规则
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          // 自定义校验规则
          { validator: validateTmName, trigger: "change" },
        ],
        // 品牌的LOGO验证规则
        logoUrl: [{ required: true, message: "请选择品牌的图片" }],
      },
    };
  },
  mounted() {
    this.getPageList();
  },
  methods: {
    // 获取品牌列表的数据
    async getPageList() {
      const { page, limit } = this;
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        this.page = result.data.current
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    // 当前分页器是第几页
    handleExpandChange(pager) {
      this.page = pager;
      this.getPageList();
    },
    // 当分页器某一页需要展示数据条数发生变化的时候会触发
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },
    // 点击添加品牌的按钮
    showDialog() {
      // 显示对话框
      this.dialogFormVisible = true;
      // 清楚上一次提交的数据
      this.tmForm = {
        tmName: "",
        logoUrl: "",
      };
    },
    // 修改某一个品牌
    updateTradeMark(row) {
      // 显示对话框
      this.dialogFormVisible = true;
      // 将已有的品牌信息赋值给tmForm进行展示
      this.tmForm = { ...row };
    },
    // 上传图片成功
    handleAvatarSuccess(res, file) {
      // res和file都是上传成功之后服务器返回前端的数据
      this.tmForm.logoUrl = res.data;
    },
    // 图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      // 使图片显示
      this.tmForm.logoUrl = URL.createObjectURL(file);

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M && false;
    },
    // 添加对话框的确定按钮
    addOrUpdateTradeMark() {
      // 当全部验证通过 再去书写业务逻辑
      this.$refs.ruleForm.validate(async (success) => {
        // 如果全部符合条件
        if (success) {
          // 隐藏对话框
          this.dialogFormVisible = false;
          // 发请求（添加|修改）
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          if (result.code == 200) {
            // 弹出信息：添加品牌成功、修改品牌成功
            this.$message({
              type: "success",
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
            });
            // 添加或修改后再次请求接口
            this.getPageList();
          }
        } else {
          // 失败则提示错误
          console.log("error submit!!!");
          return false;
        }
      });
    },
    // 删除品牌的数据
    deleteTradeMark(row) {
      // 弹框
      this.$confirm(`你确定永久删除: "${row.tmName}" , 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 当用户点击确定按钮的时候触发
          // 掉用删除接口
          let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            // 再次发起请求
            this.getPageList()
          }
        })
        .catch(() => {
          // 当用户点击取消按钮的时候触发
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
