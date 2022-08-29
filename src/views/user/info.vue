<template>
  <n-space vertical>

    <n-layout>

      <n-layout has-sider>
        <n-layout-sider
          bordered
          show-trigger
          collapse-mode="width"
          :collapsed-width="64"
          :width="220"
          :native-scrollbar="false"
          :inverted="inverted"
          style="max-height: 100%"
        >
          <n-menu
            :inverted="inverted"
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :options="menuOptions"
          />
        </n-layout-sider>

            <n-layout-content  style="height: 90vh">
                <n-space vertical> 
                <!-- {{demoOptions}}
                <br>
                {{demoComposition}}
                <br> -->
                <n-button @click="getUserHmlc">
                    查询hmlc
                </n-button>

                {{  hmlc_info   }}
                </n-space>
            </n-layout-content>

      </n-layout>

    </n-layout>

  </n-space>
</template>


<script lang="ts" setup>
import { h, ref, Component, reactive } from 'vue'
import { NIcon } from 'naive-ui'
import {
  BookOutline as BookIcon,
  PersonOutline as PersonIcon,
  WineOutline as WineIcon
} from '@vicons/ionicons5'
import { 
    demoPiniaOptions,
    demoPiniaComposition
} from '@/store/demo'
import { useUserStore } from '@/store/user'

const  inverted=ref(true)

// const demoOptions=demoPiniaOptions()
// const demoComposition=demoPiniaComposition()
// demoOptions.setState()
// demoComposition.setState()
// console.log(demoOptions);
// console.log(demoComposition);

let hmlc_info=ref()
const userStore=useUserStore()
const getUserHmlc=async ()=>{
    const res=await userStore.USER_GET('hmlc')
    hmlc_info.value=res.data
    console.log(hmlc_info);
}

function renderIcon (icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
const menuOptions = [
  {
    label: '个人信息',
    key: 'hear-the-wind-sing',
    icon: renderIcon(BookIcon),
    children: [
      {
        label: '修改密码',
        key: 'updatePsw'
      }
    ]
  },
  {
    label: '发布管理',
    key: 'pinball-1973',
    icon: renderIcon(BookIcon),
    children: [
      {
        label: '我的发布',
        key: 'myPublish'
      }
    ]
  },
  {
    label: '更多设置',
    key: 'dance-dance-dance',
    icon: renderIcon(BookIcon),
    children: [
      {
        type: 'group',
        label: '人物',
        key: 'people',
        children: [
          {
            label: '叙事者',
            key: 'narrator',
            icon: renderIcon(PersonIcon)
          },
          {
            label: '羊男',
            key: 'sheep-man',
            icon: renderIcon(PersonIcon)
          }
        ]
      },
      {
        label: '饮品',
        key: 'beverage',
        icon: renderIcon(WineIcon),
        children: [
          {
            label: '威士忌',
            key: 'whisky'
          }
        ]
      },
      {
        label: '食物',
        key: 'food',
        children: [
          {
            label: '三明治',
            key: 'sandwich'
          }
        ]
      },
      {
        label: '过去增多，未来减少',
        key: 'the-past-increases-the-future-recedes'
      }
    ]
  }
]
</script>   

<style lang="less" scoped>

</style>