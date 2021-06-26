<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <a-spin :spinning="isLoading">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="短信平台" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['default', { rules: [{ required: true }] }]">
            <a-radio value="aliyun">阿里云短信</a-radio>
          </a-radio-group>
          <div class="form-item-help">
            <small style="margin-right: 6px;">短信服务管理控制台:</small>
            <a
              href="https://dysms.console.aliyun.com/dysms.htm"
              target="_blank"
            >https://dysms.console.aliyun.com/dysms.htm</a>
          </div>
        </a-form-item>
        <!-- 阿里云配置 -->
        <div v-show="form.getFieldValue('default') == 'aliyun'">
          <a-form-item label="AccessKeyId" :labelCol="labelCol" :wrapperCol="wrapperCol" required>
            <a-input v-decorator="[`engine.aliyun.AccessKeyId`]" />
          </a-form-item>
          <a-form-item
            label="AccessKeySecret"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            required
          >
            <a-input v-decorator="[`engine.aliyun.AccessKeySecret`]" />
          </a-form-item>
          <a-form-item label="短信签名 Sign" :labelCol="labelCol" :wrapperCol="wrapperCol" required>
            <a-input v-decorator="[`engine.aliyun.sign`]" />
          </a-form-item>
        </div>

        <!-- 短信场景配置 -->
        <div v-for="(item, index) in record['scene']" :key="index">
          <a-divider orientation="left">{{ item.name }}</a-divider>
          <a-form-item label="是否开启" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-radio-group
              v-decorator="[`scene.${index}.isEnable`, { rules: [{ required: true }] }]"
            >
              <a-radio :value="true">开启</a-radio>
              <a-radio :value="false">关闭</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="模板内容" :labelCol="labelCol" :wrapperCol="wrapperCol" required>
            <span>{{ record.scene[index].content }}</span>
          </a-form-item>
          <a-form-item label="模板ID/Code" :labelCol="labelCol" :wrapperCol="wrapperCol" required>
            <a-input v-decorator="[`scene.${index}.templateCode`]" />
            <div class="form-item-help">
              <small>例如：SMS_139800030</small>
            </div>
          </a-form-item>
          <a-form-item
            v-if="record.scene[index].acceptPhone !== undefined"
            label="接收手机号"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            required
          >
            <a-input v-decorator="[`scene.${index}.acceptPhone`]" />
            <div class="form-item-help">
              <small>
                注：如需填写多个手机号，请用英文逗号
                <a-tag>,</a-tag>隔开
              </small>
            </div>
          </a-form-item>
        </div>
        <a-form-item :wrapper-col="{ span: wrapperCol.span, offset: labelCol.span }">
          <a-button type="primary" html-type="submit">提交</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { isEmpty } from '@/utils/util'
import * as Api from '@/api/setting/store'
import SettingSmsSceneEnum from '@/common/enum/setting/sms/Scene'

export default {
  data () {
    return {
      SettingSmsSceneEnum,
      // 当前设置项的key
      key: 'sms',
      // 标签布局属性
      labelCol: { span: 3 },
      // 输入框布局属性
      wrapperCol: { span: 10 },
      // loading状态
      isLoading: false,
      // 当前表单元素
      form: this.$form.createForm(this),
      // 当前记录详情
      record: {}
    }
  },
  // 初始化数据
  created () {
    // 获取当前详情记录
    this.getDetail()
  },
  methods: {

    // 获取当前详情记录
    getDetail () {
      this.isLoading = true
      Api.detail(this.key)
        .then(result => {
          // 当前记录
          this.record = result.data.values
          // 设置默认值
          this.setFieldsValue()
        })
        .finally(result => {
          this.isLoading = false
        })
    },

    /**
     * 设置默认值
     */
    setFieldsValue () {
      const { record, $nextTick, form } = this
      !isEmpty(form.getFieldsValue()) && $nextTick(() => {
        const scene = {}
        for (const index in record.scene) {
          scene[index] = pick(record.scene[index], ['isEnable', 'templateCode', 'acceptPhone'])
        }
        form.setFieldsValue({
          default: record.default,
          engine: record.engine,
          scene
        })
      })
    },

    /**
     * 确认按钮
     */
    handleSubmit (e) {
      e.preventDefault()
      // 表单验证
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        // 提交到后端api
        !errors && this.onFormSubmit(values)
      })
    },

    /**
    * 提交到后端api
    */
    onFormSubmit (values) {
      this.isLoading = true
      Api.update(this.key, { form: values })
        .then((result) => {
          // 显示提示信息
          this.$message.success(result.message, 1.5)
        })
        .finally((result) => {
          this.isLoading = false
        })
    }

  }
}
</script>
<style lang="less" scoped>
.ant-form-item {
  margin-bottom: 10px;
}
/deep/.ant-form-item-control {
  padding-left: 10px;

  .ant-form-item-control {
    padding-left: 0;
  }
}
.ant-divider {
  margin-top: 50px !important;
}
</style>
