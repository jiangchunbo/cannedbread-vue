<template>
  <div>
    <el-form>
      <el-form-item>
        <el-select v-model="form.level" placeholder="请选择装备等级" clearable @change="onChangeLevel">
          <el-option label="等级: S" value="S" />
          <el-option label="等级: A" value="A" />
          <el-option label="等级: B" value="B" />
          <el-option label="等级: C" value="C" />
        </el-select>
      </el-form-item>
    </el-form>
    <el-table
      :data="filterEquipmentData"
    >
      <el-table-column
        prop="attribute"
        label="装备"
        width="300"
      >
        <template slot-scope="scope">
          <el-image
            style="width: 250px;"
            :src="scope.row.attribute"
            :preview-src-list="[scope.row.attribute]"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="combinationRule"
        label="获取方式"
        width="300"
      >
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.combinationRuleFormat === 'url'"
            style="width: 250px;"
            :src="scope.row.combinationRule"
            :preview-src-list="[scope.row.combinationRule]"
          />
          <span v-else>{{ scope.row.combinationRule }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchEquipmentList } from '@/api/heroic-expeditions'

export default {
  name: 'HeroicExpeditions',
  data() {
    return {
      level: 'S',
      form: {
        level: ''
      },
      equipmentData: []
    }
  },
  computed: {
    filterEquipmentData() {
      const search = this.form.level != null
      const level = this.form.level
      console.log(search)
      return this.equipmentData.filter(equipment => {
        return !search || (equipment.level && equipment.level.indexOf(level) !== -1)
      })
    }
  },
  mounted() {
    this.renderEquipmentTable({
      level: this.form.level
    })
  },
  methods: {
    renderEquipmentTable(params) {
      fetchEquipmentList(params).then(res => {
        const { data } = res
        this.equipmentData = data
      })
    },
    onChangeLevel(level) {
      this.$set(this.form, 'level', level)
      console.log(this.form)
    }
  }
}
</script>

<style scoped>

</style>
