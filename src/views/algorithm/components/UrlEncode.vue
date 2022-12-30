<template>
  <div>
    <el-form>
      <p>输入字符串:</p>
      <el-input v-model="originString" type="textarea" class="url-encode-textarea"/>

      <el-popover
        placement="right"
        title="提示"
        trigger="hover">
        <p><code>encodeURI</code> 会替换所有的字符，但不包括以下字符，即使它们具有适当的 UTF-8 转义序列：</p>
        <figure class="table-container">
          <table>
            <thead>
            <tr>
              <th>类型</th>
              <th>包含</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>保留字符</td>
              <td><code>;</code> <code>,</code> <code>/</code> <code>?</code> <code>:</code> <code>@</code>
                <code>&amp;</code> <code>=</code> <code>+</code> <code>$</code></td>
            </tr>
            <tr>
              <td>非转义的字符</td>
              <td>字母 数字 <code>-</code> <code>_</code> <code>.</code> <code>!</code> <code>~</code> <code>*</code>
                <code>'</code> <code>(</code> <code>)</code></td>
            </tr>
            <tr>
              <td>数字符号</td>
              <td><code>#</code></td>
            </tr>
            </tbody>
          </table>
        </figure>
        <p slot="reference">encodeURI 编码（不会对特殊符号编码）:</p>
      </el-popover>
      <el-input v-model="originString" type="textarea" class="url-encode-textarea"/>

      <el-popover
        placement="right"
        title="提示"
        trigger="hover">
        <p><code>encodeURIComponent</code> 转义除了如下所示外的所有字符：</p>
        <div class="code-example"><pre>不转义的字符：
    A-Z a-z 0-9 - _ . ! ~ * ' ( )
</pre></div>
        <p slot="reference">encodeURIComponent 编码（会对特殊符号编码）:</p>
      </el-popover>
      <el-input v-model="encodeUriComponentString" type="textarea" class="url-encode-textarea"/>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'UrlEncode',
  data() {
    return {
      originString: ''
    }
  },
  computed: {
    encodeUriString: function () {
      return encodeURI(this.originString)
    },
    encodeUriComponentString: function () {
      return encodeURIComponent(this.originString)
    }
  }
}
</script>

<style>
.url-encode-textarea textarea {
  height: 100px;
}

.table-container code {
  background: #f2f1f1;
  padding: 0.125rem 0.25rem;
  width: fit-content;
}

.table-container table {
  border: 1px solid #cdcdcd;
  border-collapse: collapse;
  width: 100%;
}

.table-container td, .table-container th {
  border: 1px solid #cdcdcd;
  padding: 0.5rem 0.75rem;
  vertical-align: middle;
}

.code-example pre {
  background-color: #f2f1f1;
  border: 1px solid transparent;
  margin: 1rem 0 2rem;
  padding: 1rem 2.5rem 1rem 1rem;
}
</style>

