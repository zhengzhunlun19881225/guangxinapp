// PC icon definitions and paint are preserved; mobile system names omit “系统”.
import { FileText, Plane, Briefcase, Shield, Database, Building, Send, Wallet, CircleDollarSign, UserRoundCheck, CarFront, Receipt, Landmark, FileCheck2, CalendarDays, FilePenLine, GraduationCap, BookOpen, Users, ShieldCheck, Monitor, Archive, KeyRound, Network, ShieldAlert, ClipboardList, ShoppingCart, type LucideIcon } from 'lucide-react';

export type AppScope = 'common' | 'systems';
export interface WorkbenchApp { id: string; name: string; icon: LucideIcon; color: string; category: string; }
export const commonAppCatalog: WorkbenchApp[] = [
  { id: 'travel-expense', name: '报销单', icon: Receipt, color: '#278bff', category: '财务' },
  { id: 'travel-request', name: '出差申请', icon: Plane, color: '#16cb86', category: '财务' },
  { id: 'my-invoices', name: '我的发票', icon: Wallet, color: '#ff9b0c', category: '财务' },
  { id: 'vehicle-request', name: '用车申请', icon: CarFront, color: '#278bff', category: '财务' },
  { id: 'leave-request', name: '请休假', icon: CalendarDays, color: '#1fc18b', category: '人力' },
  { id: 'overtime', name: '加班申请', icon: FileText, color: '#8b44e8', category: '人力' },
  { id: 'income-proof', name: '收入证明', icon: FileCheck2, color: '#1fc18b', category: '人力' },
  { id: 'contract-draft', name: '合同起草', icon: FilePenLine, color: '#9248ef', category: '法务' },
  { id: 'counterparty-admission', name: '相对方准入', icon: UserRoundCheck, color: '#7550ed', category: '法务' },
  { id: 'oa-collaboration', name: '发协同', icon: Send, color: '#02cbd0', category: 'OA' },
  { id: 'my-learning', name: '我的学习', icon: GraduationCap, color: '#278bff', category: '知新' },
  { id: 'course-center', name: '课程中心', icon: BookOpen, color: '#1fc18b', category: '知新' },
  { id: 'treasury-portal', name: '司库-门户', icon: Landmark, color: '#ff8b12', category: '司库' },
  { id: 'treasury-fund-plan', name: '司库-资金计划', icon: CircleDollarSign, color: '#278bff', category: '司库' },
];
export const systemAppCatalog: WorkbenchApp[] = [
  { id: 'oa', name: 'OA', icon: Building, color: '#02cbd0', category: '全部系统' },
  { id: 'ai-share', name: 'AI共享平台', icon: Database, color: '#ff8912', category: '全部系统' },
  { id: 'digital-hr', name: '数字人力', icon: Users, color: '#02cbd0', category: '全部系统' },
  { id: 'finance', name: '财务共享', icon: Wallet, color: '#ff8b12', category: '全部系统' },
  { id: 'legal', name: '法务', icon: Shield, color: '#f4c821', category: '全部系统' },
  { id: 'safety', name: '安全监管', icon: ShieldCheck, color: '#02cbd0', category: '全部系统' },
  { id: 'zhixin', name: '知新', icon: GraduationCap, color: '#ffbf47', category: '全部系统' },
  { id: 'erp', name: 'ERP', icon: Monitor, color: '#43c295', category: '全部系统' },
  { id: 'audit', name: '审计', icon: Briefcase, color: '#389aff', category: '全部系统' },
  { id: 'digital-archive', name: '数字档案', icon: Archive, color: '#9463ff', category: '全部系统' },
  { id: 'property-rights', name: '产权', icon: KeyRound, color: '#6c32ff', category: '全部系统' },
  { id: 'science-innovation', name: '科创', icon: Network, color: '#a62eff', category: '全部系统' },
  { id: 'discipline', name: '纪检监察', icon: ShieldAlert, color: '#c615f8', category: '全部系统' },
  { id: 'key-sector-supervision', name: '重点领域监管', icon: ClipboardList, color: '#ff0086', category: '全部系统' },
  { id: 'procurement', name: '新易采', icon: ShoppingCart, color: '#ff7d00', category: '全部系统' },
  { id: 'reform', name: '深改', icon: FilePenLine, color: '#d800f5', category: '全部系统' },
  { id: 'party-building', name: '党建-1', icon: ShieldCheck, color: '#1378ff', category: '全部系统' },
  { id: 'finance-4e', name: '4E财务', icon: CalendarDays, color: '#ff842b', category: '全部系统' },
];
