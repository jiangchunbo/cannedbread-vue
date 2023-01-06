<template>
  <el-table
    :data="equipmentData">
    <el-table-column
      prop="name"
      label="装备名称"
      width="180"
    />
    <el-table-column
      prop="combinationRule"
      label="合成公式"
    />
    <el-table-column
      prop="combinationRule"
      label="合成公式"
    >
      <template slot-scope="scope">
        <img :src="scope.row.attribute" style="width: 200px; "/>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import {fetchEquipmentList} from '@/api/heroic-expeditions'

export default {
  name: 'HeroicExpeditions',
  data() {
    return {
      equipmentData: []
    }
  },
  mounted() {
    this.renderEquipmentTable()
  },
  methods: {
    renderEquipmentTable() {
      fetchEquipmentList().then(res => {
        const {data} = res
        console.log(data)
        this.equipmentData = data
      })
    }
  }
}
</script>

<style scoped>

</style>
