<template>
  <div class="w-full p-4 md:p-6">
    <UForm class="w-full">
      <UCard :ui="{ root: 'bg-white', header: 'bg-blue-950' }">
        <template #header>
          <p class="text-white font-semibold text-lg">แผนภูมิแสดงความต่อเนื่องของการศึกษา</p>
        </template>
        <CurriculumMap />
      </UCard>
    </UForm>
  </div>
  
</template>