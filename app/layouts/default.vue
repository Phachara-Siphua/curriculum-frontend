<!-- layouts/default.vue -->
<template>
  <div class="flex flex-col h-screen overflow-hidden bg-[#F3EFE4] font-['Sarabun']">
    
    <!-- TOP BAR -->
    <header class="h-[56px] flex-none flex items-center gap-[14px] px-[18px] bg-[#1B2A4A] shadow-[0_2px_0_rgba(0,0,0,0.08)] z-20">
      <div class="w-[30px] h-[30px] border-[1.5px] border-[#EEE0C6] rounded-[3px] flex items-center justify-center font-['Noto_Serif_Thai'] font-bold text-[15px] flex-none force-light-gold">
        C
      </div>
      <div class="flex flex-col leading-[1.25] overflow-hidden">
        <!-- 🌟 ใส่คลาส force-white บังคับสีขาว -->
        <b class="text-[14.5px] font-semibold whitespace-nowrap text-ellipsis overflow-hidden force-white">Curriculum Document Generator AI</b>
        <span class="text-[11.5px] whitespace-nowrap overflow-hidden text-ellipsis force-gray">วิทยาลัยเทคโนโลยีอุตสาหกรรม มจพ.</span>
      </div>
      <div class="flex-1"></div>
      <div class="hidden md:flex items-center gap-4">
        <div class="text-[12.5px] flex items-center gap-[6px] force-green-light">
          <span class="w-[6px] h-[6px] rounded-full bg-[#6FBF8E] shadow-[0_0_0_3px_rgba(111,191,142,0.25)]"></span>
          บันทึกอัตโนมัติแล้ว
        </div>
        <button class="border-none rounded-md px-[15px] py-[8px] text-[13px] font-semibold flex items-center gap-[7px] bg-white/10 hover:bg-white/15 transition-all force-gray-light">
          <UIcon name="i-heroicons-eye" class="w-4 h-4"/> ดูตัวอย่างเล่ม
        </button>
        <!-- 🌟 ใส่คลาส force-white บังคับสีขาวในปุ่ม -->
        <button class="border-none rounded-md px-[15px] py-[8px] text-[13px] font-semibold flex items-center gap-[7px] bg-[#A8793B] hover:shadow-[0_6px_14px_-4px_rgba(168,121,59,0.6)] transition-all force-white">
          <UIcon name="i-heroicons-arrow-down-tray" class="w-4 h-4"/> ส่งออกเป็น Word
        </button>
      </div>
    </header>

    <!-- BODY ROW -->
    <div class="flex flex-1 min-h-0">
      
      <!-- SIDEBAR -->
      <aside class="w-[302px] flex-none bg-[#141F36] text-[#B9C2D6] overflow-y-auto pt-[14px] pb-[30px] border-r border-white/5 custom-scrollbar hidden md:block">
        
        <!-- Progress -->
        <div class="px-[18px] pb-[16px] border-b border-[rgba(255,255,255,0.09)] mb-2">
          <div class="flex justify-between text-[11.5px] text-[#8C96AF] mb-[7px]">
            <span>ความคืบหน้าโดยรวม</span>
            <span>กำลังดำเนินการ</span>
          </div>
          <div class="h-[5px] rounded-[3px] bg-white/10 overflow-hidden">
            <div class="h-full bg-gradient-to-r from-[#A8793B] to-[#D9B679] rounded-[3px] w-[15%]"></div>
          </div>
        </div>

        <nav class="flex flex-col">
          <!-- ข้อมูลสถาบัน -->
          <NuxtLink to="/" class="group border-b border-[rgba(255,255,255,0.09)] flex items-center gap-[10px] px-[16px] py-[11px] hover:bg-white/5" active-class="bg-[rgba(168,121,59,0.15)] !border-l-[3px] !border-l-[#A8793B] !border-b-[rgba(255,255,255,0.09)] border-l-transparent">
            <div class="w-[24px] h-[24px] flex-none rounded-full border border-white/25 flex items-center justify-center text-[11.5px] font-semibold text-[#DCE2EF] font-['Noto_Serif_Thai'] group-[.router-link-active]:bg-[#A8793B] group-[.router-link-active]:border-[#A8793B] group-[.router-link-active]:!text-white transition-colors">§</div>
            <div class="flex-1 text-[13.2px] leading-[1.3] text-[#E4E8F1] group-[.router-link-active]:!text-white group-[.router-link-active]:font-semibold transition-colors">ข้อมูลสถาบันอุดมศึกษา</div>
          </NuxtLink>

          <!-- หมวด 1-8 -->
          <NuxtLink to="/number1" class="group border-b border-[rgba(255,255,255,0.09)] flex items-center gap-[10px] px-[16px] py-[11px] hover:bg-white/5" active-class="bg-[rgba(168,121,59,0.15)] !border-l-[3px] !border-l-[#A8793B] !border-b-[rgba(255,255,255,0.09)] border-l-transparent">
            <div class="w-[24px] h-[24px] flex-none rounded-full border border-white/25 flex items-center justify-center text-[11.5px] font-semibold text-[#DCE2EF] font-['Noto_Serif_Thai'] group-[.router-link-active]:bg-[#A8793B] group-[.router-link-active]:border-[#A8793B] group-[.router-link-active]:!text-white transition-colors">1</div>
            <div class="flex-1 text-[13.2px] leading-[1.3] text-[#E4E8F1] group-[.router-link-active]:!text-white group-[.router-link-active]:font-semibold transition-colors">ข้อมูลทั่วไป</div>
          </NuxtLink>
          <NuxtLink to="/number2" class="group border-b border-[rgba(255,255,255,0.09)] flex items-center gap-[10px] px-[16px] py-[11px] hover:bg-white/5" active-class="bg-[rgba(168,121,59,0.15)] !border-l-[3px] !border-l-[#A8793B] !border-b-[rgba(255,255,255,0.09)] border-l-transparent">
            <div class="w-[24px] h-[24px] flex-none rounded-full border border-white/25 flex items-center justify-center text-[11.5px] font-semibold text-[#DCE2EF] font-['Noto_Serif_Thai'] group-[.router-link-active]:bg-[#A8793B] group-[.router-link-active]:border-[#A8793B] group-[.router-link-active]:!text-white transition-colors">2</div>
            <div class="flex-1 text-[13.2px] leading-[1.3] text-[#E4E8F1] group-[.router-link-active]:!text-white group-[.router-link-active]:font-semibold transition-colors">ข้อมูลเฉพาะของหลักสูตร</div>
            <div class="text-[10.5px] text-[#8C96AF] flex-none bg-white/5 px-[8px] py-[2px] rounded-[20px] group-[.router-link-active]:text-[#EEE0C6] group-[.router-link-active]:bg-[#A8793B]/25 transition-colors">AI</div>
          </NuxtLink>
          <NuxtLink to="/number3" class="group border-b border-[rgba(255,255,255,0.09)] flex items-center gap-[10px] px-[16px] py-[11px] hover:bg-white/5" active-class="bg-[rgba(168,121,59,0.15)] !border-l-[3px] !border-l-[#A8793B] !border-b-[rgba(255,255,255,0.09)] border-l-transparent">
            <div class="w-[24px] h-[24px] flex-none rounded-full border border-white/25 flex items-center justify-center text-[11.5px] font-semibold text-[#DCE2EF] font-['Noto_Serif_Thai'] group-[.router-link-active]:bg-[#A8793B] group-[.router-link-active]:border-[#A8793B] group-[.router-link-active]:!text-white transition-colors">3</div>
            <div class="flex-1 text-[13.2px] leading-[1.3] text-[#E4E8F1] group-[.router-link-active]:!text-white group-[.router-link-active]:font-semibold transition-colors">ระบบการจัดการศึกษา การดำเนินการ และโครงสร้างของหลักสูตร</div>
            <div class="text-[10.5px] text-[#8C96AF] flex-none bg-white/5 px-[8px] py-[2px] rounded-[20px] group-[.router-link-active]:text-[#EEE0C6] group-[.router-link-active]:bg-[#A8793B]/25 transition-colors">AI</div>
          </NuxtLink>
          <NuxtLink to="/number4" class="group border-b border-[rgba(255,255,255,0.09)] flex items-center gap-[10px] px-[16px] py-[11px] hover:bg-white/5" active-class="bg-[rgba(168,121,59,0.15)] !border-l-[3px] !border-l-[#A8793B] !border-b-[rgba(255,255,255,0.09)] border-l-transparent">
            <div class="w-[24px] h-[24px] flex-none rounded-full border border-white/25 flex items-center justify-center text-[11.5px] font-semibold text-[#DCE2EF] font-['Noto_Serif_Thai'] group-[.router-link-active]:bg-[#A8793B] group-[.router-link-active]:border-[#A8793B] group-[.router-link-active]:!text-white transition-colors">4</div>
            <div class="flex-1 text-[13.2px] leading-[1.3] text-[#E4E8F1] group-[.router-link-active]:!text-white group-[.router-link-active]:font-semibold transition-colors">ผลการเรียนรู้ กลยุทธ์การสอนและการประเมินผล</div>
            <div class="text-[10.5px] text-[#8C96AF] flex-none bg-white/5 px-[8px] py-[2px] rounded-[20px] group-[.router-link-active]:text-[#EEE0C6] group-[.router-link-active]:bg-[#A8793B]/25 transition-colors">AI</div>
          </NuxtLink>
          <NuxtLink to="/number5" class="group border-b border-[rgba(255,255,255,0.09)] flex items-center gap-[10px] px-[16px] py-[11px] hover:bg-white/5" active-class="bg-[rgba(168,121,59,0.15)] !border-l-[3px] !border-l-[#A8793B] !border-b-[rgba(255,255,255,0.09)] border-l-transparent">
            <div class="w-[24px] h-[24px] flex-none rounded-full border border-white/25 flex items-center justify-center text-[11.5px] font-semibold text-[#DCE2EF] font-['Noto_Serif_Thai'] group-[.router-link-active]:bg-[#A8793B] group-[.router-link-active]:border-[#A8793B] group-[.router-link-active]:!text-white transition-colors">5</div>
            <div class="flex-1 text-[13.2px] leading-[1.3] text-[#E4E8F1] group-[.router-link-active]:!text-white group-[.router-link-active]:font-semibold transition-colors">หลักเกณฑ์ในการประเมินผลนักศึกษา</div>
          </NuxtLink>
          <NuxtLink to="/number6" class="group border-b border-[rgba(255,255,255,0.09)] flex items-center gap-[10px] px-[16px] py-[11px] hover:bg-white/5" active-class="bg-[rgba(168,121,59,0.15)] !border-l-[3px] !border-l-[#A8793B] !border-b-[rgba(255,255,255,0.09)] border-l-transparent">
            <div class="w-[24px] h-[24px] flex-none rounded-full border border-white/25 flex items-center justify-center text-[11.5px] font-semibold text-[#DCE2EF] font-['Noto_Serif_Thai'] group-[.router-link-active]:bg-[#A8793B] group-[.router-link-active]:border-[#A8793B] group-[.router-link-active]:!text-white transition-colors">6</div>
            <div class="flex-1 text-[13.2px] leading-[1.3] text-[#E4E8F1] group-[.router-link-active]:!text-white group-[.router-link-active]:font-semibold transition-colors">การพัฒนาอาจารย์</div>
          </NuxtLink>
          <NuxtLink to="/number7" class="group border-b border-[rgba(255,255,255,0.09)] flex items-center gap-[10px] px-[16px] py-[11px] hover:bg-white/5" active-class="bg-[rgba(168,121,59,0.15)] !border-l-[3px] !border-l-[#A8793B] !border-b-[rgba(255,255,255,0.09)] border-l-transparent">
            <div class="w-[24px] h-[24px] flex-none rounded-full border border-white/25 flex items-center justify-center text-[11.5px] font-semibold text-[#DCE2EF] font-['Noto_Serif_Thai'] group-[.router-link-active]:bg-[#A8793B] group-[.router-link-active]:border-[#A8793B] group-[.router-link-active]:!text-white transition-colors">7</div>
            <div class="flex-1 text-[13.2px] leading-[1.3] text-[#E4E8F1] group-[.router-link-active]:!text-white group-[.router-link-active]:font-semibold transition-colors">การประกันคุณภาพหลักสูตร</div>
          </NuxtLink>
          <NuxtLink to="/number8" class="group border-b border-[rgba(255,255,255,0.09)] flex items-center gap-[10px] px-[16px] py-[11px] hover:bg-white/5" active-class="bg-[rgba(168,121,59,0.15)] !border-l-[3px] !border-l-[#A8793B] !border-b-[rgba(255,255,255,0.09)] border-l-transparent">
            <div class="w-[24px] h-[24px] flex-none rounded-full border border-white/25 flex items-center justify-center text-[11.5px] font-semibold text-[#DCE2EF] font-['Noto_Serif_Thai'] group-[.router-link-active]:bg-[#A8793B] group-[.router-link-active]:border-[#A8793B] group-[.router-link-active]:!text-white transition-colors">8</div>
            <div class="flex-1 text-[13.2px] leading-[1.3] text-[#E4E8F1] group-[.router-link-active]:!text-white group-[.router-link-active]:font-semibold transition-colors">การประเมินและปรับปรุงการดำเนินการของหลักสูตร</div>
          </NuxtLink>

          <!-- ภาคผนวก ก - ซ -->
          <div class="px-[16px] pt-[14px] pb-[6px] text-[11px] tracking-[0.06em] text-[#7B85A0] uppercase font-bold">ภาคผนวก</div>
          
          <NuxtLink to="/appendix/a" class="group border-b border-[rgba(255,255,255,0.09)] flex items-center gap-[10px] px-[16px] py-[11px] hover:bg-white/5" active-class="bg-[rgba(168,121,59,0.15)] !border-l-[3px] !border-l-[#A8793B] !border-b-[rgba(255,255,255,0.09)] border-l-transparent">
            <div class="w-[24px] h-[24px] flex-none rounded-full border border-white/25 flex items-center justify-center text-[11.5px] font-semibold text-[#DCE2EF] font-['Noto_Serif_Thai'] group-[.router-link-active]:bg-[#A8793B] group-[.router-link-active]:border-[#A8793B] group-[.router-link-active]:!text-white transition-colors">ก</div>
            <div class="flex-1 text-[13.2px] leading-[1.3] text-[#E4E8F1] group-[.router-link-active]:!text-white group-[.router-link-active]:font-semibold transition-colors">แผนภูมิแสดงความต่อเนื่องของหลักสูตร</div>
          </NuxtLink>
          <NuxtLink to="/appendix/b" class="group border-b border-[rgba(255,255,255,0.09)] flex items-center gap-[10px] px-[16px] py-[11px] hover:bg-white/5" active-class="bg-[rgba(168,121,59,0.15)] !border-l-[3px] !border-l-[#A8793B] !border-b-[rgba(255,255,255,0.09)] border-l-transparent">
            <div class="w-[24px] h-[24px] flex-none rounded-full border border-white/25 flex items-center justify-center text-[11.5px] font-semibold text-[#DCE2EF] font-['Noto_Serif_Thai'] group-[.router-link-active]:bg-[#A8793B] group-[.router-link-active]:border-[#A8793B] group-[.router-link-active]:!text-white transition-colors">ข</div>
            <div class="flex-1 text-[13.2px] leading-[1.3] text-[#E4E8F1] group-[.router-link-active]:!text-white group-[.router-link-active]:font-semibold transition-colors">รายละเอียดการกำหนดรหัสวิชา</div>
          </NuxtLink>
          <NuxtLink to="/appendix/c" class="group border-b border-[rgba(255,255,255,0.09)] flex items-center gap-[10px] px-[16px] py-[11px] hover:bg-white/5" active-class="bg-[rgba(168,121,59,0.15)] !border-l-[3px] !border-l-[#A8793B] !border-b-[rgba(255,255,255,0.09)] border-l-transparent">
            <div class="w-[24px] h-[24px] flex-none rounded-full border border-white/25 flex items-center justify-center text-[11.5px] font-semibold text-[#DCE2EF] font-['Noto_Serif_Thai'] group-[.router-link-active]:bg-[#A8793B] group-[.router-link-active]:border-[#A8793B] group-[.router-link-active]:!text-white transition-colors">ค</div>
            <div class="flex-1 text-[13.2px] leading-[1.3] text-[#E4E8F1] group-[.router-link-active]:!text-white group-[.router-link-active]:font-semibold transition-colors">สำเนาคำสั่งแต่งตั้งคณะกรรมการ</div>
          </NuxtLink>
          <NuxtLink to="/appendix/d" class="group border-b border-[rgba(255,255,255,0.09)] flex items-center gap-[10px] px-[16px] py-[11px] hover:bg-white/5" active-class="bg-[rgba(168,121,59,0.15)] !border-l-[3px] !border-l-[#A8793B] !border-b-[rgba(255,255,255,0.09)] border-l-transparent">
            <div class="w-[24px] h-[24px] flex-none rounded-full border border-white/25 flex items-center justify-center text-[11.5px] font-semibold text-[#DCE2EF] font-['Noto_Serif_Thai'] group-[.router-link-active]:bg-[#A8793B] group-[.router-link-active]:border-[#A8793B] group-[.router-link-active]:!text-white transition-colors">ง</div>
            <div class="flex-1 text-[13.2px] leading-[1.3] text-[#E4E8F1] group-[.router-link-active]:!text-white group-[.router-link-active]:font-semibold transition-colors">ระเบียบมหาวิทยาลัยฯ ว่าด้วยการศึกษา</div>
          </NuxtLink>
          <NuxtLink to="/appendix/e" class="group border-b border-[rgba(255,255,255,0.09)] flex items-center gap-[10px] px-[16px] py-[11px] hover:bg-white/5" active-class="bg-[rgba(168,121,59,0.15)] !border-l-[3px] !border-l-[#A8793B] !border-b-[rgba(255,255,255,0.09)] border-l-transparent">
            <div class="w-[24px] h-[24px] flex-none rounded-full border border-white/25 flex items-center justify-center text-[11.5px] font-semibold text-[#DCE2EF] font-['Noto_Serif_Thai'] group-[.router-link-active]:bg-[#A8793B] group-[.router-link-active]:border-[#A8793B] group-[.router-link-active]:!text-white transition-colors">จ</div>
            <div class="flex-1 text-[13.2px] leading-[1.3] text-[#E4E8F1] group-[.router-link-active]:!text-white group-[.router-link-active]:font-semibold transition-colors">ผลงานทางวิชาการของอาจารย์</div>
          </NuxtLink>
          <NuxtLink to="/appendix/f" class="group border-b border-[rgba(255,255,255,0.09)] flex items-center gap-[10px] px-[16px] py-[11px] hover:bg-white/5" active-class="bg-[rgba(168,121,59,0.15)] !border-l-[3px] !border-l-[#A8793B] !border-b-[rgba(255,255,255,0.09)] border-l-transparent">
            <div class="w-[24px] h-[24px] flex-none rounded-full border border-white/25 flex items-center justify-center text-[11.5px] font-semibold text-[#DCE2EF] font-['Noto_Serif_Thai'] group-[.router-link-active]:bg-[#A8793B] group-[.router-link-active]:border-[#A8793B] group-[.router-link-active]:!text-white transition-colors">ฉ</div>
            <div class="flex-1 text-[13.2px] leading-[1.3] text-[#E4E8F1] group-[.router-link-active]:!text-white group-[.router-link-active]:font-semibold transition-colors">รายละเอียดการปรับปรุงแก้ไขหลักสูตร</div>
          </NuxtLink>
          <NuxtLink to="/appendix/g" class="group border-b border-[rgba(255,255,255,0.09)] flex items-center gap-[10px] px-[16px] py-[11px] hover:bg-white/5" active-class="bg-[rgba(168,121,59,0.15)] !border-l-[3px] !border-l-[#A8793B] !border-b-[rgba(255,255,255,0.09)] border-l-transparent">
            <div class="w-[24px] h-[24px] flex-none rounded-full border border-white/25 flex items-center justify-center text-[11.5px] font-semibold text-[#DCE2EF] font-['Noto_Serif_Thai'] group-[.router-link-active]:bg-[#A8793B] group-[.router-link-active]:border-[#A8793B] group-[.router-link-active]:!text-white transition-colors">ช</div>
            <div class="flex-1 text-[13.2px] leading-[1.3] text-[#E4E8F1] group-[.router-link-active]:!text-white group-[.router-link-active]:font-semibold transition-colors">ตารางเปรียบเทียบกับมาตรฐานคุณวุฒิ</div>
          </NuxtLink>
          <NuxtLink to="/appendix/h" class="group border-b border-[rgba(255,255,255,0.09)] flex items-center gap-[10px] px-[16px] py-[11px] hover:bg-white/5" active-class="bg-[rgba(168,121,59,0.15)] !border-l-[3px] !border-l-[#A8793B] !border-b-[rgba(255,255,255,0.09)] border-l-transparent">
            <div class="w-[24px] h-[24px] flex-none rounded-full border border-white/25 flex items-center justify-center text-[11.5px] font-semibold text-[#DCE2EF] font-['Noto_Serif_Thai'] group-[.router-link-active]:bg-[#A8793B] group-[.router-link-active]:border-[#A8793B] group-[.router-link-active]:!text-white transition-colors">ซ</div>
            <div class="flex-1 text-[13.2px] leading-[1.3] text-[#E4E8F1] group-[.router-link-active]:!text-white group-[.router-link-active]:font-semibold transition-colors">ตารางแจกแจงวิชาเทียบกับสภาวิศวกรกำหนด</div>
          </NuxtLink>

        </nav>
      </aside>

      <!-- MAIN CANVAS -->
      <main class="flex-1 overflow-y-auto px-4 md:px-[26px] py-[34px] pb-[90px] scroll-smooth" id="main-scroll">
        <slot />
      </main>
    </div>
  </div>
</template>

<style>
/* 🌟 บังคับสีข้อความขั้นเด็ดขาด (ป้องกัน Nuxt UI ทับ) */
.force-white { color: #ffffff !important; }
.force-gray { color: #DCE2EF !important; }
.force-light-gold { color: #EEE0C6 !important; }
.force-green-light { color: #BFD9C9 !important; }
.force-gray-light { color: #EDEFF4 !important; }

/* บังคับคลาสให้สีแสดงถูกต้องตอน Link Active */
.router-link-active {
  background-color: rgba(168, 121, 59, 0.15) !important;
  border-left-width: 3px !important;
  border-left-color: #A8793B !important;
}
</style>