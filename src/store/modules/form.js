import router from "../../router";
import request from "../../utils/request";
import { notification } from "ant-design-vue";

const state = {
  step: {
    payAccount: "123456"
  },
  assetCron: {
    asset_id: Number(),
    asset_name: String()
  }
};

const actions = {
  async submitStepForm({ commit }, { payload }) {
    await request({
      url: "/api/v1.0/cron/form",
      method: "POST",
      data: payload
    });
    commit("saveStepFormData", { payload });
    router.push("/form/step-form/result");
  },
  // logout: context => {
  //   context.commit('removeStorage')
  // },
  async submitCreateAsset({ commit }, data) {
    await request({
      url: "/api/v1.0/assets",
      method: "POST",
      data: data.values
    }).then(response => {
      if (response.data.code !== 200) {
        notification.info({
          // eslint-disable-next-line no-unused-vars
          message: h => (
            <div>
              请求错误 <span style="color: red">{status}</span>
            </div>
          ),
          description: response.data.msg
        });
      } else {
        notification.success({
          // eslint-disable-next-line no-unused-vars
          message: h => (
            <div>
              创建成功,请刷新 <span style="color: green">OK</span>
            </div>
          ),
          description: "创建成功,请刷新"
        });
      }
    });
  },
  async submitCreateAssetUser({ commit }, data) {
    await request({
      url: "/api/v1.0/assets/users",
      method: "POST",
      data: data.values
    }).then(response => {
      if (response.data.code !== 200) {
        notification.info({
          // eslint-disable-next-line no-unused-vars
          message: h => (
            <div>
              请求错误 <span style="color: red">{status}</span>
            </div>
          ),
          description: response.data.msg
        });
      } else {
        notification.success({
          // eslint-disable-next-line no-unused-vars
          message: h => (
            <div>
              创建成功,请刷新 <span style="color: green">OK</span>
            </div>
          ),
          description: "创建成功,请刷新"
        });
      }
    });
  },
  async submitCreateCrontab({ commit }, data) {
    await request({
      url: "/api/v1.0/cron",
      method: "POST",
      data: data.values
    }).then(response => {
      if (response.data.code !== 200) {
        notification.info({
          // eslint-disable-next-line no-unused-vars
          message: h => (
            <div>
              请求错误 <span style="color: red">{status}</span>
            </div>
          ),
          description: response.data.msg
        });
      } else {
        notification.success({
          // eslint-disable-next-line no-unused-vars
          message: h => (
            <div>
              创建成功,请刷新 <span style="color: green">OK</span>
            </div>
          ),
          description: "创建成功,请刷新"
        });
      }
    });
  },
  async submitCreateAssetCrontab({ commit }, data) {
    await request({
      url: "/api/v1.0/cron/assets",
      method: "POST",
      data: data.values
    }).then(response => {
      if (response.data.code !== 200) {
        notification.info({
          // eslint-disable-next-line no-unused-vars
          message: h => (
            <div>
              请求错误 <span style="color: red">{status}</span>
            </div>
          ),
          description: response.data.msg
        });
      } else {
        notification.success({
          // eslint-disable-next-line no-unused-vars
          message: h => (
            <div>
              创建成功,请刷新 <span style="color: green">OK</span>
            </div>
          ),
          description: "创建成功,请刷新"
        });
      }
    });
  }
};

const mutations = {
  saveStepFormData(state, { payload }) {
    state.step = {
      ...state.step,
      ...payload
    };
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
