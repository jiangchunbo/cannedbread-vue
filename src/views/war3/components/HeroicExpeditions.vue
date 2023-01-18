<template>
  <div class="heroic-expeditions-container">
    <el-form inline size="mini" class="search-form">
      <el-form-item>
        <el-select v-model="form.category" style="width: 150px" placeholder="装备类型" clearable>
          <el-option label="副武器" value="副武器" />
          <el-option label="护具" value="护具" />
          <el-option label="靴子" value="靴子" />
          <el-option label="饰品" value="饰品" />
          <el-option label="其他" value="其他" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="form.level" style="width: 150px" placeholder="装备等级" clearable>
          <el-option label="等级: S" value="S" />
          <el-option label="等级: A" value="A" />
          <el-option label="等级: B" value="B" />
          <el-option label="等级: C" value="C" />
          <el-option label="等级: D" value="D" />
          <el-option label="等级: E" value="E" />
        </el-select>
      </el-form-item>
    </el-form>
    <el-table
      :data="filterEquipmentData"
      max-height="calc(100% - 60px)"
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
        level: 'S',
        category: '副武器'
      },
      equipmentData: []
    }
  },
  computed: {
    filterEquipmentData() {
      const search =
        this.form.level != null ||
        this.form.category != null
      const level = this.form.level
      const category = this.form.category
      const filterEquipmentData = this.equipmentData.filter(equipment => {
        if (!search) {
          return true
        }
        return (!level || (equipment.level && equipment.level !== '' && level && level !== '' && equipment.level.indexOf(level) !== -1)) &&
          (!category || (equipment.category && equipment.category !== '' && category && category !== '' && equipment.category.indexOf(category) !== -1))
      })
      filterEquipmentData.sort((e1, e2) => {
        if (e1.level && e2.level) {
          const quality1 = e1.level.substring(0, e1.level.indexOf('+') || e1.level.length)
          const plus1 = e1.level.substring(e1.level.indexOf('+') || e1.level.length)
          const quality2 = e2.level.substring(0, e2.level.indexOf('+') || e2.level.length)
          const plus2 = e2.level.substring(e2.level.indexOf('+') || e2.level.length)
          if (quality1 !== quality2) {
            console.log(e1.name, quality1)
            console.log(e2.name, quality2)
            return quality1 < quality2 ? -1 : 1
          }
          if (plus1 !== plus2) {
            return plus1 < plus2 ? -1 : 1
          }
        }
        if (!e1.level || !e2.level) {
          if (!e1.level) {
            return 1
          }
          if (!e2.level) {
            return -1
          }
        }
        const orderedPrimeAttribute = {
          '力量': 1,
          '敏捷': 2,
          '智力': 3
        }
        if (e1.primeAttribute && e2.primeAttribute) {
          return orderedPrimeAttribute[e1.primeAttribute] - orderedPrimeAttribute[e2.primeAttribute]
        }
        if (!e1.primeAttribute || !e2.primeAttribute) {
          if (!e1.primeAttribute) {
            return 1
          }
          if (!e2.primeAttribute) {
            return -1
          }
        }
        return 0
      })
      return filterEquipmentData
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
      // this.$set(this.form, 'level', level)
      console.log(this.form)
    }
  }
}
</script>

<style lang="scss">
.heroic-expeditions-container {
  height: 100%;

  .search-form {
    height: 40px;
  }

  .el-table {
    overflow-y: auto;
  }

  .el-table>.el-table__body-wrapper {
    overflow-y: auto;
  }
}
</style>
