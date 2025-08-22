<template>
  <div class="home-wrapper">
    <div class="input-section">
      <div class="input-grid">
        <div class="input-group">
          <div class="label">Cloud API Key：</div>
          <el-input type="text" v-model="cloudApiKey" placeholder="请输入 Cloud API Key" :readonly="isLoading"></el-input>
        </div>
        <div class="input-group">
          <div class="label">Proxy URL：</div>
          <el-input type="text" v-model="proxyUrl" placeholder="请输入 Proxy URL" :readonly="isLoading"></el-input>
        </div>
        <div class="input-group">
          <div class="label">商品list链接：</div>
          <el-input type="text" v-model="targetUrl" :readonly="isLoading"></el-input>
        </div>
        <div class="input-group">
          <el-checkbox-group v-model="checkList">
            <el-checkbox label="Charges" value="Charges"></el-checkbox>
            <el-checkbox label="Level" value="Level"></el-checkbox>
          </el-checkbox-group>
          <!-- <el-checkbox v-model="levelOption" label="Level大于 1 级" size="large" /> -->
        </div>
        <div class="button-group">
          <el-button type="primary" :loading="isLoading" @click="handleSearch">查询</el-button>
        </div>
      </div>
    </div>

    <div class="data-list" v-loading="isLoading">
      <el-card v-for="item in list" :key="item.id">
        <div class="data-item">
          <div class="info">
            <div class="num">编号：#{{ item.issuedId }}</div>
            <div class="price">
              <span>价格：</span><span>{{ item.price }} USD</span>
            </div>
          </div>
          <div v-if="item.extra.attributes && item.extra.attributes.length" class="num-list">
            <div class="title">数值：</div>
            <div class="wrapper1">
              <div v-for="child in item.extra.attributes" :key="child.name" class="item-child">{{ child.name }}: {{ child.value }}</div>
            </div>
          </div>
          <div class="desc">
            <span>属性：</span>
            <span v-html="item.extra.description"></span>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script step>
import { ref } from 'vue';
import apiRequest from '@/utils/axios';

export default {
  name: 'Home',
  setup() {
    // https://openloot.com/items/WS0/armor_r4
    const targetUrl = ref('https://openloot.com/items/WS0/armor_r4');
    const cloudApiKey = ref('');
    const proxyUrl = ref('');
    const isLoading = ref(false);
    // const levelOption = ref(false);
    const checkList = ref(['Charges', 'Level']);
    // 请求列表
    const list = ref([]);
    const listQuery = ref({
      total: 0,
      pageIndex: 1,
      pageSize: 48,
    });

    const fetchList = async () => {
      if (!targetUrl.value) return;
      if (!cloudApiKey.value) {
        alert('请输入 Cloud API Key');
        return;
      }
      if (!proxyUrl.value) {
        alert('请输入 Proxy URL');
        return;
      }
      if (isLoading.value) return;

      isLoading.value = true;
      const url = '/api/business/listQuery';
      // const url = 'http://localhost:12001/api/business/listQuery';
      const params = {
        targetUrl: targetUrl.value,
        onSale: true,
        page: listQuery.value.pageIndex,
        pageSize: listQuery.value.pageSize,
        sort: 'price:asc',
        cloudApiKey: cloudApiKey.value,
        proxyUrl: proxyUrl.value,
      };

      try {
        const resp = await apiRequest.get(url, params);
        isLoading.value = false;

        if (resp.code !== 200) {
          alert(resp.message || '请求失败，稍后再试');
          return;
        }

        if (!resp.data.available) {
          alert('API配置不可用，请检查配置');
          return;
        }

        const arrs = resp.data.items || [];
        list.value = [];
        arrs.forEach((item) => {
          let description = '';
          const asterisksIndex = item.extra.description ? item.extra.description.indexOf('***') : -1;

          if (asterisksIndex !== -1) {
            description = item.extra.description.substring(asterisksIndex);
          }
          const obj = {
            ...item,
            extra: {
              ...item.extra,
              description: `<br>${description.replace(/\n{2,}/g, '<br>')}`,
            },
          };
          // if (
          //   description.indexOf('Increases max health by') !== -1 &&
          //   (description.indexOf('increases critical damage by') !== -1 || description.indexOf('increases critical rate by') !== -1)
          // ) {
          //   list.value.push(obj);
          // }
          const chargesInfo = item.extra.attributes.find((v) => v.display === 'Charges');
          const levelInfo = item.extra.attributes.find((v) => v.display === 'Level');

          if (!checkList.value.length) {
            list.value.push(obj);
            return;
          }
          if (checkList.value.length === 2) {
            if (Number(chargesInfo.value) > 0 && levelInfo.value !== 'Ⅰ') {
              list.value.push(obj);
            }
            return;
          }
          if (
            (checkList.value.includes('Charges') && Number(chargesInfo.value) > 0) ||
            (checkList.value.includes('Level') && levelInfo.value !== 'Ⅰ')
          ) {
            list.value.push(obj);
          }
        });
        listQuery.value.total = resp.data.totalItems;
      } catch (error) {
        isLoading.value = false;
        alert('请求出错: ' + error.message);
      }
    };

    const handleSearch = async () => {
      console.log(targetUrl.value, 'targetUrl ----');
      fetchList();
    };

    return {
      list,
      listQuery,
      isLoading,
      targetUrl,
      cloudApiKey,
      proxyUrl,
      checkList,
      handleSearch,
    };
  },
};
</script>

<style lang="less">
/* 可以加一些样式 */
.home-wrapper {
  padding: 10px;

  .input-section {
    margin-bottom: 30px;
    padding: 20px;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    background-color: #fafbfc;

    .input-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 20px;
      align-items: center;

      @media (max-width: 768px) {
        grid-template-columns: repeat(1, 1fr);
      }

      .input-group {
        display: flex;
        align-items: center;
        gap: 8px;

        .label {
          font-weight: 500;
          color: #303133;
          white-space: nowrap;
        }

        .el-input {
          width: 100%;
        }
      }

      .button-group {
        display: flex;
        align-items: end;
        justify-content: flex-start;

        .el-button {
          width: 100px;
        }
      }
    }
  }

  .data-list {
    margin-top: 20px;
    min-height: 500px;
    .el-card {
      margin-bottom: 12px;
    }
    .info {
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      .num {
        margin-right: 10px;
      }
      .price {
        span {
          &:last-child {
            color: red;
          }
        }
      }
    }

    .num-list {
      margin-bottom: 10px;
      .title {
        margin-bottom: 10px;
        color: blue;
      }
      .wrapper1 {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
    }
  }
}
</style>
