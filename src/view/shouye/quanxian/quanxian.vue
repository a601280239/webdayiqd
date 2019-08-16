<template>
  <div>
    <el-input
      placeholder="输入关键字进行过滤"
      v-model="filterText">
    </el-input>

    <el-tree
      class="filter-tree"
      :data="data"
      :props="defaultProps"
      default-expand-all
      show-checkbox
      node-key="id"
      :filter-node-method="filterNode"
      ref="tree"
      @node-click="handleNodeClick">
    </el-tree>
    <div>
      <div  v-if="userInfo.authmap.addMenu!=null||userInfo.authmap.delMenu!=null||userInfo.authmap.updateMenu!=null">
        <el-dialog
          :title="menuName"
          :visible.sync="dialogVisible"

          width="33%"
          :before-close="handleClose">
          <el-row>
            <el-button icon="el-icon-plus" circle @click="addMenu"  v-if="userInfo.authmap.addMenu!=null"></el-button>
            <el-button type="primary" icon="el-icon-edit" circle @click="updateMenu"    v-if="userInfo.authmap.updateMenu!=null"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle @click="deleteMenu"   v-if="userInfo.authmap.delMenu!=null"></el-button>
            <el-button type="warning" icon="el-icon-star-off" circle @click="ownAddMenu"   v-if="userInfo.authmap.addMenu!=null"></el-button>
          </el-row>
          <hr/>
          <el-form :inline="true" :model="entitymod" :hidden="addHidden"  v-if="entitymod.leval!=4" label-position="left" >
            <div>
              <el-form-item label="+添加子菜单">

              </el-form-item>
            </div>
            <div>
            <el-form-item label="当前菜单等级:">
            {{entitymod.leval}}
            </el-form-item>
            </div>
            <div>
            <el-form-item label="当前菜单名称">
              {{entitymod.menuName}}
            </el-form-item>
            </div>
            <div>
            <el-form-item label="当前菜单ID">
              {{entitymod.id}}
            </el-form-item>
            </div>
            <el-form-item label="新添加子菜单的名称">
              <el-input v-model="entitymod.menuNameAdd" placeholder="新添加子菜单的名称"></el-input>
            </el-form-item>
            <el-form-item label="新添加子菜单访问的URL" v-if="entitymod.leval>=3">
              <el-input v-model="entitymod.urlAdd" placeholder="菜单访问的URL" ></el-input>
            </el-form-item>

          </el-form>
          <el-form :inline="true" :model="entitymod" :hidden="updateHidden"   label-position="left"   >
            <el-form-item label="修改菜单"  label-width="150px">

            </el-form-item>

            <div>
              <el-form-item label="当前菜单等级:">
                {{entitymod.leval}}
              </el-form-item>
            </div>
            <div>
              <el-form-item label="当前菜单名称">
                {{entitymod.menuName}}
              </el-form-item>
            </div>
            <div>
              <el-form-item label="当前菜单ID">
                {{entitymod.id}}
              </el-form-item>
            </div>

            <el-form-item label="菜单的名称">
              <el-input v-model="entitymod.menuName" placeholder="新添加子菜单的名称"></el-input>
            </el-form-item>
            <el-form-item label="菜单访问的URL" v-if="entitymod.leval>2">
              <el-input v-model="entitymod.url" placeholder="菜单访问的URL" ></el-input>
            </el-form-item>

          </el-form>
          <el-form :inline="true" :model="entitymod" :hidden="deleteHidden"  label-position="left"  >
            <el-form-item label="删除菜单" >

            </el-form-item>
            <div>
              <el-form-item label="当前菜单等级:">
                {{entitymod.leval}}
              </el-form-item>
            </div>
            <div>
              <el-form-item label="当前菜单名称">
                {{entitymod.menuName}}
              </el-form-item>
            </div>
            <div>
              <el-form-item label="当前菜单ID">
                {{entitymod.id}}
              </el-form-item>
            </div>

            <el-form-item>
            你确定你要删除吗？
            </el-form-item>

          </el-form>

          <el-form :inline="true" :model="entitymod" :hidden="addOwnMenu"   label-position="left"   >
            <el-form-item label="添加一级菜单"  label-width="150px">

            </el-form-item>



            <el-form-item label="菜单的名称">
              <el-input v-model="entitymod.menuNameAdd" placeholder="新添加一级菜单的名称"></el-input>
            </el-form-item>


          </el-form>

          <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="getCheckedKeys">确 定</el-button>
        </span>
        </el-dialog>

      </div>

    </div>
  </div>
</template>

