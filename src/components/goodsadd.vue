<template>
  <el-card class="box">
    <cus-bread level1="商品管理" level2="商品列表"></cus-bread>
    <el-alert class="alert" title="消息提示的文案" type="info" center show-icon></el-alert>
    <!-- 步骤条 -->
    <el-steps :active="active*1" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- tab切换 -->
    <el-form label-position="top" label-width="80px" :model="formData" class="form">
      <el-tabs v-model="active" tab-position="left" @tab-click="changeTab()">
        <!-- 1 -->
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="formData.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="formData.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="formData.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-cascader
              clearable
              expand-trigger="hover"
              :options="options"
              :props="defaultProp"
              v-model="selectedOptions"
              @change="handleChange()"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <!-- 2 -->
        <el-tab-pane name="2" label="商品参数">
           <el-form-item :label="item.attr_name" 
           v-for='(item) in arrDy' :key="item.attr_id">
          <el-checkbox-group v-model="checkList">
            <el-checkbox :label="item1" 
            v-for='(item1,i) in item.attr_vals' :key='i'>
            </el-checkbox>
           
            
          </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <!-- 3 -->
        <el-tab-pane name="3" label="商品属性">角色管理</el-tab-pane>
        <!-- 4 -->
        <el-tab-pane name="4" label="商品图片">定时任务补偿</el-tab-pane>
        <!-- 5 -->
        <el-tab-pane name="5" label="商品内容">角色管理</el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      active: "1",
      formData: {
        goods_name: "",
        goods_number: "",
        goods_price: "",
        goods_weight: ""
      },
      options: [],
      selectedOptions: [1,3,6],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      arrDy: [],
      checkList:[]
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    async changeTab() {
      if (this.active === "2") {
        if (this.selectedOptions.length !== 3) {
          this.$message.warning("请先选择三级分类");
          return;
        }
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=many`
        );
        // console.log(res);
        const {
          data,
          meta: { msg, status }
        } = res.data;
        if (status === 200) {
          this.arrDy = data;
          // console.log(this.arrDy);
          this.arrDy.forEach(item => {
            // if(item.attr_vals.length===0){
            //   item.attr_vals=[]
            // }else{
            //   item.attr_vals=item.attr_vals.trim().split(',')
            // }
            item.attr_vals=item.attr_vals.trim().length===0?[]:item.attr_vals.trim().split(',')
            // console.log(item.attr_vals);
            
          });
          
        }
      }
    },
    // 获取三级分类数据
    async getGoodsCate() {
      const res = await this.$http.get(`categories?type=3`);
      // console.log(res);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.options = data;
        // console.log(this.options)
      }
    },
    handleChange() {}
  }
};
</script>

<style>
.box {
  height: 100%;
}
.alert {
  margin-top: 20px;
  margin-bottom: 20px;
}
.form {
  height: 350px;
  overflow: auto;
}
</style>
