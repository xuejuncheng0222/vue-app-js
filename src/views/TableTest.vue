<template>
  <div>
    <div>
      <h2>Vue3 + Element plus 动态多行合并表格</h2>
      <el-table
        :data="tableData"
        style="width: 100%"
        :span-method="objectSpanMethod"
        border
      >
        <el-table-column
          v-for="(item, index) in tableHeader"
          :key="index"
          :prop="item.prop"
          :label="item.label"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'

const tableHeader = ref([
  {
    prop: 'birth',
    label: '生日',
  },
  {
    prop: 'name',
    label: '姓名',
  },
  {
    prop: 'phone',
    label: '电话',
  },
  {
    prop: 'province',
    label: '省份',
  },
  {
    prop: 'city',
    label: '市区',
  },
  {
    prop: 'address',
    label: '详细地址',
  },
])
const tableData = ref([
  {
    name: '张三',
    province: '上海市',
    city: '普陀区',
    address: '金沙江路 1518 弄',
    birth: '2016-05-02',
    phone: '12345678910',
  },
  {
    name: '李四',
    birth: '2016-05-02',
    province: '上海市',
    city: '普陀区',
    address: '金沙江路 1517 弄',
    age: 19,
    phone: '12345678911',
  },
  {
    name: '王五',
    birth: '2016-05-03',
    province: '上海市',
    city: '普陀区',
    address: '金沙江路 1519 弄',
    phone: '12345678912',
  },
  {
    name: '赵六',
    birth: '2016-05-04',
    province: '上海市',
    city: '普陀区',
    address: '金沙江路 1520 弄',
    phone: '12345678913',
  },
  {
    name: '孙七',
    birth: '2016-05-04',
    province: '上海市',
    city: '普陀区',
    address: '金沙江路 1521 弄',
    phone: '12345678913',
  },
  {
    name: '周八',
    birth: '2016-05-04',
    province: '上海市',
    city: '普陀区',
    address: '金沙江路 1522 弄',
    phone: '12345678913',
  },
  {
    name: '吴九',
    birth: '2016-05-06',
    province: '上海市',
    city: '普陀区',
    address: '金沙江路 1523 弄',
    phone: '12345678913',
  },
])
const spanMap = ref({})
const mergedColumns = ref(['birth', 'province', 'city'])

// const getSpanArr = (data) => {
//   for (var i = 0; i < data.length; i++) {
//     if (i === 0) {
//       mergedColumns.value.forEach((column) => {
//         spanMap[column] = {
//           spanArr: [1],
//           pos: 0,
//         }
//       })
//     } else {
//       mergedColumns.value.forEach((column) => {
//         if (data[i][column] === data[i - 1][column]) {
//           spanMap[column].spanArr[spanMap[column].pos] += 1
//           spanMap[column].spanArr.push(0)
//         } else {
//           spanMap[column].spanArr.push(1)
//           spanMap[column].pos = i
//         }
//       })
//     }
//   }
//   console.log(spanMap)
// }

const objectSpanMethod = ({ column, rowIndex }) =>
  returnMergeData(column, rowIndex, spanMap.value)

/**
 * 合并数据提取
 * @param {*} column 在 span-method 中解构的 ({column, rowIndex})
 * @param {*} rowIndex 在 span-method 中解构的 ({column, rowIndex})
 * @param {*} spanMap 使用 tableDataHandler 处理过的合并数据
 */
const returnMergeData = (column, rowIndex, spanMap) => {
  if (spanMap[column.property]) {
    const _row = spanMap[column.property][rowIndex]
    const _col = _row > 0 ? 1 : 0
    return {
      rowspan: _row,
      colspan: _col,
    }
  }
}

// 函数入参 表格数据 需要合并的prop数组 返回一个带有合并数据的对象

// {a:{arr:[个数数组]，position:定位辅助变量}}

/**
 * 处理表单数据提取合并项
 * @param {*} tableData tableItem[] 表格数组
 * @param {*} mergedColumns string[] 需要进行合并列的属性数组
 */
const testRow = (tableData, mergedColumns) => {
  // 新建一个map，形成{[表格属性名]:{arr:[合并列数数组]，position:定位辅助变量}}的数据结构
  const resultObject = mergedColumns.reduce((obj, key) => {
    obj[key] = { arr: [], position: 0 }
    return obj
  }, {})

  // 循环得到想要的值 ，position 用来定位当开始新的值，不进行合并的行数或者将合并的行数第一行进行加减

  tableData.forEach((_item, index, arr) => {
    if (index === 0) {
      mergedColumns.forEach((value) => {
        resultObject[value].arr[index] = 1
        resultObject[value].position = 0
      })
    } else {
      mergedColumns.forEach((value) => {
        if (arr[index][value] === arr[index - 1][value]) {
          resultObject[value].arr[resultObject[value].position] += 1
          resultObject[value].arr[index] = 0
        } else {
          resultObject[value].arr[index] = 1
          resultObject[value].position = index
        }
      })
    }
  })

  // 对数据进行处理 最终形成{[表格属性名]:[合并列数数组]}的数据结构

  return Object.keys(resultObject).reduce((acc, key) => {
    acc[key] = resultObject[key].arr
    return acc
  }, {})
}

onMounted(() => {
  // getSpanArr(tableData.value)
  spanMap.value = testRow(tableData.value, mergedColumns.value)
  console.log('1', 1)
})
</script>
<style scoped lang="scss"></style>
