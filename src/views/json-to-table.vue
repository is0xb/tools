<template>
  <div class="json-to-tabel">
    <div>
      <el-input v-model="jsonStr" placeholder="请粘贴包含Array的JSON" type="textarea"></el-input>
    </div>
    <div>
      <el-input v-model="pathStr" placeholder="取出数据的键值，如：a.b.c，留空直接取" @keypress.enter="handleConvert"
        @change="handleConvert">
        <template #append>
          <el-button type="primary" size="default" @click="handleConvert">解析数据</el-button>
        </template>
      </el-input>
    </div>
    <div>
      <el-table :data="fieldList" fit current-row-key="fieldKey" :max-height="200" style="width: 100%">
        <el-table-column prop="key" label="key">
          <template #default="props">
            <el-input v-model="props.row.key"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="targetKey" label="target">
          <template #default="props">
            <el-input v-model="props.row.targetKey"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="value">
          <template #default="props">
            <el-input v-model="props.row.value"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="key" label="target">
          <template #default="props">
            <el-button type="primary" plain size="small" :icon="Top" @click="handleAdjustFieldItemOrder(props.row, -1)">
              上移
            </el-button>
            <el-button type="primary" plain size="small" :icon="Bottom"
              @click="handleAdjustFieldItemOrder(props.row, 1)">下移
            </el-button>
            <el-button type="danger" plain size="small" :icon="Delete"
              @click="fieldList.splice(fieldList.indexOf(props.row), 1)">移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-button type="primary" @click="generateFieldList">从数据生成列定义</el-button>
      <el-button type="primary" @click="handleAddFieldItem">添加一组数据列</el-button>
    </div>
    <div>
      <el-table :data="dataList" :ref="mainTableRef" fit highlight-current-row v-loading="mainTableLoading"
        style="width: 100%">
        <template v-for="item in fieldList" :key="item.fieldKey">
          <!-- <template> -->
          <el-table-column :prop="item.key" :label="item.key">
            <template #default="props">
              <span v-if="item.value" :key="`${item.fieldKey}-value-cell`">
                {{ item.value }}
              </span>
              <span v-else>
                {{ props.row[item.key] }}
              </span>
            </template>
          </el-table-column>
          <!-- </template> -->
          <!--
          <template v-else>
            <el-table-column :prop="item.key" :label="item.key" :key="item.fieldKey" />
          </template>
          -->
        </template>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { get } from 'lodash';
import { ElTable } from 'element-plus';
import { Delete, Top, Bottom } from '@element-plus/icons-vue'

interface FieldOption {
  fieldKey: string | number; // 渲染标识 正常使用序号生成即可
  key: string; // 原始数据key
  targetKey?: string; // 目标输出key
  flag?: 0 | 1; // 0-正常 1-需要过滤、跳过
  value?: string | number; // 显示值
}


const mainTableRef = ref<null | typeof ElTable>(null);
const mainTableLoading = ref(false);
const jsonStr = ref('')
const pathStr = ref('')
const dataList = ref<Record<string | number, unknown>[]>([])

// 输出字段相关
const fieldList = ref<FieldOption[]>([])
function generateFieldList() {
  const fieldSet = new Set<string>();
  dataList.value.forEach(item => {
    Object.keys(item).forEach(k => {
      fieldSet.add(k)
    })
  })
  if (fieldSet.size) {
    fieldList.value.length = 0;
    fieldSet.forEach(item => {
      fieldList.value.push({
        fieldKey: `${item}-${fieldList.value.length}`,
        key: item,
        targetKey: item,
      })
    })
  }

  console.log(fieldList)
}

function handleAddFieldItem() {
  fieldList.value.push({
    fieldKey: `${Date.now()}-${fieldList.value.length}`,
    key: '',
    targetKey: '',
  })
}

/**
 * 调整列顺序
 */
function handleAdjustFieldItemOrder(field: FieldOption, direct: 1 | -1) {
  const position = fieldList.value.indexOf(field)
  if (position === -1) {
    return;
  }
  const item = fieldList.value.splice(position, 1)[0]
  fieldList.value.splice(position + direct, 0, item)
  fieldList.value = fieldList.value.map((item, index) => {
    item.fieldKey = `${item.key}-${index}`
    return item
  })

  // if (mainTableRef.value) {
  //   mainTableRef.value.doLayout?.()
  // }
}

function handleConvert() {
  let obj = null;
  try {
    obj = JSON.parse(jsonStr.value);
  } catch (error) {
    obj = null
  }
  if (!obj) {
    return
  }

  let list = [];
  if (Array.isArray(obj)) {
    list = obj
  }
  if (pathStr.value) {
    let res = get(obj, pathStr.value)
    if (res) {
      list = res
    }
  }

  if (!Array.isArray(list)) {
    return;
  }

  mainTableLoading.value = true;

  console.log('list', list)

  dataList.value = list;

  // 生成数据表格row列表
  if (!fieldList.value.length) {
    generateFieldList()
  }
  setTimeout(() => {
    mainTableLoading.value = false;

  }, 1000);
}



</script>


<style>
.json-to-tabel {
  width: 100%;
  overflow-x: hidden;
}
</style>
