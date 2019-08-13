<template>
      <div>
        <div>
          <el-form :inline="true" :model="where" class="demo-form-inline">
            <el-form-item label="角色名称">
              <el-input v-model="where.name" placeholder="角色名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getList()">查询</el-button>

            </el-form-item>
          </el-form>

        </div>
        <el-button    type="primary" @click="add()">+新增角色</el-button>
        <template>
          <el-table
            ref="multipleTable"
            :data="tableData"
            border
            tooltip-effect="dark"
            style="width: 100%">
            <el-table-column
              prop="id"
              label="序号"
              width="200">
            </el-table-column>

            <el-table-column

              label="角色名"
              width="300">
              <template slot-scope="scope">
                <el-popover
                  placement="top-start"
                  title="用户信息"
                  width="200"
                  trigger="hover">

                  <div>角色名：{{scope.row.roleName}}</div>
                  <div>角色描述：{{scope.row.miaoShu}}</div>

                  <div > 绑定的用户：<template v-for="item in scope.row.userInfos"><br>{{item.userName+""}} </template></div>
                  <el-button slot="reference">{{scope.row.roleName}}</el-button>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              prop="miaoShu"
              label="角色描述"
              width="300">
            </el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">

                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)" v-if="scope.row.id!=pid">删除</el-button>
                <el-button   size="mini" type="primary" @click="bdQx(scope.$index, scope.row)"  v-if="scope.row.id!=pid">绑定权限</el-button>

              </template>
            </el-table-column>
          </el-table>
        </template>
        `
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="where.page"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="where.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
        <div>
          <el-dialog
            title="添加角色"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <el-form label-width="100px" ref="entitymod" :model="entitymod">

              <el-form-item label="角色名称">
                <el-input type="text" v-model="entitymod.roleName" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="角色描述">
                <el-input type="text" v-model="entitymod.miaoShu" autocomplete="off"></el-input>
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
            title="编辑角色"
            :visible.sync="dialogVisible1"
            width="40%"
            :before-close="handleClose">
            <el-form label-width="100px" ref="entitymod" :model="entitymod">

              <el-form-item label="角色名称">
                <el-input type="text" v-model="entitymod.roleName" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="角色描述">
                <el-input type="text" v-model="entitymod.miaoShu" autocomplete="off"></el-input>
              </el-form-item>

            </el-form>
            权限列表信息
            <el-tree
              :data="data"
              show-checkbox
              default-expand-all
              node-key="id"
              ref="tree"
              highlight-current

              :props="defaultProps">
            </el-tree>


            <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose">取 消</el-button>
    <el-button type="primary" @click="getCheckedKeys">确 定</el-button>
  </span>
          </el-dialog>

        </div>
      </div>
</template>

<script>
    export default {
        name: "juese",
        data(){
          return{
            tableData:[],
            where:{
              name:"",
              page:1,
              pageSize:5,

            },
            total:5,
            pid:this.$store.state.userInfo.roleInfo.id,
            entitymod:{},
            dialogVisible:false,
            dialogVisible1:false,
            data: [],
            defaultProps: {
              children: 'menuInfoList',
              label: 'menuName'
            },



          }
        },
        mounted() {
          this.$axios.post(this.domain.serverpath+"findMenu").then((res)=>{
            this.data=res.data;
          })
          this.getList(1,this.where.pageSize);
        },
        methods:{

          getCheckedKeys() {
           let k1=this.$refs.tree.getCheckedKeys()
            let k2=this.$refs.tree.getHalfCheckedKeys();
            let k3=[];
            k3=k3.concat(k1).concat(k2);

          this.entitymod.ids=k3;

            this.$axios.post(this.domain.serverpath+"addRm",this.entitymod).then((res)=>{

              if(res.code=200){
                this.$message({
                  message: '恭喜你，绑定成功',
                  type: 'success',
                  duration:'1000'
                });
                this.dialogVisible=false;
                this.dialogVisible1=false;
                this.getList(1,this.where.pageSize);
              }else{
                this.$message({
                  message: '绑定失败',
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
          },

          //查询方法
          getList(page,pageSize){
            if(page==null){
              page=1
            }

            if(this.where.name==null){
              this.where.name=""
            }
            pageSize= this.where.pageSize;
            this.$axios.post(this.domain.serverpath+"selectRole",this.where).then((res)=>{

              this.tableData=res.data.content;
              this.total=res.data.totalElements;
            })
          },
          //删除方法
          handleDelete(index, row) {

            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$axios.post(this.domain.serverpath+"delRole?id="+row.id).then((res)=>{

                if(res.code=200){
                  this.$message({
                    message: '恭喜你，删除成功',
                    type: 'success',
                    duration:'1000'
                  });
                  this.getList(1,this.where.pageSize);
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
            this.where.pageSize=val;
            this.getList(this.where.page,val);
            console.log(`每页 ${val} 条`);

          },
          handleCurrentChange(val) {
            this._w.page=val;
            this.getList(val,this.where.pageSize);
            console.log(`当前页: ${val}`);
          },
          add(){
            this.dialogVisible=true;
            this.dialogVisible1=false;
            this.entitymod={};

          },
          handleClose(done) {
            this.dialogVisible=false;
            this.dialogVisible1=false;
            this.entitymod={};
            this.getList(this.where.page,this.where.pageSize)
          },
          save(){
            if(this.entitymod.roleName==null||this.entitymod.roleName===""){
              this.$message({
                message: '角色名称不能为空',
                type: 'error',
                duration:'1000'
              });
              return;
            }
            if(this.entitymod.miaoShu==null||this.entitymod.miaoShu===""){
              this.$message({
                message: '登录名不能为空',
                type: 'error',
                duration:'1000'
              });
              return;
            }



              this.$axios.post(this.domain.serverpath+"addRole",this.entitymod).then((res)=>{
                if(res.data.code==500){

                  this.$message({
                    message: '角色名已经存在',
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
                  this.getList(1,this.where.pageSize);
                }
              }).catch((x)=>{
                this.$message({
                  message: '你没有操作权限',
                  type: 'error',
                  duration:'1000'
                });
              })
            },
          bdQx(index, row) {
            this.entitymod=row;


            this.dialogVisible=false;



            this.dialogVisible1=true;  setTimeout(()=>{
              this.$refs.tree.setCheckedNodes(row.menuInfoList.filter(i=>i.leval == 4));
            },0)

          },



        }

    }
</script>

<style scoped>

</style>
