<template>
  <div>

    <el-tabs type="border-card">
      <el-tab-pane label="用户管理">
        <div>
          <el-form :inline="true" :model="where" class="demo-form-inline">
            <el-form-item label="用户名">
              <el-input v-model="where.name" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-select v-model="where.sex">
                <el-option label="全部" value=0 ></el-option>
                <el-option label="男" value=1></el-option>
                <el-option label="女" value=2></el-option>

              </el-select>
            </el-form-item>
            <el-form-item label="日期">
              <div class="block">

                <el-date-picker
                  v-model="where.dt1"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
                <el-date-picker
                  v-model="where.dt2"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </div>

            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getList()">查询</el-button>

            </el-form-item>
          </el-form>



        </div>
        <el-button    type="primary" @click="add()"  v-if="userInfo.authmap.addYh!=null">+新增用户</el-button><el-button    type="primary" @click="downExcel()"   v-if="userInfo.authmap.downexcel!=null">导出当前页数据</el-button>
        <template>
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55">

            </el-table-column>

            <el-table-column

              label="用户名"
              width="150">
              <template slot-scope="scope">
                <el-popover
                  placement="top-start"
                  title="用户信息"
                  width="200"
                  trigger="hover">
                  <el-image
                    style="width: 100px; height: 100px"
                    :src="url+scope.row.url+urlm1"></el-image>
                  <div>用户名：{{scope.row.userName}}</div>
                  <div>登录名：{{scope.row.loginName}}</div>
                  <div>性别：{{changeSex(scope.row.sex)}}</div>
                  <div>角色：{{scope.row.roleName}}</div>
                  <el-button slot="reference">{{scope.row.userName}}</el-button>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              prop="loginName"
              label="登录名"
              width="150">
            </el-table-column>
            <el-table-column
              label="性别"
              width="150">
              <template slot-scope="scope">{{changeSex(scope.row.sex)}}</template>
            </el-table-column>
            <el-table-column
              prop="tel"
              label="电话"
              width="150">
            </el-table-column>


            <el-table-column
              label="图片"
              width="150">
              <template slot-scope="scope">
                <el-image
                  style="width: 50px; height: 50px"
                  :src="url+scope.row.url+urlm"></el-image>
              </template>
            </el-table-column>
            <el-table-column
              label="角色"
              width="150">
              <template slot-scope="scope">{{scope.row.roleName}}</template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)" v-if="userInfo.authmap.updateYh!=null">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)" v-if="userInfo.authmap.deleteYh!=null">删除</el-button>
                <el-button   size="mini" type="primary" @click="bdRole(scope.$index, scope.row)" v-if="userInfo.authmap.addUr!=null">绑定角色</el-button>
              </template>
            </el-table-column>
          </el-table>


          <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageInfo.page"
              :page-sizes="[5, 10, 15, 20]"
              :page-size="pageInfo.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pageInfo.total">
            </el-pagination>
          </div>
        </template>

        <div>
          <el-dialog
            title="操作用户"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <el-form label-width="100px" ref="entitymod" :model="entitymod">

              <el-form-item label="用户名">
                <el-input type="text" v-model="entitymod.userName" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="登录用户">
                <el-input type="text" v-model="entitymod.loginName" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="密码">
                <el-input type="password" v-model="entitymod.password" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="确认密码">
                <el-input type="password" v-model="entitymod.qpassWord" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="电话">
                <el-input type="text" v-model="entitymod.tel" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="用户头像"  >

                <el-upload
                  class="avatar-uploader"
                  action="http://localhost:10000/api/manger/addUser"
                  ref="upload"
                  :show-file-list="false"
                  :on-change="handleAvatarChange"
                  :on-success="handleAvatarSuccess"
                  :auto-upload="false"
                  :before-upload="beforeAvatarUpload"
                  :on-error="beforeAvatarError"
                  :data="{userName:entitymod.userName,loginName:entitymod.loginName,passWord:entitymod.password,tel:entitymod.tel,sex:entitymod.sex}">
                  <img v-if="imageUrl" :src="imageUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
              <el-form-item label="性别">
                <el-radio-group v-model="entitymod.sex">
                  <el-radio-button label="1">男</el-radio-button>

                  <el-radio-button label="2">女</el-radio-button>
                </el-radio-group>
              </el-form-item>




            </el-form>

            <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose">取 消</el-button>
    <el-button type="primary" @click="save()">确 定</el-button>
  </span>
          </el-dialog>

        </div>

        <div>
          <el-dialog
            title="修改用户"
            :visible.sync="dialogVisible1"
            width="30%"
            :before-close="handleClose">
            <el-form label-width="100px" ref="entitymod" :model="entitymod">

              <el-form-item label="用户名">
                <el-input type="text" v-model="entitymod.userName" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="登录用户">
                <el-input type="text" v-model="entitymod.loginName" autocomplete="off"></el-input>
              </el-form-item>



              <el-form-item label="用户头像"  >
                <el-image
                  style="width: 50px; height: 50px"
                  :src="url+entitymod.url+urlm1"
                  v-if="entitymod.url!=null"></el-image>
                <el-upload
                  class="avatar-uploader"
                  action="http://localhost:10000/api/manger/updateUser"
                  ref="upload1"
                  :show-file-list="false"
                  :on-change="handleAvatarChange"
                  :on-success="handleAvatarSuccess"
                  :auto-upload="false"
                  :before-upload="beforeAvatarUpload"
                  :on-error="beforeAvatarError"
                  :data="{id:this.entitymod.id,userName:entitymod.userName,loginName:entitymod.loginName,tel:entitymod.tel,sex:entitymod.sex}">
                  <img v-if="imageUrl" :src="imageUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
              <el-form-item label="性别">
                <el-radio-group v-model="entitymod.sex">
                  <el-radio-button label="1">男</el-radio-button>

                  <el-radio-button label="2">女</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="update()">确 定</el-button>
        </span>
          </el-dialog>

        </div>
        <div>
          <el-dialog
            title="绑定角色"
            :visible.sync="dialogVisible2"
            width="30%">
            角色：<template>
            <el-select v-model="value" filterable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
            <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="addRole()">确 定</el-button>
        </span>
          </el-dialog>

        </div>
      </el-tab-pane>
      <el-tab-pane label="批量添加" v-if="userInfo.authmap.dowloudExcel!=null">
        <div style="width:200px;height: 200px">
          <el-upload
            class="upload-demo"
            ref="dowloudExcel"
            action="http://localhost:10000/api/manger/dowloudExcel"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
            :on-success="handleAvatarSuccess"
            :auto-upload="false"
            :limit="1">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">批量添加</el-button>
            <div slot="tip" class="el-upload__tip">只能上传xlsx文件，且不超过500kb</div>
          </el-upload>
        </div>

      </el-tab-pane>
    </el-tabs>



  </div>






