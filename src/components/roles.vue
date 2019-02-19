<template>
    <el-card id="box">
        <!-- 面包屑 -->
         <cus-bread level1="权限管理" level2="角色列表"></cus-bread>
         <el-button class="btn" type="primary">添加角色</el-button>

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
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="180"></el-table-column>
    
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
    </el-card>
</template>

<script>
export default {
data(){
    return {
        list:[]
    }
},
created(){
    this.getTableData()
},
methods:{
    async getTableData(){
        const res=await this.$http.get(`roles`)
        console.log(res)
        const{
            data,
            meta:{
                msg,status
            }
        }=res.data
        if(status===200){
            this.list=data
        }
    }
}
}
</script>

<style>
.btn{
    margin-top: 20px;
    margin-bottom: 15px;
}
</style>