<script>
    export default {
        name: "quanxian",
      data() {
        return {
          filterText: '',
          data: [],
          defaultProps: {
            children: 'menuInfoList',
            label: 'menuName'
          },
          entitymod:{},
          dialogVisible:false,
          menuName:"当前工作的菜单名称-",
          addHidden:true,
          updateHidden:true,
          deleteHidden:true,
          addOwnMenu:true,
          userInfo:JSON.parse(window.localStorage.getItem("userInfo")),

        };
      },
      mounted(){
        this.getList();
      },
      watch: {


        filterText(val) {

          this.$refs.tree.filter(val);
        }
      },

      methods: {
        getList(){
          this.$axios.post(this.domain.serverpath+"findAllMenu").then((res)=>{
            this.data=res.data;
          }).catch((x)=>{
          this.$message({
            message: '你没有操作权限',
            type: 'error',
            duration:'1000'
          });
        })
        },
        filterNode(value, data) {

          if (!value) return true;
          return data.menuName.indexOf(value) !== -1;
        },
        handleNodeClick(data) {
          this.dialogVisible=true;
          this.entitymod=data;
          this.menuName="当前工作的菜单名称-"+this.entitymod.menuName;
          if(this.entitymod.leval==4){
            this.addHidden=true;
            this.updateHidden=false;
            this.deleteHidden=true;
            this.addOwnMenu=true;
          }else{
            this.addHidden=false;
            this.updateHidden=true;
            this.deleteHidden=true;
            this.addOwnMenu=true;
          }

        },
        handleClose(done) {
          this.dialogVisible=false;
          this.addHidden=true;
           this.updateHidden=true;
          this.deleteHidden=true;
          this.addOwnMenu=true;

          this.entitymod={};
          this.getList();
        },

        addMenu(){
          if(this.entitymod.leval==4){
            this.$message({
              message: '当前菜单不能添加子菜单',
              type: 'warning',
              duration:'1000'
            });
          }else{
            this.addHidden=false;
            this.updateHidden=true;
            this.deleteHidden=true;
            this.addOwnMenu=true;
          }

        },
        updateMenu(){
          alert(this.entitymod.leval);
          this.addHidden=true;
          this.updateHidden=false;
          this.deleteHidden=true;
          this.addOwnMenu=true;
        },
        deleteMenu(){
          if(this.userInfo.roleInfo.leval!=1){
            this.$message({
              message: '只有一级管理员有权限删除',
              type: 'warning',
              duration:'1000'
            });
            return;
          }

          this.addHidden=true;
          this.updateHidden=true;
          this.deleteHidden=false;
          this.addOwnMenu=true;
          var id=this.entitymod.id;
          this.$refs.tree.setCheckedKeys([id]);
        },
        ownAddMenu(){
          if(this.userInfo.roleInfo.leval!=1){
            this.$message({
              message: '只有一级管理员有权限添加',
              type: 'warning',
              duration:'1000'
            });
            return;
          }
          this.addHidden=true;
          this.updateHidden=true;
          this.deleteHidden=true;
          this.addOwnMenu=false;
        },
        getCheckedKeys() {

          this.entitymod.urid=this.userInfo.roleInfo.id;
          this.entitymod.uleval=this.userInfo.roleInfo.leval;
          alert(this.entitymod.uleval);

           var url="";
           if(this.addHidden==false){
             url="addMenu";
             if(this.entitymod.menuNameAdd==null||this.entitymod.menuNameAdd==""){
               this.$message({
                 message: '新添加子菜单名称不能为空',
                 type: 'warning',
                 duration:'1000'
               });
               return;
             }



             this.entitymod.parentId=this.entitymod.id;
             this.entitymod.leval=this.entitymod.leval+1;
             this.entitymod.menuName=this.entitymod.menuNameAdd;
             this.entitymod.url=this.entitymod.urlAdd;
           }
            if(this.addOwnMenu==false){
                url="addMenu";
                this.entitymod.leval=1;
                this.entitymod.parentId=0;
                this.entitymod.menuName=this.entitymod.menuNameAdd;
                this.entitymod.url=""
              if(this.entitymod.menuNameAdd==null||this.entitymod.menuNameAdd==""){
                this.$message({
                  message: '菜单名称不能为空',
                  type: 'warning',
                  duration:'1000'
                });
                return;
              }
            }
          if(this.updateHidden==false){

            url="updateMenu";
            if(this.entitymod.menuName==null||this.entitymod.menuName==""){
              this.$message({
                message: '菜单名称不能为空',
                type: 'warning',
                duration:'1000'
              });
              return;
            }

          }
          if(this.deleteHidden==false){
            let ids=this.$refs.tree.getCheckedKeys();
            this.entitymod.ids=ids;
            url="delMenu";

          }
            console.log(this.entitymod);
          this.$axios.post(this.domain.serverpath+url,this.entitymod).then((res)=>{


              this.$message({
                message: '恭喜你，操作成功',
                type: 'success',
                duration:'1000'
              })
            this.dialogVisible=false;
            this.addHidden=true;
            this.updateHidden=true;
            this.deleteHidden=true;
            this.addOwnMenu=true;

              this.getList();

          }).catch((x)=>{
            this.$message({
              message: '你没有操作权限',
              type: 'error',
              duration:'1000'
            });
          })

        },

      },

    }
</script>

<style scoped>

</style>
