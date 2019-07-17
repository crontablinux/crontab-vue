<template>
  <a-form :form="form">
    <a-form-item v-bind="formItemLayout" label="name">
      <a-input v-decorator="[ 'name',{ rules: [{required: true, message: 'Please input username'}]}]"/>
    </a-form-item>
    <a-form-item v-bind="formItemLayout" label="password">
      <a-input v-decorator="[ 'password',{ rules: [{required: true, message: 'Please input password'}]}]"/>
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
  methods: {
    handleSubmit  (e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
            this.$store.dispatch({ type: "form/submitCreateAssetUser", values});
            this.$emit("update:visible", false);
        }
      });
    },
    cache(){
        this.$router.push("/user/asset-user")
    },
    handleSelectChange(value) {
      console.log(`selected ${value}`);
    },
  },
};
</script>
<style scoped>

</style>