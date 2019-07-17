import Vue from "vue";
import Router from "vue-router";
import findLast from "loadsh/findLast";
import NotFound from "./views/404.vue";
import Forbidden from "./views/403.vue";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { check, isLogin } from "./utils/auth";
import { notification } from "ant-design-vue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      meta: { authority: ["user", "admin"] },
      component: () =>
        import(/* webpackChunkName: "layout" */ "./layouts/BasicLayout"),
      children: [
        {
          path: "/",
          redirect: "/dashboard/analysis"
        },
        {
          path: "/dashboard",
          name: "dashboard",
          meta: { icon: "dashboard", title: "仪表盘" },
          component: { render: h => h("router-view") },
          children: [
            {
              path: "/dashboard/analysis",
              name: "analysis",
              meta: { title: "分析页" },
              component: () =>
                import(/* webpackChunkName: "dashboard" */ "./views/Dashboard/Analysis")
            }
          ]
        },
        {
          path: "/form",
          name: "form",
          hideInMenu: true,
          component: { render: h => h("router-view") },
          meta: { icon: "form", title: "表盘", authority: ["admin"] },
          children: [
            {
              path: "/form/basic-form",
              name: "basicform",
              meta: { title: "基础表单" },
              component: () =>
                import(/* webpackChunkName: "form" */ "./views/Forms/BasicForm")
            },
            {
              path: "/form/step-form",
              name: "stepform",
              meta: { title: "分布表单" },
              hideChildrenInMenu: true,
              component: () =>
                import(/* webpackChunkName: "form" */ "./views/Forms/StepForm"),
              children: [
                {
                  path: "/form/step-form",
                  redirect: "/form/step-form/info"
                },
                {
                  path: "/form/step-form/info",
                  name: "info",
                  component: () =>
                    import(/* webpackChunkName: "form" */ "./views/Forms/StepForm/Step1")
                },
                {
                  path: "/form/step-form/confirm",
                  name: "confirm",
                  component: () =>
                    import(/* webpackChunkName: "form" */ "./views/Forms/StepForm/Step2")
                },
                {
                  path: "/form/step-form/result",
                  name: "result",
                  component: () =>
                    import(/* webpackChunkName: "form" */ "./views/Forms/StepForm/Step3")
                }
              ]
            }
          ]
        },
        {
          path: "/asset",
          name: "asset",
          component: { render: h => h("router-view") },
          meta: {
            icon: "deployment-unit",
            title: "资产",
            authority: ["admin", "user"]
          },
          children: [
            {
              path: "/asset/list",
              name: "listAsset",
              meta: { title: "资产列表" },
              component: () =>
                import(/* webpackChunkName: "asset" */ "./views/Asset/ListAsset")
            }
          ]
        },
        {
          path: "/user",
          name: "user",
          component: { render: h => h("router-view") },
          meta: {
            icon: "user",
            title: "用户",
            authority: ["admin", "user"]
          },
          children: [
            {
              path: "/user/asset-user",
              name: "ListAssetUser",
              meta: { title: "资产用户" },
              component: () =>
                import(/* webpackChunkName: "user" */ "./views/User/AssetUser")
            }
          ]
        },
        {
          path: "/inventory",
          name: "inventory",
          component: { render: h => h("router-view") },
          meta: {
            icon: "file",
            title: "配置管理",
            authority: ["admin", "user"]
          },
          children: [
            {
              path: "/inventory/crontab",
              name: "ListCrontab",
              meta: { title: "计划任务" },
              component: () =>
                import(/* webpackChunkName: "user" */ "./views/Inventory/crontab")
            }
          ]
        }
      ]
    },
    // {
    //   path: "/user",
    //   // component: { render: h => h("router-view") },
    //   hideInMenu: true,
    //   component: () =>
    //     import(/* webpackChunkName: "layout" */ "./layouts/UserLayouts"),
    //   children: [
    //     {
    //       path: "/user",
    //       redirect: "/user/login"
    //     },
    //     {
    //       path: "/user/login",
    //       name: "login",
    //       component: () =>
    //         import(/* webpackChunkName: "user" */ "./views/User/Login")
    //     },
    //     {
    //       path: "/user/register",
    //       name: "register",
    //       component: () =>
    //         import(/* webpackChunkName: "user" */ "./views/User/Register")
    //     }
    //   ]
    // },
    {
      path: "/403",
      name: "403",
      component: Forbidden,
      hideInMenu: true
    },
    {
      path: "*",
      name: "404",
      component: NotFound,
      hideInMenu: true
    }
  ]
});

router.beforeEach((to, form, next) => {
  if (to.path !== form.path) {
    NProgress.start();
  }
  const record = findLast(to.matched, record => record.meta.authority);
  if (record && !check(record.meta.authority)) {
    if (!isLogin() && to.path !== "/user/login") {
      next({
        path: "/user/login"
      });
    } else if (to.path !== "/403") {
      notification.error({
        message: "403",
        description: "你没有权限访问, 请联系管理员咨询"
      });
      next({
        path: "/403"
      });
    }
    NProgress.done();
  }
  next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
