<template>
  <el-card class="box">
    <cus-bread level1="商品管理" level2="分类参数"></cus-bread>
    <el-alert class="alert" title="注意:只允许为第三级分类设置参数" type="warning" show-icon></el-alert>
    <el-form :model="form" label-position="left" label-width="120px">
      <el-form-item label="请选择商品分类">
        <el-cascader
          clearable
          expand-trigger="hover"
          :options="options"
          :props="defaultProp"
          v-model="selectedOptions"
          @change="handleChange()"
        ></el-cascader>
      </el-form-item>
    </el-form>
    <el-tabs v-model="active" @tab-click="changeTab()">
      <el-tab-pane label="动态资源" name="1">
        <el-button class="btn" type="primary" disabled>设置动态资源</el-button>
        <el-table height="350px" :data="arrDy" style="width: 100%">
            <!-- 展开 -->
          <el-table-column type="expand" width="80">
            <template slot-scope="scope">
              <!-- 动态tag -->
              <el-tag
                :key="i"
                v-for="(item,i) in scope.row.attr_vals"
                closable
                :disable-transitions="false"
                @close="handleClose(scope.row,item)"
                
              >{{item}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#" width="180"></el-table-column>
          <el-table-column prop="attr_name" label="角色名称" width="200"></el-table-column>

          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
              <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="静态资源" name="2">
        <el-button class="btn" type="primary" disabled>设置静态资源</el-button>
         <el-table height="350px" :data="arrStatic" style="width: 100%">
         
          <el-table-column type="index" label="#" width="80"></el-table-column>
          <el-table-column prop="attr_name" label="属性名称" width="200"></el-table-column>
          <el-table-column prop="attr_vals" label="属性值" width="200"></el-table-column>

          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
              <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      form: {},
      options: [],
      selectedOptions: [1, 3, 6],
      defaultProp: {
        label: "cat_name",
        value: "cat_id"
      },
      active: "1",
      arrDy: [],
      arrStatic: [],
      //   tag

      inputVisible: false,
      inputValue: ""
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    //   tab切换
    changeTab(){
        this.handleChange() 
    },
    //   动态tab
    async handleClose(obj, item) {
      obj.attr_vals.splice(obj.attr_vals.indexOf(item), 1);
      const res = await this.$http.put(
        `categories/${this.selectedOptions[2]}/attributes/${obj.attr_id}`,
        {
          attr_name: obj.attr_name,
          attr_sel: obj.attr_sel,
          // 以,分割的属性值列表 [].join(",")
          attr_vals: obj.attr_vals.join(",")
        }
      );
    //   console.log(res);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    async handleInputConfirm(obj) {
      let inputValue = this.inputValue;
      if (inputValue) {
        obj.attr_vals.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
      const res = await this.$http.put(
        `categories/${this.selectedOptions[2]}/attributes/${obj.attr_id}`,
        {
          attr_name: obj.attr_name,
          attr_sel: obj.attr_sel,
          // 以,分割的属性值列表 [].join(",")
          attr_vals: obj.attr_vals.join(",")
        }
      );
    //   console.log(res);
      
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
    async handleChange() {
      if (this.selectedOptions.length !== 3) {
        // 提示
        this.$message.warning("请先选择三级分类!");
        if (this.active === "1") {
          this.arrDy = [];
        } else if(this.active === "2") {
          this.arrStatic = [];
        }
        return;
      }
      if (this.active === "1") {
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
        //   console.log(this.arrDy);
          this.arrDy.forEach(item => {
            item.attr_vals =
              item.attr_vals.trim().length === 0
                ? []
                : item.attr_vals.trim().split(",");
            this.dynamicTags = item.attr_vals;
          });
        }
      }
       if (this.active === "2") {
        if (this.selectedOptions.length !== 3) {
          this.$message.warning("请先选择三级分类");
          return;
        }
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=only`
        );
        // console.log(res);
        const {
          data,
          meta: { msg, status }
        } = res.data;
        if (status === 200) {
          this.arrStatic = data;
          console.log(this.arrStatic);
        }
      }
    },
    
  }
};
</script>

<style>
.alert {
  margin-top: 20px;
}
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
