<template>
  <div>
    <a-button class="editable-add-btn" @click="showModal">Add</a-button>
    <a-table :columns="columns"
    :rowKey="record => record.id"
    :dataSource="data"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
    class="components-table-demo-nested"
    @expand="getDetailData"
    >
      <template v-for="col in ['name', 'ip', 'port', 'user']" :slot="col" slot-scope="text, record">
        <div :key="col" v-if="col === 'user'">
          <a-select v-if="record.editable" style="width: 120px" :defaultValue="record.user_info.user_id">
          <a-select-option v-for="user in assetUserInfo " :key="user.id" :value="user.id">{{ user.name }}</a-select-option>
          </a-select>
          <template v-else>{{text}}</template>
        </div>
        <div :key="col" v-else>
          <a-input
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
            @change="e => handleChange(e.target.value, record.id, col)"
          />
          <template v-else>{{text}}</template>
        </div>
      </template>
      <template slot="action" slot-scope="text, record">
        <div class='editable-row-operations'>
          <span v-if="record.editable">
            <a @click="() => save(record.id)">Save</a>
            <a-popconfirm title='Sure to cancel?' @confirm="() => cancel(record.id)">
              <a>Cancel</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <a @click="() => edit(record.id)">Edit</a>
          </span>
        </div>
        <a-popconfirm
          v-if="data.length"
          title="Sure to delete?"
          @confirm="() => onDelete(record.id)">
          <a href="javascript:;">Delete</a>
        </a-popconfirm>
        <a-dropdown style="padding: 4px;">
          <a-menu slot="overlay">
            <a-menu-item @click="() => showCrontabModal(record)">
              配置计划任务
            </a-menu-item>
          </a-menu>
          <a href="javascript:;">
            More <a-icon type="down" />
          </a>
        </a-dropdown>
      </template>
      <!-- innerTable -->
      <a-table slot="expandedRowRender" slot-scope="record" :columns="innerColumns" :dataSource="record.innerData" :pagination="false" :rowKey="record => record.id">
        <span slot="status" slot-scope="text">

          <div v-if="text === 1" ><a-badge status="success"/> Finished</div>
          <div v-else-if="text === 2"><a-badge status="error"/> Cancel</div>
          <div v-else ><a-badge status="warning"/> 发布中</div>
        </span>
        <!-- <span slot="status" slot-scope="text">
        <a-badge status="success" />Finished
      </span> -->
        <span slot="action" slot-scope="record" class="table-operation">
          <a @click="() => publishCron(record)" href="javascript:;" style="padding: 8px">发布</a>
          <a @click="() => cancelCron(record)" href="javascript:;">取消</a>
        </span>
      </a-table>
    </a-table>
    <a-modal title="Create Asset" :visible="visible" :footer="false" @ok="handleOk" :confirmLoading="confirmLoading" @cancel="handleCancel" >
      <create-asset class="create-asset" @update:visible="val => (visible = val)"></create-asset>
    </a-modal>
    <a-modal title="Setting Crontab" :visible="crontabVisible" :footer="false" @ok="handleOk" :confirmLoading="confirmLoading" @cancel="handleCancel" >
      <setting-asset-crontab class="create-asset" @update:visible="val => (crontabVisible = val)"></setting-asset-crontab>
    </a-modal>
  </div>
</template>
<script>
import request from '../../utils/request'
import CreateAsset from '../../components/CreateAsset'
import SettingAssetCrontab from '../../components/SettingAssetCrontab'
import { setInterval } from 'timers';
import { setTimeout } from 'timers';
import { notification } from "ant-design-vue";

const columns = [{
  dataIndex: 'name',
  title: 'name',
  width: '20%',
  scopedSlots: { customRender: 'name' },
}, {
  title: 'ip',
  dataIndex: 'ip',
  width: '20%',
  scopedSlots: { customRender: 'ip' },
}, {
  title: 'port',
  width: '20%',
  dataIndex: 'port',
  scopedSlots: { customRender: 'port' },
}, {
  title: 'user',
  width: '15%',
  dataIndex: 'user_info.user_name',
  scopedSlots: { customRender: 'user' },
},

{
  title: 'Action',
  key: 'action',
  width: '25%',
  scopedSlots: { customRender: 'action' },
}];

const innerColumns = [{
  dataIndex: 'name',
  title: 'name',
  width: '15%',
}, {
  title: 'job',
  dataIndex: 'job',
  width: '20%',
}, {
  title: 'time',
  dataIndex: 'time',
  width: '20%',
}, {
  title: 'status',
  dataIndex: 'status',
  width: '20%',
  scopedSlots: { customRender: 'status' }
},
{
  title: 'Action',
  key: 'action',
  width: '25%',
  scopedSlots: { customRender: 'action' },
}];

const data = []
const innerData = []

