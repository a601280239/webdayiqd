<template>
      <div>

        {{bbb}}

      </div>
</template>

<script>
    export default {
        name: "shouye",
      data(){
          return{

            bbb:this.$store.state.token,
          }
      }
    }
</script>

<style scoped>

</style>
