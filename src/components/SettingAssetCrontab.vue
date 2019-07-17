<template>
  <a-form :form="form">
    <a-form-item v-bind="formItemLayout" label="hostname">
        <a-select style="width: 200px" @change="handleSelectChange" v-decorator="['asset_id', {initialValue:assetCron.asset_id ,rules: [{ required: false}]}]">
          <a-select-option :key="assetCron.asset_id" :value="assetCron.asset_id">{{ assetCron.asset_name }}</a-select-option>
        </a-select>
    </a-form-item>
    <a-form-item v-bind="formItemLayout" label="crontab">
        <a-select style="width: 200px" @change="handleSelectChange" v-decorator="['crontab_id', {rules: [{ required: true, message: 'Please select crontab!' }]}]">
          <a-select-option v-for="crontab in crontabInfo " :key="crontab.id" :value="crontab.id">{{ crontab.name }} {{ crontab.job }}</a-select-option>
        </a-select>
    </a-form-item>
    <a-form-item v-bind="tailFormItemLayout">
      <a-button type="primary" html-type="submit" @click="handleSubmit">Add</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import request from '../utils/request'

export default {
  props: {
      visible: Boolean,
  },
  computed: {
    assetCron(){
      return this.$store.state.form.assetCron
    }
  },
  data () {
    return {
      confirmDirty: false,
      autoCompleteResult: [],
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      },
      tailFormItemLayout: {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 16,
            offset: 8,
          },
        },
      },
      crontabInfo: []
    };
  },
  beforeCreate () {
    this.form = this.$form.createForm(this);
  },
  mounted () {
    this.getCrontabData(this.assetCron)
  },
  methods: {
    handleSubmit  (e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
            this.$store.dispatch({ type: "form/submitCreateAssetCrontab", values});
            this.$emit("update:visible", false);
        }
      });
    },
    cache(){
        this.$router.push("/asset/list")
    },
    handleSelectChange(value) {
      console.log(`selected ${value}`);
    },
    getCrontabData(assetCron) {
        request({
            url: '/api/v1.0/cron',
            method: 'get',
            params: {per_page: 0, asset_id: '!'+assetCron.asset_id}
        }).then(
            response => {
                this.crontabInfo = response.data.data.value
            }
        )
    }
  },
};
</script>
<style scoped>

</style>
