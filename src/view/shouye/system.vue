<template>
    <div>

      <el-alert
        :closable="closable"
        title="首页"
        type="success"
        show-icon>
      </el-alert>

      <div style="width:50%;float: left">
        <el-card class="box-card" >
          <div slot="header" class="clearfix">
            <span style="font-weight:bold">新闻公告</span>
          </div>
          <div  class="text item">
             内容
          </div>
        </el-card>
      </div>
      <!-- 6 -->
      <div style="width:50%;float: left">
        <el-card class="box-card" >
          <div slot="header" class="clearfix">
            <span style="font-weight:bold">最近信息</span>

          </div>
          <div  class="text item">
            内容
          </div>
        </el-card>
      </div>
      <br>
      <!-- 7 -->
      <div style="width:50%;float: left">
        <el-card class="box-card" >
          <div slot="header" class="clearfix">
            <span style="font-weight:bold">汇总统计</span>

          </div>
          <div class="text item">
            内容
          </div>
        </el-card>
      </div>
      <!-- 8 -->
      <div style="width:50%;float: left">
        <el-card class="box-card" >
          <div slot="header" class="clearfix">
            <span style="font-weight:bold">类型汇总统计</span>

          </div>
          <div class="text item">
             内容
          </div>

        </el-card>
      </div>
      <!-- 8 -->
      <div style="width:100%;">
        <el-card class="box-card" >

          <div slot="header" class="clearfix">
            <span style="font-weight:bold">统计信息</span>

          </div>
              <div>
                <template>
                  <!--为echarts准备一个具备大小的容器dom-->
                  <div id="main" style="width: 100%;height: 400px;"></div>
                </template>

              </div>


        </el-card>
      </div>
    </div>
</template>

<script>
  import echarts from 'echarts'
    export default {
        name: "system",
        data(){
          return{
            closable:false,
            styleel:{
              left:'200%'
            },
            charts: '',
            /*  opinion: ["1", "3", "3", "4", "5"],*/
            opinionData: ["30", "20", "40", "40", "50"],
            data1:["1", "3", "3", "4", "5"],

          }
        },
      watch:{
        opinionData(v,f){
          this.drawLine('main')
        }
      },
      methods: {
        drawLine(id) {

          this.charts = echarts.init(document.getElementById(id))
          this.charts.setOption({
            title:{
              text:'7天登录数据统计'
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: ['7天登录数']
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },

            toolbox: {
              feature: {
                saveAsImage: {}
              }
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: this.opinionData

            },
            yAxis: {
              type: 'value'
            },

            series: [{
              name: '登录次数',
              type: 'line',
              stack: '总量',
              data: this.data1
            }]
          })
        }
      },
      mounted() {
        this.$axios.post(this.domain.ssoserverpath+"loginCount").then((res)=>{
          console.log(res.data.key1);
          this.opinionData=res.data.key1;
          this.data1=res.data.value1;
        })

        this.$nextTick(function() {
          this.drawLine('main')
        })
      }


    }
</script>

<style scoped>
  .text {
    font-size: 14px;
  }
  .item {
    margin-bottom: 18px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width:99.5%;
  }
  * {
    margin: 0;
    padding: 0;
    list-style: none;
  }

</style>
