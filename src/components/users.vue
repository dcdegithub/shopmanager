<template>
  <el-card class="box">
    <!-- 面包屑 -->
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
      <!-- 首页/用户管理/用户列表 -->
      <!-- <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb> -->
    <cus-bread level1="用户管理" level2="用户列表"></cus-bread>
    <!-- 搜索+添加 -->
    <el-row class="seartBox">
      <el-col>
        <!-- 搜索框 -->
        <el-input
          @clear="getAllUsers()"
          clearable
          class="searchInput"
          placeholder="请输入内容"
          v-model="query"
        >
          <el-button slot="append" icon="el-icon-search" @click="searchUser()"></el-button>
        </el-input>
        <!-- 添加按钮 -->
        <el-button type="success" @click="showDiaAddUser()">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table height="350px" :data="list" style="width: 100%">
      <!--
          id: 500
          username: "admin"
          email: "adsfad@qq.com"
          mobile: "12345678"
          create_time: 1486720211
          mg_state: true
          role_name: "主管"
      -->
      <el-table-column prop="id" label="#" width="80"></el-table-column>
      <el-table-column prop="username" label="姓名" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="140"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="140"></el-table-column>

      <!-- 日期格式处理->过滤器->2类(全局)+3步
      fmtdate的使用
      1. v-bind:
      2. {{msg | fmtdate}}
      -->
      <!-- 思路1  尝试prop="create_time|fmtdate"    不行!-->
      <!-- <el-table-column prop="create_time | fmtdate" label="创建日期" width="140"></el-table-column> -->
      <!-- 思路2 error 使用插值调用过滤器  不行!-->
      <!-- <el-table-column prop="create_time" label="创建日期" width="140">
        {{create_time | fmtdate}}
      </el-table-column>-->
      <!-- <div>{{msg | fmtdate}}</div> -->
      <!-- 思路3
        前提:下面这个单元格的内容不是prop的值create_time的值-日期
        1. 给单元格内容外层加template
        2. 给template设置slot-scope
        3. slot-scope的值 会自动绑定外层数据结构,这里是el-table的data的值 list
        4. 在内容位置写scope.row 自动取出数组list中每个对象,其中row是固定写法

      -->
      <el-table-column label="创建日期" width="140">
        <template slot-scope="scope">{{scope.row.create_time | fmtdate}}</template>
      </el-table-column>

      <el-table-column label="用户状态" width="140">
        <template slot-scope="scope">
          <el-switch
            @change="changeState(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            @click="showDiaEditUser(scope.row)"
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            plain
          ></el-button>
          <el-button
            @click="showMsgBoxDele(scope.row)"
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            plain
          ></el-button>
          <el-button
            @click="showDiaSetRole(scope.row)"
            type="success"
            icon="el-icon-check"
            circle
            size="mini"
            plain
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页
    @size-change 每页条数改变时
    @current-change 页码改变时 (当前1页 点击2页 )
    current-page 当前显示第几页 页码
    page-sizes 每页条数的不同情况的数组
    layout 附加功能
    total 一共数据的条数
    -->
    <el-pagination
      class="page"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4,6,8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 对话框 -添加用户-->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <!-- 表单 -->
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formdata.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 对话框- 编辑 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <!-- 表单 -->
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input disabled v-model="formdata.username"></el-input>
        </el-form-item>

        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 对话框 - 角色-->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">{{formdata.username}}</el-form-item>

        <el-form-item label="角色">
          <!--
            v-model 绑定表单元素
            1. type="text" input
            2. 其他表单元素(textarea等) 就是select+option
            回顾下拉框的特性
            1. 默认显示请选中->当v-model的数据值selectVal和option的请选择的value值相等, 此时显示请选择
            2. 当选择某个option时,v-model的数据的值等于选中的label的value值
          -->
          {{selectVal}}
          <el-select v-model="selectVal" placeholder="请选择角色">
            <el-option disabled label="请选择" :value="-1"></el-option>

            <!-- 5个角色此时都有了自己的value,
            value就是角色id
            [30,31,34,39,40]
            如果selectVal的值,比如30,
            -->
            <el-option
              v-for="(item) in roles"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>

            <!-- 将来获取角色名数据->v-for遍历 -->
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 2,
      total: -1,
      // 表格数据
      list: [],
      // 对话框
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,
      // 表单数据-> 将来发送post请求->请求体->
      formdata: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 下拉框用的数据
      selectVal: -1,
      currUserId: -1,
      // 角色数组
      roles: []
    };
  },
  // mounted(){}
  // 获取首屏数据的方法调用
  created() {
    this.getTableData();
  },
  methods: {
    // 分配角色- 发送请求
    async setRole() {
      // currUserId
      // get ?username="abc"&password="123"
      //   user/:id
      //
      // "users/" +this.currUserId+"/role"
      const res = await this.$http.put(`users/${this.currUserId}/role`, {
        rid: this.selectVal
      });
      // console.log(res);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        // 关闭
        this.dialogFormVisibleRole = false;
      }
    },
    // 分配角色 - 打开对话框
    async showDiaSetRole(user) {
      // console.log(user);
      // this.currUsername = user.username;
      this.formdata = user;
      this.currUserId = user.id;
      this.dialogFormVisibleRole = true;

      // 获取角色名称
      const res = await this.$http.get(`roles`);
      // console.log(res);
      this.roles = res.data.data;

      const res2 = await this.$http.get(`users/${user.id}`);
      // console.log(res2);
      // 给下拉框v-model绑定的selectVal赋值
      this.selectVal = res2.data.data.rid;
    },
    // 修改状态
    async changeState(user) {
      // uid->user
      // type -> user
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      // console.log(res);
    },
    // 编辑 - 发送请求
    async editUser() {
      // id->user.id->user->1data没有2方法实参没有
      // this,formdata上一步已经是user
      const res = await this.$http.put(
        `users/${this.formdata.id}`,
        this.formdata
      );
      // console.log(res);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        // 关闭
        this.dialogFormVisibleEdit = false;
        // 更新表格
        this.getTableData();
      }
    },
    // 编辑 - 显示对话框
    async showDiaEditUser(user) {
      // 获取当前用户数据<-
      // user的数据
      // create_time: (...)
      // email: (...)
      // id: (...)
      // mg_state: (...)
      // mobile: (...)
      // role_name: (...)
      // username: (...)

      this.dialogFormVisibleEdit = true;
  
      const res = await this.$http.get(`users/${user.id}`);
      this.formdata = user;
    },
    // 删除 - 显示确认框
    showMsgBoxDele(user) {
      // console.log(user);

      this.$confirm("是否把我删掉?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // id->用户id数据->user.id
          const res = await this.$http.delete(`users/${user.id}`);
          // console.log(res);
          const {
            meta: { msg, status }
          } = res.data;
          if (status === 200) {
            this.$message.success(msg);
            this.pagenum = 1;
            this.getTableData();
          }
        })
        .catch(() => {
          this.$message.info("取消删除");
        });
    },
    // 添加 - 发送请求
    async addUser() {
      // 发送请求
      // this.formdata?
      const res = await this.$http.post(`users`, this.formdata);
      // console.log(res);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 201) {
        // 关闭对话框
        this.dialogFormVisibleAdd = false;
        // 更新表格
        this.getTableData();
      }
    },
    // 添加- 打开对话框
    showDiaAddUser() {
      this.dialogFormVisibleAdd = true;
      // 清空
      // this.formdata.username = "";

      this.formdata = {};
    },
    // 搜索-清空时获取所有用户
    getAllUsers() {
      this.getTableData();
    },
    // 搜索用户
    searchUser() {
      this.pagenum = 1;
      // 按照query关键字搜索
      // query="admin"
      this.getTableData();
    },
    // 分页相关的方法

    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);

      // 按照新pagesize发送请求
      this.pagenum = 1;

      this.pagesize = val;
      this.getTableData();
    },
    // 当前2页 -> 点击3 ->触发下面的方法 ->val = 3
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      // 按照新页码发送请求
      this.pagenum = val;
      // this.pagemnum = 1 this.pagesize=2 发送请求
      // this.pagenum=3 this.pagesize=2 发送请求
      this.getTableData();
    },
    // 获取表格数据
    async getTableData() {
      // 除了登录请求.其他所有请求都需要授权->
      // 在发送请求之前,先设置请求头{Authorization:token值}
      // 设置请求头headers -> 发送请求用的是axios->找axiosAPI有没有可以设置请求头->看文档
      // {
      //   ContentType:text/html,
      //   Authorization:?
      // }
      // 头部->
      // const AUTH_TOKEN = localStorage.getItem("token");
      // this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;

      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      // console.log(res);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.total = data.total;
        this.list = data.users;
        // console.log(this.list);
      }
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.seartBox {
  margin-top: 20px;
}
.searchInput {
  width: 350px;
}
.page {
  margin-top: 20px;
}
</style>
