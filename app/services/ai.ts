export enum GenerationType {
  IMPORTANCE = 'importance',
  OBJECTIVES = 'objectives',
  UNIQUENESS = 'uniqueness',
  YLO_TELECOM = 'ylo_telecom',
  YLO_COMPUTER = 'ylo_computer',
  YLO_INSTRUMENT = 'ylo_instrument',
  YLO_BROADCAST = 'ylo_broadcast',
  DEV_PLAN = 'dev_plan',
  COURSE_DESCRIPTION = 'course_description',
  ELO_STANDARD = 'elo_standard',
  ELO_MAIN = 'elo_main',
  ELO_BRANCH = 'elo_branch',
  CURRICULUM_MAPPING = 'curriculum_mapping',
}

export interface AIResponse<T = any> {
  success: boolean;
  data: T;
  error?: string;
}

export class AIService {
  private static instance: AIService;

  private constructor() {}

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  /**
   * Main entry point for AI generation.
   * For now, it uses mock data. When the backend is ready,
   * replace getMockResponse with an actual API call.
   */
  async generate<T = any>(type: GenerationType, payload: any): Promise<AIResponse<T>> {
    try {
      // Simulate API network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For testing errors, you can uncomment the next line:
      // if (type === GenerationType.IMPORTANCE) throw new Error('AI Service is currently unavailable');

      const data = this.getMockResponse(type, payload);
      return {
        success: true,
        data: data,
      };
    } catch (err: any) {
      return {
        success: false,
        data: null as any,
        error: err.message || 'An unexpected error occurred during AI generation.',
      };
    }
  }

  private getMockResponse(type: GenerationType, payload: any): any {
    switch (type) {
      case GenerationType.IMPORTANCE:
        return 'หลักสูตรนี้มุ่งเน้นการสร้างบุคลากรที่มีความเชี่ยวชาญด้านเทคโนโลยีสารสนเทศและการสื่อสาร โดยประยุกต์ใช้ความรู้ทางวิศวกรรมเพื่อตอบสนองต่อการเปลี่ยนแปลงของยุคดิจิทัลและส่งเสริมการพัฒนาอย่างยั่งยืน';

      case GenerationType.OBJECTIVES:
        return [
          { code: '1', desc: 'เพื่อให้ผู้เรียนมีความรู้พื้นฐานด้านวิศวกรรมไฟฟ้าและอิเล็กทรอนิกส์อย่างถ่องแท้' },
          { code: '2', desc: 'เพื่อให้ผู้เรียนสามารถออกแบบและพัฒนาระบบเครือข่ายการสื่อสารสมัยใหม่ได้' },
          { code: '3', desc: 'เพื่อให้ผู้เรียนมีจรรยาบรรณในวิชาชีพและสามารถทำงานร่วมกับผู้อื่นในสังคมพหุวัฒนธรรมได้' },
        ];

      case GenerationType.UNIQUENESS:
        return [
          'เน้นการเรียนรู้ผ่านการปฏิบัติจริงในห้องปฏิบัติการที่ทันสมัย',
          'มีเครือข่ายความร่วมมือกับภาคอุตสาหกรรมชั้นนำทั้งในและต่างประเทศ',
          'บูรณาการความรู้ด้าน AI และ Data Science เข้ากับทุกแขนงวิชา',
        ];

      case GenerationType.YLO_TELECOM:
      case GenerationType.YLO_COMPUTER:
      case GenerationType.YLO_INSTRUMENT:
      case GenerationType.YLO_BROADCAST:
        return [
          { year: '1', desc: 'มีความรู้พื้นฐานในวิชาชีพและปรับตัวเข้ากับการเรียนรู้ระดับอุดมศึกษาได้' },
          { year: '2', desc: 'สามารถประยุกต์ใช้ทฤษฎีพื้นฐานในการแก้ปัญหาทางเทคนิคเบื้องต้นได้' },
          { year: '3', desc: 'มีความเชี่ยวชาญในวิชาเฉพาะทางและสามารถออกแบบระบบเบื้องต้นได้' },
          { year: '4', desc: 'สามารถบูรณาการความรู้เพื่อทำโครงงานจบการศึกษาและพร้อมปฏิบัติงานจริง' },
        ];

      case GenerationType.DEV_PLAN:
        return [
          { plan: 'ปรับปรุงเนื้อหาวิชาให้ทันสมัย', strategy: 'ทบทวนหลักสูตรร่วมกับผู้ทรงคุณวุฒิทุกปี', indicator: 'จำนวนรายวิชาที่ได้รับการปรับปรุง' },
          { plan: 'เพิ่มทักษะด้านภาษาอังกฤษ', strategy: 'จัดอบรมภาษาอังกฤษเชิงวิชาชีพรายภาคเรียน', indicator: 'คะแนนทดสอบภาษาอังกฤษเฉลี่ยเพิ่มขึ้น' },
        ];

      case GenerationType.COURSE_DESCRIPTION:
        return {
          descTh: 'ศึกษากระบวนการทำงานของระบบสื่อสารข้อมูลพื้นฐาน การเข้ารหัสสัญญาณ และการส่งผ่านข้อมูลในตัวกลางต่างๆ',
          descEn: 'Study the basic processes of data communication systems, signal encoding, and data transmission through various media.',
        };

      case GenerationType.ELO_STANDARD:
        return 'ผู้สำเร็จการศึกษาต้องมีความสามารถในการคิดวิเคราะห์ ออกแบบ และพัฒนาระบบเทคโนโลยีสารสนเทศตามมาตรฐานสากล';

      case GenerationType.ELO_MAIN:
        return [
          { code: 'ELO1', type: 'Knowledge', desc: 'ประยุกต์ใช้ความรู้ด้านวิศวกรรมในการแก้ปัญหาที่ซับซ้อนได้' },
          { code: 'ELO2', type: 'Skill', desc: 'สื่อสารข้อมูลทางเทคนิคได้อย่างมีประสิทธิภาพทั้งภาษาไทยและภาษาอังกฤษ' },
        ];

      case GenerationType.ELO_BRANCH:
        return [
          { code: 'B-ELO1', branch: 'Telecom', desc: 'ออกแบบระบบสายส่งสัญญาณประสิทธิภาพสูงได้' },
          { code: 'B-ELO2', branch: 'Computer', desc: 'พัฒนาระบบ Cloud Computing สำหรับองค์กรได้' },
        ];

      case GenerationType.CURRICULUM_MAPPING:
        return {
          'Course101': 'ELO1',
          'Course202': 'ELO2',
          'Course303': 'ELO1',
        };

      default:
        return null;
    }
  }
}
