<template>
    <div :class="[`nav-theme-${navTheme}`, `nav-layout-${navLayout}`]">
        <a-layout id="components-layout-demo-side" style="min-height: 100vh">
        <a-layout-sider
            v-if="navLayout === 'left'"
            :trigger="null" 
            collapsible 
            v-model="collapsed" 
            :theme="navTheme"
            width="256px">
            <div class="logo">Crontab Linux</div>
            <SiderMenu :theme="navTheme"/>
        </a-layout-sider>
        <a-layout style="background: #fff">
        <a-layout-header style="background: #fff; padding: 0" >
            <a-icon 
                v-auth="['admin']"
                class="trigger" 
                :type="collapsed ? 'menu-unfold': 'menu-fold'" 
                @click="collapsed = !collapsed">
            </a-icon>
            <Header/>
        </a-layout-header>
        <a-layout-content style="margin: 0 16px">
            <router-view></router-view>
        </a-layout-content>
        <a-layout-footer style="text-align: center">
            <Footer/>
        </a-layout-footer>
        </a-layout>
    <Authorized :authority="['admin']">
    <SettingDrawer /> 
    </Authorized>
    </a-layout>
    </div>
</template>

<script>
import Header from './Header'
import Footer from './Footer'
import SiderMenu from './SiderMenu'
import SettingDrawer from '../components/SettingDrawer'

export default {
    components: {
        Header,
        Footer,
        SiderMenu,
        SettingDrawer,
    },
    data() {
        return {
            collapsed: false,
        }
    },
    computed: {
        navTheme() {
            return this.$route.query.navTheme || "dark";
        },
        navLayout() {
            return this.$route.query.navLayout || "left";
        }
    }
}
</script>

<style scoped>
.trigger {
    padding: 0 20px;
    line-height: 64px;
}
.trigger:hover {
    background: #eeeeee;
}
.logo {
    height: 64px;
    line-height: 64px;
    text-align: center;
}
.nav-theme-dark >>> .logo {
    color: #eeeeee
}
/* #components-layout-demo-side .logo {
  height: 32px;
  background: rgba(255,255,255,.2);
  margin: 16px;
} */
</style>
