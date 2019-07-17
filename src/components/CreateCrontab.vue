<template>
  <a-form :form="form">
    <a-form-item v-bind="formItemLayout" label="name">
      <a-input v-decorator="[ 'crontab_name',{ rules: [{required: true, message: 'Please input crontab name'}]}]"/>
    </a-form-item>
    <a-form-item v-bind="formItemLayout" label="job">
      <a-input v-decorator="[ 'job',{ rules: [{required: true, message: 'Please input job name'}]}]"/>
    </a-form-item>
    <a-form-item v-bind="formItemLayout" label="minute">
      <a-input v-decorator="[ 'minute',{ rules: [{initialValue: minute, message: 'Please input minute'}]}]"/>
    </a-form-item>
    <a-form-item v-bind="formItemLayout" label="hour">
      <a-input v-decorator="[ 'hour',{ rules: [{initialValue: hour, message: 'Please input hour'}]}]"/>
    </a-form-item>
    <a-form-item v-bind="formItemLayout" label="day">
      <a-input v-decorator="[ 'day',{ rules: [{initialValue: day, message: 'Please input day'}]}]"/>
    </a-form-item>
    <a-form-item v-bind="formItemLayout" label="month">
      <a-input v-decorator="[ 'month',{ rules: [{initialValue: month, message: 'Please input month'}]}]"/>
    </a-form-item>
    <a-form-item v-bind="formItemLayout" label="week">
      <a-input v-decorator="[ 'week',{ rules: [{initialValue: week, message: 'Please input week'}]}]"/>
    </a-form-item>
    <a-form-item v-bind="tailFormItemLayout">
      <a-button type="primary" html-type="submit" @click="handleSubmit">Create</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import request from '../utils/request'
import { setTimeout } from 'timers';

export default {
  props: {
      visible: Boolean,
  },
  data () {
    return {
      minute : '*',
      hour: '*',
      day: '*',
      month: '*',
      week: '*',
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
  mounted(){
      setTimeout(() => {
        this.form.setFieldsValue({minute: "*"})
        this.form.setFieldsValue({hour: "*"})
        this.form.setFieldsValue({day: "*"})
        this.form.setFieldsValue({month: "*"})
        this.form.setFieldsValue({week: "*"})
      }, 1000)
  },
  methods: {
    handleSubmit  (e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
            this.$store.dispatch({ type: "form/submitCreateCrontab", values});
            this.$emit("update:visible", false);
        }
      });
    }
    // cache(){
    //     this.$router.push("/inventory/crontab")
    // }
  },
};
</script>
<style scoped>

</style>