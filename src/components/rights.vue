<template>
<el-card>
    <cus-bread level1="权限管理" level2="权限列表"></cus-bread>

    <!--  表格-->
    <!-- 表格 -->
    <el-table height="500px" :data="list" style="width: 100%">
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>

      <el-table-column  label="层级" width="180">
        <template slot-scope="scope">
            <span v-if="scope.row.level==='0'">一层</span>
            <span v-if="scope.row.level==='1'">二层</span>
            <span v-if="scope.row.level==='2'">三层</span>
        </template>
      </el-table-column>
    </el-table>
    
</el-card>
  
</template>

<script>
export default {
    data(){
        return{
            list:[]
        }
    },
    created(){
    this.getTableData()
    },
  methods:{
      async getTableData(){
    //       const AUTH_TOKEN = localStorage.getItem("token");
    //   this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
          const res=await this.$http.get(`rights/list`)
          console.log('请求发起了')
          console.log(res);

          const {
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
  
</style>
