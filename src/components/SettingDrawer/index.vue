<template>
  <div>
    <!-- <a-button type="primary" @click="showDrawer">
      Open
    </a-button> -->
    <a-drawer
      title="Basic Drawer"
      placement="right"
      :closable="false"
      @close="onClose"
      :visible="visible"
      width="300px"
    >
      <template v-slot:handle>
          <div class="handle" @click="visible = !visible">
              <a-icon :type="visible ? 'close' : 'setting'"></a-icon>
          </div>
      </template>
          <div>
              <h2>整体风格定制</h2>
              <a-radio-group @change="(e)=>handleSettingChange('navTheme', e.target.value)" :value="$route.query.navTheme || 'dark'">
                  <a-radio value="dark">黑色</a-radio>
                  <a-radio value="light">白色</a-radio>
              </a-radio-group>
              <h2>导航模式</h2>
              <a-radio-group @change="(e)=>handleSettingChange('navLayout', e.target.value)" :value="$route.query.navLayout || 'left'">
                  <a-radio value="left">左侧</a-radio>
                  <a-radio value="right">右侧</a-radio>
              </a-radio-group>
        </div>
    </a-drawer>
  </div>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
    }
  },
  methods: {
    onClose () {
      this.visible = false;
    },
    handleSettingChange (type, value) {
        this.$router.push({query: {...this.$route.query, [type]: value}})
    },
  },
//   computed: {
//       navTheme() {
//           return this.$route.query.navTheme || 'dark'
//       },
//       navLayout() {
//           return this.$route.query.navLayout || 'left'
//       }
//   }
}
</script>
<style scoped>
.handle {
    position: absolute;
    top: 240px;
    right: 300px;
    height: 48px;
    width: 48px;
    background: #1890ff;
    color: #fff;
    font-size: 20px;
    text-align: center;
    line-height: 48px;
    border-radius: 3px 0 0 3px;
}
</style>

