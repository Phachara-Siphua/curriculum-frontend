<!-- components/Sidebar.vue -->
<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items: NavigationMenuItem[] = [
  // {
  //   label: 'การจัดการข้อมูล',
  //   children: [
  //     { label: 'ข้อมูลหน้าปก', to: '/index_2' } // หากมีหน้าปก
  //   ]
  // },
  {
    label: 'จัดการหลักสูตร'
  },
  {
    label: 'จัดทำเล่มหลักสูตรใหม่',
    children: [
      { label: 'องค์ประกอบที่ 1', to: '/number1' },
      { label: 'องค์ประกอบที่ 2', to: '/number2' },
      { label: 'องค์ประกอบที่ 3', to: '/number3' },
      { label: 'องค์ประกอบที่ 4', to: '/number4' },
      { label: 'องค์ประกอบที่ 5', to: '/number5' },
      { label: 'องค์ประกอบที่ 6', to: '/number6' },
      { label: 'องค์ประกอบที่ 7', to: '/number7' },
      { label: 'องค์ประกอบที่ 8', to: '/number8' },
      { label: 'องค์ประกอบที่ 9', to: '/number9' }
    ]
  }
]
</script>

<template>
  <USidebar
    :ui="{
      container: 'h-full',
      inner: 'mt-15 bg-sky-800', 
      body: 'py-4'
    }"
  >
    <UNavigationMenu
      :items="items"
      orientation="vertical"
      :ui="{
        root: 'mt-2', 
        link: 'text-white text-lg data-active:font-bold data-active:text-yellow-400 hover:text-gray-300',
        childLink: 'text-gray-200 text-base data-active:text-yellow-400 hover:text-white'
      }"
    />
  </USidebar>
</template>