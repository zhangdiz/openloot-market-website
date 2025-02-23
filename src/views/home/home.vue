<template>
  <div class="home-wrapper">
    <div class="input-wrapper">
      <div class="label">商品列表链接：</div>
      <div class="input">
        <el-input
          type="text"
          v-model="targetUrl"
          :readonly="isLoading"
        ></el-input>
      </div>
      <div class="btn">
        <el-button type="primary" :loading="isLoading" @click="handleSearch"
          >查询</el-button
        >
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
          <div class="desc">
            <span>属性：</span>
            <span v-html="item.extra.description"></span>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import apiRequest from "@/utils/axios";

export default {
  name: "Home",
  setup() {
    // https://openloot.com/items/WS0/armor_r4
    const targetUrl = ref("https://openloot.com/items/WS0/armor_r4");
    const isLoading = ref(false);
    // 请求列表
    const list = ref([]);
    const listQuery = ref({
      total: 0,
      pageIndex: 1,
      pageSize: 48,
    });

    const fetchList = async () => {
      if (!targetUrl.value) return;
      if (isLoading.value) return;
      isLoading.value = true;
      //   const url = "http://84.247.154.10:12001/api/business/listQuery";
      const url = "http://localhost:12001/api/business/listQuery";
      const params = {
        targetUrl: targetUrl.value,
        onSale: true,
        page: listQuery.value.pageIndex,
        pageSize: listQuery.value.pageSize,
        sort: "price:asc",
      };
      const resp = await apiRequest.get(url, params);

      isLoading.value = false;

      if (resp.code !== 200) {
        alert("请求失败，稍后再试");
        return;
      }
      const arrs = resp.data.items || [];
      list.value = arrs.map((v) => ({
        ...v,
        extra: {
          ...v.extra,
          description: v.extra.description.replace(/\n{2,}/g, "<br>"),
        },
      }));
      listQuery.value.total = resp.data.totalItems;
    };

    const handleSearch = async () => {
      console.log(targetUrl.value, "targetUrl ----");
      fetchList();
    };

    return {
      list,
      listQuery,
      isLoading,
      targetUrl,
      handleSearch,
    };
  },
};
</script>

<style lang="less">
/* 可以加一些样式 */
.home-wrapper {
  padding: 10px;
  .input-wrapper {
    display: flex;
    align-items: center;
    .label {
      margin-right: 10px;
    }
    .el-input {
      width: 350px;
    }

    .btn {
      margin-left: 10px;
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
  }
}
</style>
