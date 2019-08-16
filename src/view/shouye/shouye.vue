<template>
  <div style="width:100%;height: 100%;">
    <el-container style="height: 100%" direction="vertical">
      <el-header style="font-size: 12px;text-align: left">
        <span style="font-size:25px;margin-right:60%;">
            信息平台
            <el-tooltip ref="tip" class="item" effect="dark"  placement="top-start" v-bind:content="mycontent">
              <i class="el-icon-menu" @click="openParentClose()"></i>
            </el-tooltip>

            <!-- 提示音 -->
            <audio id="yinpin" src="../../static/tishi/tishiyin.mp3"> </audio>
            <audio id="en" src="../../static/tishi/en.mp3"> </audio>
            <audio id="qingsong" src="../../static/tishi/qingsong.mp3"> </audio>
            <audio id="aiya" src="../../static/tishi/aiya.mp3"> </audio>


        </span>


          <div style="float:right">
            <el-dropdown @command="handleCommand">
              <i class="el-icon-setting" style="margin-right: 15px"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="c">首页</el-dropdown-item>
                <el-dropdown-item command="a" >查看</el-dropdown-item>
                <el-dropdown-item command="b">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <span ref="userinfo_username" >{{username}}</span>

              <el-image
                style="width: 30px; height: 30px;border-radius:50px;top:5px "
                :src="url1" ></el-image>

            <input ref="userinfo_userid" type="hidden" v-model="userid">
            &nbsp;&nbsp;&nbsp;
            <el-dropdown trigger="click" >
              <span class="el-dropdown-link">
                点我查看<i class="el-icon-caret-bottom el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item class="clearfix">
                  评论
                  <el-badge class="mark" :value="12" />
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

          </div>
       </el-header>

      <el-container noresize:false>
        <!-- 左侧的菜单 -->
        <mymenu  ref="iiii" v-on:ee="updatePro"></mymenu>
        <!-- 右侧的主显示区域 -->
        <mymain style="padding:0px"></mymain>

      </el-container>
    </el-container>

    <el-dialog
      title="查看用户信息"
      :visible.sync="ckbiao"
      width="30%">

            <el-form  label-width="100px" class="demo-form-inline"  :model="userInfo">
              <el-form-item label="用户名:">{{userInfo.userName}}</el-form-item>
              <el-form-item label="登录名:">{{userInfo.loginName}}</el-form-item>
              <el-form-item label="性别:">{{this.changeSex(userInfo.sex)}}</el-form-item>
              <el-form-item label="用户头像:"><img :src="url1" width="100" height="100px"></el-form-item>
              <el-form-item label="电话:">{{userInfo.tel}}</el-form-item>
            </el-form>

          <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="ckbiao=false">关闭</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import mymenu from './datamenu.vue'
  import mymain from './datamain.vue'
  import {delCookie} from "../../js/util";

  const userinfo={};

  export default {

    data(){
      return{
        connectok:false,
        webSocket:null,
        mycontent:"点击打开菜单",
        dialogVisible: false,
        ckbiao: false,
        userInfo:JSON.parse(window.localStorage.getItem("userInfo")),
        userid:JSON.parse(window.localStorage.getItem("userInfo")).id,
        username:JSON.parse(window.localStorage.getItem("userInfo")).userName,
        currInfo:{
          userName:'',
          loginName:'',
          sex:'',
          tel:'',
          buMen:''
        },
        url1:"http://www.image.com/group1/"+JSON.parse(window.localStorage.getItem("userInfo")).url+"_100x100.png",

      }
    },
    components:{mymenu,mymain},
    name: "shouye",
    methods:{
      changeSex(value){
        if(value==1){
          return "男"
        }
        return  "女"
      },
      openWebSocket(evt){//打开通道
        //打开通道提示音
        this.playAudio("en","en")
        this.$data.webSocket.send("hello，我是前端!");
      },
      messageWebSocket(evt){//接收消息
        //触发播放音乐
        this.playAudio("qingsong","qingsong")
        this.$alert('同志们该考试了，抓紧时间，答题', '考试提醒', {
          type:'warning',
          confirmButtonText: '确定',
          callback: action => {
             document.getElementById("qingsong").pause()
          }
        });
      },
      closeWebSocket(evt){
        //关闭通道提示音
        this.playAudio("aiya","aiya")
        //再次连接
        this.webSocketInit();
        /*this.$notify({
          title: '提示',
          message: '关闭通道',
          duration:1000
        });*/
      },
      errorWebSocket(evt){
        console.log("==========error========")
        this.webSocketInit();
      },
      tttt(){
        alert("pppp999999");
      },
      openParentClose(){
        //调用子组件menu中的openClose()
        this.$refs.iiii.openClose();
      },
      updatePro(uu){
        if(uu){
          this.$data.content="点击打开菜单";
        }else{
          this.$data.content="点击关闭菜单";
        }
      },
      handleCommand(command){

          if(command=="b"){//退出操作

            this.$confirm('确认登出？').then(_ => {

               this.$axios.post(this.domain.ssoserverpath+"loginout",{id:this.userInfo.id}).then((response)=>{
                   let sts=response.data.success;
                   if(sts=="ok"){
                     delCookie("loginName");
                     delCookie("password");
                     window.localStorage.clear();
                      this.$router.push({path:'/'});
                   }
               })

            }).catch(_ => {

            });

          }else if(command=="a"){
            this.ckbiao=true;

          }else if(command=="c"){
             this.$router.push({path:"/system"})
          }
      },

    },
    mounted(){
       //登录之后提示
       this.playAudio("yinpin","yinpin");
       //初始化webSocket


       /*if(this.$route.query.username!=null&& this.$route.query.username!='undefind'){

         this.stores.userinfo.username=this.$route.query.username;
         this.domain.userinfo.userid=this.$route.query.userid;

       }*/
      this.userInfo=JSON.parse(window.localStorage.getItem("userInfo"));


      this.$data.username=JSON.parse(window.localStorage.getItem("userInfo")).userName;

       this.$data.userid=JSON.parse(window.localStorage.getItem("userInfo")).userid;
    }
  }
</script>

<style scoped>
  .el-header {
    background-color: #409EFF;
    color: #333;
    line-height:60px;

  }

  .el-aside {
    color: #333;
    height: 100%;
  }

  .item {
    margin-top: 10px;
    margin-right: 40px;
  }
</style>
