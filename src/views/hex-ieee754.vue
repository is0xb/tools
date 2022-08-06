<template>
  <div class="hex-to-ieee754">
    <el-input v-model="hexValue" placeholder="请输入16进制数值" @change="convertHex"></el-input>
    <span>{{ decFloat }}</span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';


const hexValue = ref('');
const decFloat = ref(0);

// 16进制字符串转二进制字符串
function hexToBinWithFixedLength(hex: string): string {
  if (!hex) {
    return '';
  }
  let result = '';
  hex.split('').forEach(s => {
    result += parseInt(s, 16).toString(2).padStart(8, '0');
  })
  return result;
}

function convertHexToDec(hexValue: string) {
  let hexVal: string = hexValue

  // 移除输入数据中的空格
  hexVal = hexVal.replace(/\s+/g, '');

  if (hexVal.length !== 8) {
    throw new Error('输入数据值必须是4位16进制值')
  }

  // 全部转换成大写
  hexVal = hexVal.toUpperCase()

  // let binVal = hexToBinWithFixedLength(hexVal);

  // // 符号位
  // let sign = binVal.substring(0, 1);

  // // 整数位
  // let intVal = binVal.substring(1, 9);

  // // 小数位
  // let floatVal = binVal.substring(9);

  let num = parseInt(hexVal, 16)

  var sign = (num & 0x80000000) ? -1 : 1;
  var exponent = ((num >> 23) & 0xff) - 127;
  var mantissa = 1 + ((num & 0x7fffff) / 0x7fffff);
  return sign * mantissa * Math.pow(2, exponent);
}

function convertHex() {

  let val = convertHexToDec(hexValue.value);

  decFloat.value = val

}

</script>
