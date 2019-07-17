<template>
  <a-form :form="form">
    <a-form-item v-bind="formItemLayout" label="name">
      <a-input v-decorator="[ 'hostname',{ rules: [{required: true, message: 'Please input name'}]}]"/>
    </a-form-item>
    <a-form-item v-bind="formItemLayout" label="ip">
      <a-input v-decorator="[ 'ip',{ rules: [{required: true, message: 'Please input Ip'}]}]"/>
    </a-form-item>
    <a-form-item v-bind="formItemLayout" label="port">
      <a-input v-decorator="[ 'port',{ rules: [{required: true, message: 'Please input port'}]}]"/>
    </a-form-item>
    <a-form-item v-bind="formItemLayout" label="user">
        <a-select style="width: 120px" @change="handleSelectChange" v-decorator="['user_id', {rules: [{ required: true, message: 'Please select user!' }]}]">
        <a-select-option v-for="user in assetUserInfo " :key="user.id" :value="user.id">{{ user.name }}</a-select-option>
        </a-select>
    </a-form-item>
    <a-form-item v-bind="tailFormItemLayout">
      <a-button type="primary" html-type="submit" @click="handleSubmit">Create</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import request from '../utils/request'

export default {
  props: {
      visible: Boolean,
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
      assetUserInfo: []
    };
  },
  beforeCreate () {
    this.form = this.$form.createForm(this);
  },
  mounted () {
    this.getAssetUserData()
  },
  methods: {
    handleSubmit  (e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
            this.$store.dispatch({ type: "form/submitCreateAsset", values});
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
    getAssetUserData() {
        request({
            url: '/api/v1.0/assets/users',
            method: 'get',
            params: {per_page: 0}
        }).then(
            response => {
                this.assetUserInfo = response.data.data.value
            }
        )
    }
  },
};
</script>
<style scoped>

</style>
