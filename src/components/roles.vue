<template>
  <el-card id="box">
    <!-- 面包屑 -->
    <cus-bread level1="权限管理" level2="角色列表"></cus-bread>
    <el-button class="btn" type="primary">添加角色</el-button>

    <!-- 表格 -->
    <el-table height="350px" :data="list" style="width: 100%">
      <el-table-column type="expand" width="50">
        <template slot-scope="scope">
          <!-- 行列布局 -->
          <el-row
            @close="deleteRole(scope.row,item1)"
            v-for="(item1,i) in scope.row.children"
            :key="item1.id"
          >
            <el-col :span="4">
              <el-tag closable type="success">{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row
                @close="deleteRole(scope.row,item2)"
                v-for="(item2,i) in item1.children"
                :key="item2.id"
              >
                <el-col :span="4">
                  <el-tag closable type="warning">{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    @close="deleteRole(scope.row,item3)"
                    closable
                    type="info"
                    v-for="(item3,i) in item2.children"
                    :key="item3.id"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length===0">
            <el-col>
              <span>未分配权限</span>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="200"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="300"></el-table-column>

      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
          <el-button
            @click="showDiaSetRirhts(scope.row)"
            type="success"
            icon="el-icon-check"
            circle
            size="mini"
            plain
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 对话框 -->
    <el-dialog title="分配权限" :visible.sync="dialogFormVisible">
      <el-tree
        ref="treeDom"
        :data="treeList"
        show-checkbox
        node-key="id"
        :default-checked-keys="arrCheck"
        default-expanded-all
        :props="defaultProps"
      ></el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRights()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      dialogFormVisible: false,
      treeList: [],
      // arrExpand: [],
      arrCheck: [],
      defaultProps: {
        label: "authName",
        children: "children"
      },
      currRoleID: -1
    };
  },

  created() {
    this.getTableData();
  },
  methods: {
    async setRights() {
      const arr1 = this.$refs.treeDom.getCheckedKeys();
      console.log(arr1);
      const arr2 = this.$refs.treeDom.getHalfCheckedKeys();
      console.log(arr2);
      const arr = [...arr1, ...arr2];
      const res = await this.$http.post(`roles/${this.currRoleID}/rights`, {
        rids: arr.join(",")
      });
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.dialogFormVisible = false;
        this.getTableData();
      }
    },

    async showDiaSetRirhts(role) {
      this.currRoleID = role.id;
      this.dialogFormVisible = true;
      //   获取数据
      const res = await this.$http.get(`rights/tree`);
      console.log(res);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.treeList = data;
        console.log(this.treeList);
        const temp = [];
        role.children.forEach(item1 => {
          // temp.push(item1.id);
          item1.children.forEach(item2 => {
            // temp.push(item2.id);
            item2.children.forEach(item3 => {
              temp.push(item3.id);
            });
          });
        });
        console.log(temp);
        this.arrCheck = temp;
      }
    },
    async deleteRole(role, right) {
      const res = await this.$http.delete(
        `roles/${role.id}/rights/${right.id}`
      );
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.$message.success(msg);
        role.children = data;
      }
    },
    async getTableData() {
      const res = await this.$http.get(`roles`);
      console.log(res);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.list = data;
      }
    }
  }
};
</script>

<style>
.btn {
  margin-top: 20px;
  margin-bottom: 15px;
}
</style>
