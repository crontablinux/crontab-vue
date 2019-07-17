<template>
  <div>
    <a-button class="editable-add-btn" @click="showModal">Add</a-button>
    <a-table :columns="columns"
    :rowKey="record => record.id"
    :dataSource="data"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
    >
    <template v-for="col in ['name', 'job', 'minute', 'hour', 'day', 'month', 'week']" :slot="col" slot-scope="text, record">
      <div :key="col">
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
    </template>
    </a-table>
    <a-modal title="Create Crontab" :visible="visible" :footer="false" @ok="handleOk" :confirmLoading="confirmLoading" @cancel="handleCancel" >
      <create-crontab class="create-crontab" @update:visible="val => (visible = val)"></create-crontab>
    </a-modal>
  </div>
</template>
<script>
import request from '../../utils/request'
import CreateCrontab from '../../components/CreateCrontab'
import { setInterval } from 'timers';
import { setTimeout } from 'timers';

const columns = [{
  dataIndex: 'name',
  title: 'name',
  width: '10%',
  scopedSlots: { customRender: 'name' },
}, {
  title: 'job',
  dataIndex: 'job',
  width: '10%',
  scopedSlots: { customRender: 'job' },
}, {
  title: 'minute',
  width: '10%',
  dataIndex: 'minute',
  scopedSlots: { customRender: 'minute' },
}, {
  title: 'hour',
  dataIndex: 'hour',
  width: '10%',
  scopedSlots: { customRender: 'hour' },
}, {
  title: 'day',
  width: '10%',
  dataIndex: 'day',
  scopedSlots: { customRender: 'day' },
}, {
  title: 'month',
  dataIndex: 'month',
  width: '10%',
  scopedSlots: { customRender: 'month' },
}, {
  title: 'week',
  width: '10%',
  dataIndex: 'week',
  scopedSlots: { customRender: 'week' },
}, 

{
  title: 'Action',
  key: 'action',
  width: '20%',
  scopedSlots: { customRender: 'action' },
}];

const data = []

export default {
  components: {
    CreateCrontab,
  },
  data() {
    this.cacheData = data.map(item => ({ ...item }))
    return {
      data: [],
      columns,
      pagination: {},
      loading: false,
      visible: false,
      confirmLoading: false,
    }
  },
  mounted() {
      this.getAssetData()
      // this.interval = setInterval(() => {
      //     this.getAssetData()
      // }, 10000)
  },
  methods: {
      getAssetData(params = {}){
        this.loading = true
          request({
              url: '/api/v1.0/cron',
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
      patchAssetData(assetId = Number(), bodys){
        this.loading = true
        request({
            url: '/api/v1.0/cron/' + assetId,
            method: 'patch',
            data: bodys
        }).then(
          setTimeout(() => {
            this.getAssetData()
          }, 1000)
        )
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
        const newData = [...this.data]
        const target = newData.filter(item => key === item.id)[0]
        if (target) {
          target.editable = true
          this.data = newData
        }
      },
      handleChange (value, key, column) {
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
            crontab_name: target.name,
            job : target.job,
            minute: target.minute,
            hour: target.hour,
            day: target.day,
            month: target.month,
            week: target.week
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
      handleAdd () {
        const {$router} = this;
        // const { count, dataSource } = this
        $router.push("/asset/create");
        // this.dataSource = [...dataSource, newData]
        // this.count = count + 1
      },
      showModal() {
        this.visible = true
      },
      handleOk(e) {
        // this.$form
        console.log(this.$form)
        this.confirmLoading = true;
        setTimeout(() => {
          this.visible = false;
          this.confirmLoading = false;
        }, 2000);
      },
      handleCancel(e) {
        console.log('Clicked cancel button');
        this.visible = false
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

.create-crontab {
  padding-right: 20%;
}
</style>
