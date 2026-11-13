# PC 矢量图标来源

SVG 源文件与 `provenance.json` 复制自 `guangxin-preview-20261104/src/assets/workbench-vectors/`，保持原始路径几何与绘制值；`WorkbenchVectorIcon.tsx` 同样复用 PC 实现，内嵌 SVG DOM 并为每个实例重命名渐变、蒙版与裁剪ID。

应用/系统目录的其余线性图标复用 PC `src/data/workbenchApps.ts` 的 Lucide React 0.546.0 组件与颜色，见 `src/apps/pcCatalog.ts`。不再请求 PNG、JPG 或 SVG 图片元素作为应用图标。

移动端应用图标34px/8px圆角、系统32px圆形；图标按钮视觉19px且保持至少44px点击热区。Lucide 许可证见 `lucide-LICENSE`。