</template>

<script>
    export default {
        name: "yonghu",
      data() {
        return {
          tableData: [],
          multipleSelection: [],
          where:{
            dt1:"",
            dt2:"",
            sex:"0",
            name:"",
          },
          url:"http://www.image.com/group1/",
          pageInfo:{
            pageSize:5,
            page:1,
          },
          userInfo:JSON.parse(window.localStorage.getItem("userInfo")),
          dialogVisible: false,
          dialogVisible1: false,
          dialogVisible2: false,
          entitymod:{
            tel:"",

          },
          imageUrl:"",
          options:[],
          value:"",
          userId:"",
          urlm:"_100x100.png",
          urlm1:".png"

        }
      },
    mounted(){
        this.getList(1,this.pageInfo.pageSize)
    },
      methods: {
        submitUpload() {
          this.$refs.dowloudExcel.submit();
        },
        handleRemove(file, fileList) {
          console.log(file, fileList);
        },
        handlePreview(file) {
          console.log(file);
        },
        beforeUpload(file){

          const xlsx= file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';


          if (!xlsx) {
            this.$message.error('上传只能是xlsx格式!');
          }

          return xlsx;
        },
        addRole(){



          this.$axios.post(this.domain.serverpath+"addUr",{userId:this.userId,roleId:this.value}).then((res)=>{

            if(res.data.code==200){
            this.$message({
              message: '恭喜你，绑定成功',
              type: 'success',
              duration:'1000'
            });


          }
            this.dialogVisible=false;
            this.dialogVisible1=false;
            this.dialogVisible2=false;
            this.getList(1,this.pageInfo.pageSize);
          }).catch((x)=>{
            this.$message({
              message: '你没有操作权限',
              type: 'error',
              duration:'1000'
            });
          })
        },


        getList(page,pageSize){
          if(page==null){
            page=1
          }
        if(this.where.dt1==null){
          this.where.dt1=""
        }
          if(this.where.dt2==null){
            this.where.dt2=""
          }
          if(this.where.name==null){
            this.where. name=""
          }
        pageSize= this.pageInfo.pageSize;
          this.$axios.post(this.domain.serverpath+"selectYh" +
            "?page="+page+"&pageSize="+pageSize+"&sex="+this.where.sex+"&dt1="+this.where.dt1+"&dt2="+this.where.dt2+"&name="+this.where.name).then((res)=>{
            this.tableData=res.data.content;
            this.pageInfo.total=res.data.totalElements;
          }).catch((x)=>{
            this.$message({
              message: '你没有操作权限',
              type: 'error',
              duration:'1000'
            });
          })
        },

        handleSelectionChange(val) {
          this.multipleSelection = val;
        },
        changeSex(value){
          if(value==1){
            return "男"
          }
          return  "女"
        },
        changeDate(value){
          return moment(value).format("YYYY-MM-DD HH:MM:SS")
        },
        handleEdit(index, row) {
          this.entitymod=row;
          this.imageUrl="";
          this.dialogVisible1=true;
          this.dialogVisible=false;
          this.dialogVisible2=false;

          console.log(index, row);
        },
        bdRole(index, row) {
          var leval=this.userInfo.roleInfo.leval;
          if(this.userInfo.roleInfo.leval==4){
              leval=this.userInfo.roleInfo.leval-1;
          }
          if(row.id==this.userInfo.id){
            this.$message({
              message: '你无法为自己绑定角色',
              type: 'error',
              duration:'1000'
            });
            return;
          }

          if(row.roleInfo.leval<=this.userInfo.roleInfo.leval){
            this.$message({
              message: '你没有为上级和平级绑定角色',
              type: 'error',
              duration:'1000'
            });
            return;
          }

          this.userId=row.id;
          this.dialogVisible2=true;
          this.dialogVisible1=false;
          this.dialogVisible=false;
          this.$axios.post(this.domain.serverpath+"findRole",{leval:this.userInfo.roleInfo.leval}).then((res)=>{
            this.options=res.data;
          }).catch((x)=>{
            this.$message({
              message: '你没有操作权限',
              type: 'error',
              duration:'1000'
            });
          })
          console.log(index, row);
        },

        handleDelete(index, row) {

          if(row.id==this.userInfo.id){

            this.$message({
              message: '你无法删除你自己',
              type: 'error',
              duration:'1000'
            });
            return
          }

          if(this.userInfo.roleInfo.leval>=row.roleInfo.leval){
            this.$message({
              message: '你没有删除该用户的权限',
              type: 'error',
              duration:'1000'
            });
            return
          }



          this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$axios.post(this.domain.serverpath+"deleteYh?id="+row.id).then((res)=>{

              if(res.code=200){
                this.$message({
                  message: '恭喜你，删除成功',
                  type: 'success',
                  duration:'1000'
                });
                this.getList(1,this.pageInfo.pageSize);
              }else{
                this.$message({
                  message: '删除失败',
                  type: 'error',
                  duration:'1000'
                });
              }
            }).catch((x)=>{
              this.$message({
                message: '你没有操作权限',
                type: 'error',
                duration:'1000'
              });
            })

          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
        handleSizeChange(val) {
          this.pageInfo.pageSize=val;
          this.getList(this.pageInfo.page,val);
          console.log(`每页 ${val} 条`);

        },
        handleCurrentChange(val) {
          this.pageInfo.page=val;
          this.getList(val,this.pageInfo.pageSize);
          console.log(`当前页: ${val}`);
        },
        handleClose(done) {
          this.$refs.dowloudExcel.clearFiles();
          this.dialogVisible=false;
          this.dialogVisible2=false;
          this.dialogVisible1=false;
          this.entitymod={};
          this.imageUrl="";

          this.getList(this.pageInfo.page,this.pageInfo.pageSize);
        },
        add(){
          this.dialogVisible=true;
          this.dialogVisible1=false;
          this.dialogVisible2=false;
          this.entitymod={sex:1,tel:""};
          this.imageUrl="";
        },

        handleAvatarChange(file) {

          this.imageUrl = URL.createObjectURL(file.raw);
        },
        handleAvatarSuccess(res){
          this.$refs.dowloudExcel.clearFiles();
          if(res.code==500){
            this.$message({
              message: '登录名已经存在',
              type: 'error',
              duration:'1000'
            });
          }else if(res.code==413){

            this.$message({
              message: res.result,
              type: 'error',
              duration:'2000'
            });
          }else if(res.code==415){
            this.$message({
              message: '手机号已经注册过',
              type: 'error',
              duration:'1000'
            });
          }else{
            this.$message({
              message: '恭喜你，操作成功',
              type: 'success',
              duration:'1000'
            });

            this.dialogVisible=false;
            this.dialogVisible1=false;
            this.dialogVisible2=false;

            this.getList(1,this.pageInfo.pageSize);
          }

        },

        beforeAvatarError(){
          this.$message({
            message: '操作失败',
            type: 'error',
            duration:'1000'
          });
        },
        beforeAvatarUpload(file) {

          const isLt2M = file.size / 1024 / 1024 < 2;
          if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
          }

          return isLt2M;
        },
        save(){
          if(this.entitymod.userName==null||this.entitymod.userName===""){
            this.$message({
              message: '用户名不能为空',
              type: 'error',
              duration:'1000'
            });
            return;
          }
          if(this.entitymod.loginName==null||this.entitymod.loginName===""){
            this.$message({
              message: '登录名不能为空',
              type: 'error',
              duration:'1000'
            });
            return;
          }
          if(this.entitymod.password==null||this.entitymod.password===""){
            this.$message({
              message: '密码不能为空',
              type: 'error',
              duration:'1000'
            });
            return;
          }
          var patrn=/^(\w){6,20}$/;
          if(!patrn.test(this.entitymod.password)){
            this.$message({
              message: '密码格式不正确',
              type: 'error',
              duration:'1000'
            });
            return;
          }
          if(this.entitymod.qpassWord===null||this.entitymod.qpassWord===""){
            this.$message({
              message: '确认密码不能为空',
              type: 'error',
              duration:'1000'
            });
            return;
          }

          if(this.entitymod.password!=this.entitymod.qpassWord){
            this.$message({
              message: '两次密码不一样',
              type: 'error',
              duration:'1000'
            });
            return;
          }
          var reg = /(^1\d{10}$)|(^[0-9]\d{7}$)/;
          var re = new RegExp(reg);
          if(!re.test(this.entitymod.tel)){
            this.$message({
              message: '手机号格式不正确',
              type: 'error',
              duration:'1000'
            });
            return;
          }
          if(this.imageUrl!=null&&this.imageUrl!="") {
            this.$refs.upload.submit();
          }else{
            this.$axios.post(this.domain.serverpath+"addYh",this.entitymod).then((res)=>{
              if(res.data.code==500){

                this.$message({
                  message: '登录名已经存在',
                  type: 'error',
                  duration:'1000'
                });
              }else{
                this.$message({
                  message: '恭喜你，操作成功',
                  type: 'success',
                  duration:'1000'
                });

                this.dialogVisible=false;
                this.dialogVisible1=false;
                this.dialogVisible2=false;
                this.getList(1,this.pageInfo.pageSize);
              }
            }).catch((x)=>{
              this.$message({
                message: '你没有操作权限',
                type: 'error',
                duration:'1000'
              });
            })
          }

        },
         update(){
      if(this.entitymod.userName==null||this.entitymod.userName===""){
        this.$message({
          message: '用户名不能为空',
          type: 'error',
          duration:'1000'
        });
        return;
      }
      if(this.entitymod.loginName==null||this.entitymod.loginName===""){
        this.$message({
          message: '登录名不能为空',
          type: 'error',
          duration:'1000'
        });
        return;
      }
           var reg = /(^1\d{10}$)|(^[0-9]\d{7}$)/;
           var re = new RegExp(reg);
           if(!re.test(this.entitymod.tel)){
             this.$message({
               message: '手机号格式不正确',
               type: 'error',
               duration:'1000'
             });
             return;
           }


      if(this.imageUrl!=null&&this.imageUrl!="") {

        this.$refs.upload1.submit();
      }else{
        this.$axios.post(this.domain.serverpath+"updateYh",this.entitymod).then((res)=>{
          if(res.data.code==500){

            this.$message({
              message: '登录名已经存在',
              type: 'error',
              duration:'1000'
            });
          }else{
            this.$message({
              message: '恭喜你，操作成功',
              type: 'success',
              duration:'1000'
            });

            this.dialogVisible=false;
            this.dialogVisible1=false;
            this.dialogVisible2=false;
            this.getList(1,this.pageInfo.pageSize);
          }
        }).catch((x)=>{
          this.$message({
            message: '你没有操作权限',
            type: 'error',
            duration:'1000'
          });
        })
      }

    },
        downExcel(){
          if(this.pageInfo.page==null){
            this.pageInfo.page=1
          }
          if(this.where.dt1==null){
            this.where.dt1=""
          }
          if(this.where.dt2==null){
            this.where.dt2=""
          }
          if(this.where.name==null){
            this.where. name=""
          }
          this.$axios.post(this.domain.serverpath+"downexcel" +
            "?page="+this.pageInfo.page+"&pageSize="+this.pageInfo.pageSize+"&sex="+this.where.sex+"&dt1="+this.where.dt1+"&dt2="+this.where.dt2+"&name="+this.where.name).then((res)=>{

            if(res.data.code==500){

              this.$message({
                message: '导出失败',
                type: 'error',
                duration:'1000'
              });
            }else{
              this.$message({
                message: '导出成功',
                type: 'success',
                duration:'1000'
              });
              }
          }).catch((x)=>{
            this.$message({
              message: '你没有操作权限',
              type: 'error',
              duration:'1000'
            });
          })




        },






      }
    }
</script>

<style scoped>

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
</style>
