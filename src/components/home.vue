<template>
  
<el-container class="container">
  <el-header>
      <el-row>
        <el-col :span="4">
            <img src="@/assets/logo.png" alt="">
        </el-col>
        <el-col :span="19" class="middle">
            <div class="grid-content bg-purple-light">
            <h2>电商后台管理系统</h2>
            </div></el-col>
        <el-col :span="1"><a @click="handleLogout()" class="logout" href="#">退出</a></el-col>
    </el-row>
  </el-header>
  <el-container>
    <el-aside width="200px">
        <el-menu
        :unique-opened='true' 
        :router='true'
      default-active="2"
      class="el-menu-vertical-demo" >
      <!-- 1 -->
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>用户管理</span>
        </template> 
          <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>用户列表
              </el-menu-item> 
      </el-submenu>
      <!-- 2 -->
       <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>权限管理</span>
        </template> 
          <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>角色列表
              </el-menu-item> 
              <el-menu-item index="1-2">
              <i class="el-icon-menu"></i>权限列表
              </el-menu-item> 
      </el-submenu>
     <!-- 3 -->
    <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>商品管理</span>
        </template> 
          <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>商品列表
              </el-menu-item> 
              <el-menu-item index="1-2">
              <i class="el-icon-menu"></i>分类参数
              </el-menu-item> 
              <el-menu-item index="1-3">
              <i class="el-icon-menu"></i>商品分类
              </el-menu-item> 
      </el-submenu>
    
     <!-- 4 -->
     <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>订单管理</span>
        </template> 
          <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>订单列表
              </el-menu-item> 
      </el-submenu>
<!-- 5 -->
     <el-submenu index="5">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>数据统计</span>
        </template> 
          <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>数据报表
              </el-menu-item> 
      </el-submenu>

      </el-menu>
    </el-aside>
    <el-main>Main</el-main>
  </el-container>
</el-container>


  
</template>

<script>
export default {
  methods:{
    handleLogout(){
      this.$router.push({
        name:'login'
      });
      localStorage.clear();
      this.$message.success('成功退出')
    }
  },
beforeMount(){
    if(!localStorage.getItem('token')){
      this.$router.push({
        name:'login'
      })
      this.$message.warning('请先登录')
    }
  }
}
</script>

<style>
.container{
    background: #b3c0d1;
    height: 100%;
}
 .middle{
     color: #fff;
     text-align: center;
     line-height: 60px;
 }
 .logout{
     line-height: 60px;
     text-decoration: none;
 }
</style>