export default {
  components: {
    CreateAsset,
    SettingAssetCrontab
  },
  computed: {
    assetCron(){
      return this.$store.state.form.assetCron
    }
  },
  data() {
    this.cacheData = data.map(item => ({ ...item }))
    return {
      data: [],
      innerData: [],
      columns,
      innerColumns,
      pagination: {},
      loading: false,
      visible: false,
      crontabVisible: false,
      confirmLoading: false,
      assetUserInfo: []
    }
  },
  mounted() {
      console.log("mounted")
      this.getAssetData()
      this.getAssetUserData()
      // this.interval = setInterval(() => {
      //     this.getAssetData()
      // }, 10000)
  },
  render() {
    console.log("render")
    console.log("render", this)
  },
  methods: {
      showRow(expandedRows){
        console.log("expandRows", expandedRows)
      },
      getAssetData(params = {}){
        this.loading = true
          request({
              url: '/api/v1.0/assets',
              method: 'get',
              params: params,
          }).then(
              response => {
                  const pagination = { ...this.pagination }
                  this.data = response.data.data.value,
                  pagination.total = response.data.data.total
                  pagination.current = response.data.data.page
                  this.pagination = pagination
                  this.loading = false
              }
          )
      },
      getDetailData(expanded, record){
        console.log("get Detail Data")
        console.log("Expande", expanded)
        console.log("Record", record)
        console.log("this", this)
        if (!expanded) return;
        this.loading = true
        request({
              url: '/api/v1.0/assets/' + record.id + '/cron',
              method: 'get',
          }).then(
            response => {
              const innerData = response.data.data.value
              console.log(innerData)
              record.innerData = innerData,
              // record.innerData.pid = record.id,
              this.loading = false
            }
          )
      },
      patchAssetData(assetId = Number(), bodys){
        this.loading = true
        request({
            url: '/api/v1.0/assets/' + assetId,
            method: 'patch',
            data: bodys
        }).then(
          setTimeout(() => {
            this.getAssetData()
          }, 1000)
        )
      },
      patchAssetCrontab(record, bodys){
        this.loading = true
        const { asset_id, id } = record
        request({
            url: '/api/v1.0/assets/' + asset_id + '/cron/' + id,
            method: 'patch',
            data: bodys
        }).then(
          response => {
            if (response.data.code !== 200) {
              notification.info({
                message: h => (
                  <div>
                    请求错误 <span style="color: red">{status}</span>
                  </div>
                ),
                description: response.data.msg
              })
              this.loading = false
            } else {
                notification.success({
                // eslint-disable-next-line no-unused-vars
                message: h => (
                  <div>
                    跟新成功,请刷新 <span style="color: green">OK</span>
                  </div>
                ),
                description: "跟新成功, 请刷新"
                });
                this.loading = false
            }
          },
        )
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
      },
      publishCron(record){
        this.patchAssetCrontab(record, {status: 1})
        console.log(this)
      },
      cancelCron(record){
        this.patchAssetCrontab(record, {status: 2})
      },
      handleTableChange (pagination, filters, sorter) {
        console.log(pagination);
        const pager = { ...this.pagination };
        pager.current = pagination.current;
        this.pagination = pager;
        this.getAssetData({
          per_page: pagination.pageSize,
          page: pagination.current,
          sortField: sorter.field,
          sortOrder: sorter.order,
          ...filters,
        });
      },
      onDelete (assetId) {
        this.patchAssetData(assetId, {is_deleted: true})
      },
      edit (key) {
        console.log("Edit key", key)
        const newData = [...this.data]
        const target = newData.filter(item => key === item.id)[0]
        if (target) {
          target.editable = true
          this.data = newData
        }
      },
      handleChange (value, key, column) {
        console.log("handleChange")
        console.log("value",value, "key", key , "column", column)
        const newData = [...this.data]
        const target = newData.filter(item => key === item.id)[0]
        if (target) {
          target[column] = value
          this.data = newData
        }
      },
      save (key) {
        const newData = [...this.data]
        const target = newData.filter(item => key === item.id)[0]
        if (target) {
          console.log(target)
          const body = {
            hostname: target.name,
            ip : target.ip,
            port: target.port
          }
          this.patchAssetData(target.id, body)
          // delete target.editable
          // this.data = newData
          // this.cacheData = newData.map(item => ({ ...item }))
        }
      },
      cancel (key) {
        const newData = [...this.data]
        const target = newData.filter(item => key === item.id)[0]
        if (target) {
          Object.assign(target, this.cacheData.filter(item => key === item.id)[0])
          delete target.editable
          this.data = newData
        }
      },
      // handleAdd () {
        // const {$router} = this;
        // const { count, dataSource } = this
        // $router.push("/asset/create");
        // this.dataSource = [...dataSource, newData]
        // this.count = count + 1
      // },
      showModal() {
        this.visible = true
      },
      showCrontabModal(record) {
        console.log("show crontab", record)
        this.assetCron.asset_id = record.id
        this.assetCron.asset_name = record.name
        this.crontabVisible = true
      },
      handleOk(e) {
        // this.$form
        console.log(this.$form)
        this.confirmLoading = true;
        setTimeout(() => {
          this.visible = false;
          this.crontabVisible = false;
          this.confirmLoading = false;
        }, 2000);
      },
      handleCancel(e) {
        console.log('Clicked cancel button');
        this.visible = false
        this.crontabVisible = false
      },
  }
}
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}

.editable-add-btn {
  margin-top: 8px;
  margin-bottom: 8px;
}

.create-asset {
  padding-right: 20%;
}
</style>
