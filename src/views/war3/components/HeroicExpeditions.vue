<template>
  <div class="heroic-expeditions-container">
    <el-form inline size="mini" class="search-form">
      <el-form-item>
        <el-select v-model="form.category" style="width: 150px" @change="onChangeCategory" placeholder="装备类型" clearable>
          <el-option label="主武器" value="主武器" />
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
          <el-option label="等级: F" value="F" />
          <el-option label="等级: G" value="G" />
        </el-select>
      </el-form-item>
    </el-form>
    <el-table
      :data="filterEquipmentData"
      height="calc(100% - 60px)"
    >
      <el-table-column
        prop="attribute"
        label="装备"
        width="400"
      >
        <template slot-scope="scope">
          <el-image
            style="width: 350px;"
            :src="`https://jiangchunbo-1302516612.cos.ap-shanghai.myqcloud.com/war3/英雄的远征/${scope.row.category}/${scope.row.name}/属性.png`"
            :preview-src-list="[`https://jiangchunbo-1302516612.cos.ap-shanghai.myqcloud.com/war3/英雄的远征/${scope.row.category}/${scope.row.name}/属性.png`]"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="combinationRule"
        label="获取方式"
        width="500"
      >
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.combinationRuleFormat === 'url'"
            style="width: 350px;"
            :src="`https://jiangchunbo-1302516612.cos.ap-shanghai.myqcloud.com/war3/英雄的远征/${scope.row.category}/${scope.row.name}/获取方式.png`"
            :preview-src-list="[`https://jiangchunbo-1302516612.cos.ap-shanghai.myqcloud.com/war3/英雄的远征/${scope.row.category}/${scope.row.name}/获取方式.png`]"
          />
          <span style="white-space: pre-line" v-else>{{ scope.row.combinationRule }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="combinationRule"
        label="备注"
        width="300"
      >
        <template slot-scope="scope">
          {{ scope.row.remark }}
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
        function getScore(suffix) {
          let score = 0
          for (let i = 0; i < suffix.length; i++) {
            switch (suffix[i]) {
              case '+':
                score++
                break
              case '-':
                score--
                break
            }
          }
          return score
        }

        if (e1.level && e2.level) {
          const match1 = e1.level.match(/([SABCDEFG]+)([+-]*)/)
          const match2 = e2.level.match(/([SABCDEFG]+)([+-]*)/)
          const quality1 = match1[1]
          const quality2 = match2[1]
          const score1 = getScore(match1[2])
          const score2 = getScore(match2[2])
          if (quality1 !== quality2) {
            return quality1 < quality2 ? 1 : -1
          }
          if (score1 !== score2) {
            return score2 - score1
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
    onChangeCategory() {
      if (this.form.category === '其他') {
        this.form.level = ''
      }
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

  .el-table > .el-table__body-wrapper {
    overflow-y: auto;
  }
}
</style>
