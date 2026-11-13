import {useState} from 'react';
import './OverviewPanels.css';
import {PortalMetricIcon} from '../components/PortalMetricIcon';
import ProvinceTaxMap from '../components/ProvinceTaxMap';
import {SceneAction, type SceneProps} from "../components/SceneAction";
const img16 = "/assets/figma/4dc3ca59-148f-4acf-b8df-319a15b7a230.png";
const img = "/assets/figma/36d6688f-7c35-477f-80ea-9b8e46245635.svg";
const imgBattery = "/assets/figma/1531f7e7-26b6-49ad-8147-6cd732742a0b.svg";
const imgWifi = "/assets/figma/2b09054f-77dc-4f14-8ba0-e1333ba03cd9.svg";
const imgCellularConnection = "/assets/figma/7e48bb4b-04b4-47a0-80c4-8f74657094af.svg";
const img7 = "/assets/figma/f48e7591-370b-4372-94f7-dc40f80d388f.svg";
const imgVector = "/assets/figma/93f0e15b-505c-43d5-a603-f289b0b0e807.svg";
const imgVector1 = "/assets/figma/483d32da-d9e1-4560-ae65-d23b2d772363.svg";
const imgVector2 = "/assets/figma/2d01747f-02d7-4b1e-b609-d97baa2cd657.svg";
const imgVector3 = "/assets/figma/fe2cd9a4-cf39-40d7-8b4b-9ea0976e6e31.svg";
const imgVector4 = "/assets/figma/58c9e3af-a438-419e-b4fb-c7b7e14fb815.svg";
const imgVector5 = "/assets/figma/a1ed49f1-721a-4d90-89dc-731ef3715e4f.svg";
const imgVector6 = "/assets/figma/f46b5d02-e05d-453d-b1fd-becb4c992bb0.svg";
const imgVector7 = "/assets/figma/b5b9ad7a-8502-4bfc-a46d-0b50e42d4a14.svg";
const imgVector8 = "/assets/figma/cfc02293-5171-4e93-b633-c270756a00f1.svg";
const img17 = "/assets/figma/95887570-82a2-4608-a02a-6fa3fa63c326.svg";
const img19 = "/assets/figma/c938b0c9-e325-41d8-a8f4-bf44c88471bc.svg";

export default function OverviewScene({onAction,filters}: SceneProps) {
  const [taxTab,setTaxTab]=useState<'trend'|'actual'>('trend');
  return (
    <div className="bg-[#f5f5f5] relative size-full" data-node-id="0:6156" data-name="我的门户-领导1">
      <div className="absolute h-[1580px] left-0 overflow-clip top-0 w-[375px]" data-node-id="0:6157" data-name="背景">
        <div className="-translate-y-1/2 absolute h-[1580px] left-0 shadow-[0px_0px_34px_0px_rgba(0,0,0,0.12)] top-1/2 w-[375px]" data-node-id="0:6159" style={{ backgroundImage: "linear-gradient(180deg, rgb(255, 229, 229) 0%, rgb(253, 234, 234) 26.746%, rgb(247, 247, 247) 40.36%, rgb(247, 247, 247) 100%)" }} data-name="PhoneShellContainer" />
        <div className="absolute contents left-0 top-[0.18px]" data-node-id="0:6160" data-name="TopHeaderSection">
          <div className="absolute h-[211px] left-0 top-0 w-[375px] overflow-hidden pointer-events-none" data-node-id="0:6161" aria-hidden="true">
            <img alt="" className="block w-full h-auto" src="/assets/portal-background/overview-header.png"/>
          </div>
          <div className="absolute contents left-[15.5px] top-[16.68px]" data-node-id="0:6162" data-name="导航:30/状态栏StatusBar/黑色字备份 2">
            <div className="absolute h-[15px] left-[15.5px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-49.5px_-50.683px] mask-size-[443px_1648px] overflow-clip top-[16.68px] w-[344.828px]" data-node-id="0:6163" style={{ maskImage: `url("${img}")` }}>
              <div className="absolute h-[15px] left-0 overflow-clip right-0 top-0" data-node-id="0:6164" data-name="iPhone X/Status Bars/Status Bar (Black)">
                <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[15px] left-1/2 overflow-clip top-1/2 w-[344.828px]" data-node-id="0:6165" data-name="iPhone X/Status Bars/Status Bar (Black)">
                  <div className="absolute h-[11.333px] right-0 top-[0.83px] w-[24.328px]" data-node-id="0:6166" data-name="Battery">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBattery} />
                  </div>
                  <div className="absolute inset-[5.54%_8.51%_21.36%_87.06%]" data-node-id="0:6172" data-name="Wifi">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgWifi} />
                  </div>
                  <div className="absolute inset-[7.78%_14.4%_21.11%_80.67%]" data-node-id="0:6176" data-name="Cellular Connection">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCellularConnection} />
                  </div>
                  <div className="absolute h-[15px] left-0 overflow-clip top-0 w-[40px]" data-node-id="0:6179" data-name="Time Style">
                    <p className="[word-break:break-word] absolute font-app leading-[0] left-0 not-italic text-[15px] text-[var(--color-primary)] top-[calc(50%-7.5px)] tracking-[-0.3px] whitespace-nowrap" data-node-id="0:6180">
                      <span className="app-inherit-leading">19:4</span>
                      <span className="app-inherit-leading">1</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="portal-content-shift">

      <div className="absolute contents left-[10px] top-[146px]" data-node-id="0:6190" data-name="编组 27备份">
        <div className="absolute h-[298px] left-[10px] overflow-clip top-[146px] w-[355px]" data-node-id="0:6191" data-name="编组 7">
          <div className="absolute h-[298px] left-0 overflow-clip top-0 w-[355px]" data-node-id="0:6192" data-name="SectionOverview备份">
            <div className="absolute backdrop-blur-[3.997px] bg-[rgba(255,255,255,0.94)] border border-solid border-white h-[298px] left-0 rounded-[14px] shadow-[0px_2px_6px_0px_rgba(200,215,235,0.3)] top-0 w-[355px]" data-node-id="0:6193" data-name="SectionOverview" />
            <div className="absolute h-[229px] left-[15px] overflow-clip top-[55px] w-[325px]" data-node-id="0:6194" data-name="编组 8">
              <div className="absolute h-[229px] left-0 overflow-clip top-0 w-[325px]" data-node-id="0:6195" data-name="Margin">
                <div className="absolute contents left-0 top-0" data-node-id="0:6196" data-name="Background">
                  <div className="absolute h-[229px] left-0 overflow-clip top-0 w-[325px]" data-node-id="0:6197" data-name="编组 10">
                    <div className="absolute bg-[#fef2f2] left-0 rounded-[12px] size-[36px] top-0" data-node-id="0:6198" data-name="Background" />
                    <div className="absolute inset-[4.37%_91.32%_88.82%_2.77%]" data-node-id="0:6201" data-name="形状">
                      <PortalMetricIcon kind="revenue" className="overview-metric-icon"/>
                    </div>
                    <p className="[word-break:break-word] absolute font-app  left-[48px] not-italic text-[var(--color-primary)]  top-[18px] whitespace-nowrap app-type-page" data-node-id="0:6203">{(345.67 * (filters?.factor ?? 1)).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
                    <SceneAction onAction={onAction} action={{"type": "detail", "value": "当月营业收入 (万元)"}} className="[word-break:break-word] absolute font-app  left-[48px] not-italic text-[var(--color-muted)]  top-px whitespace-nowrap app-type-helper" data-node-id="0:6204">
                      当月营业收入 (万元)
                    </SceneAction>
                    <div className="absolute bg-[#eff6ff] left-0 rounded-[12px] size-[36px] top-[54px]" data-node-id="0:6205" data-name="Background" />
                    <div className="absolute inset-[27.95%_91.32%_65.24%_2.77%]" data-node-id="0:6208" data-name="形状">
                      <PortalMetricIcon kind="assets" className="overview-metric-icon"/>
                    </div>
                    <p className="[word-break:break-word] absolute font-app  left-[48px] not-italic text-[var(--color-primary)]  top-[72px] whitespace-nowrap app-type-page" data-node-id="0:6210">{(5678.90 * (filters?.factor ?? 1)).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
                    <p className="[word-break:break-word] absolute font-app  left-[48px] not-italic text-[var(--color-secondary)]  top-[55px] whitespace-nowrap app-type-secondary" data-node-id="0:6211">
                      资产总额(亿元)
                    </p>
                    <div className="absolute bg-[#fff7ed] left-[192px] rounded-[12px] size-[36px] top-0" data-node-id="0:6212" data-name="Background" />
                    <div className="absolute inset-[4.37%_32.25%_88.82%_61.85%]" data-node-id="0:6215" data-name="形状">
                      <PortalMetricIcon kind="profit" className="overview-metric-icon"/>
                    </div>
                    <p className="[word-break:break-word] absolute font-app  left-[240px] not-italic text-[var(--color-primary)]  top-[18px] whitespace-nowrap app-type-page" data-node-id="0:6217">{(345.67 * (filters?.factor ?? 1)).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
                    <p className="[word-break:break-word] absolute font-app  left-[240px] not-italic text-[var(--color-muted)]  top-px whitespace-nowrap app-type-helper" data-node-id="0:6218">
                      利润总额(亿元)
                    </p>
                    <div className="absolute bg-[#e8ffea] left-[192px] rounded-[12px] size-[36px] top-[54px]" data-node-id="0:6219" data-name="Background" />
                    <div className="absolute inset-[27.95%_32.25%_65.24%_61.85%]" data-node-id="0:6222" data-name="形状">
                      <PortalMetricIcon kind="net" className="overview-metric-icon"/>
                    </div>
                    <p className="[word-break:break-word] absolute font-app  left-[240px] not-italic text-[var(--color-primary)]  top-[72px] whitespace-nowrap app-type-page" data-node-id="0:6224">{(123.45 * (filters?.factor ?? 1)).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
                    <p className="[word-break:break-word] absolute font-app  left-[240px] not-italic text-[var(--color-secondary)]  top-[55px] whitespace-nowrap app-type-secondary" data-node-id="0:6225">
                      净利润(亿元)
                    </p>
                    <div className="absolute bg-[#fafafa] inset-[47.6%_0_0_0] rounded-[12px]" data-node-id="0:6226" data-name="矩形" />
                    <p className="-translate-x-1/2 [word-break:break-word] absolute font-app  left-[48px] not-italic text-[var(--color-muted)]  text-center top-[121px] whitespace-nowrap app-type-helper" data-node-id="0:6227">
                      净资产收益率
                    </p>
                    <p className="[word-break:break-word] absolute font-app  left-[115px] not-italic text-[var(--color-muted)]  top-[121px] whitespace-nowrap app-type-helper" data-node-id="0:6228">
                      营业收入现金比率
                    </p>
                    <div className="[word-break:break-word] absolute inset-[63.32%_44.18%_30.35%_44%] overflow-clip text-[var(--color-primary)] text-center whitespace-nowrap" data-node-id="0:6229" data-name="编组 19">
                      <p className="-translate-x-1/2 absolute font-app  left-[calc(50%-4.21px)] not-italic  top-0 app-type-body" data-node-id="0:6230">
                        11.2
                      </p>
                      <p className="-translate-x-1/2 absolute font-app font-normal  left-[calc(50%+15.71px)]  top-[2.5px] app-type-helper" data-node-id="0:6231" style={{ fontVariationSettings: '"wdth" 100' }}>
                        %
                      </p>
                    </div>
                    <div className="[word-break:break-word] absolute inset-[63.32%_79.26%_30.35%_8.92%] overflow-clip text-[var(--color-primary)] text-center whitespace-nowrap" data-node-id="0:6232" data-name="编组 22">
                      <p className="-translate-x-1/2 absolute font-app  left-[calc(50%-4.21px)] not-italic  top-0 app-type-body" data-node-id="0:6233">
                        11.2
                      </p>
                      <p className="-translate-x-1/2 absolute font-app font-normal  left-[calc(50%+15.71px)]  top-[2.5px] app-type-helper" data-node-id="0:6234" style={{ fontVariationSettings: '"wdth" 100' }}>
                        %
                      </p>
                    </div>
                    <p className="[word-break:break-word] absolute font-app  left-[247px] not-italic text-[var(--color-muted)]  top-[121px] whitespace-nowrap app-type-helper" data-node-id="0:6235">
                      资产负债率
                    </p>
                    <div className="[word-break:break-word] absolute inset-[78.17%_74.46%_5.9%_3.69%] overflow-clip whitespace-nowrap" data-node-id="0:6236" data-name="编组 26">
                      <p className="absolute font-app  left-0 not-italic text-[var(--color-muted)]  top-0 app-type-helper" data-node-id="0:6237">
                        研发投入强度
                      </p>
                      <div className="absolute inset-[60.27%_23.35%_0_22.54%] overflow-clip text-[var(--color-primary)] text-center" data-node-id="0:6238" data-name="编组 24">
                        <p className="-translate-x-1/2 absolute font-app  left-[calc(50%-3.71px)] not-italic  top-0 app-type-body" data-node-id="0:6239">
                          26.2
                        </p>
                        <p className="-translate-x-1/2 absolute font-app font-normal  left-[calc(50%+15.71px)]  top-[2.5px] app-type-helper" data-node-id="0:6240" style={{ fontVariationSettings: '"wdth" 100' }}>
                          %
                        </p>
                      </div>
                    </div>
                    <div className="[word-break:break-word] absolute font-app inset-[78.17%_34.46%_6.11%_39.08%] not-italic overflow-clip whitespace-nowrap" data-node-id="0:6241" data-name="编组 23">
                      <p className="absolute  left-0 text-[var(--color-muted)]  top-0 app-type-helper" data-node-id="0:6242">{`全员劳动生产率 `}</p>
                      <p className="-translate-x-1/2 absolute  left-[calc(50%-3.5px)] text-[var(--color-primary)]  text-center top-[22px] app-type-body" data-node-id="0:6243">
                        22.1
                      </p>
                    </div>
                    <div className="[word-break:break-word] absolute inset-[63.32%_9.41%_30.35%_80.15%] overflow-clip text-[var(--color-primary)] text-center whitespace-nowrap" data-node-id="0:6244" data-name="编组 18">
                      <p className="-translate-x-1/2 absolute font-app  left-[calc(50%-6.46px)] not-italic  top-0 app-type-body" data-node-id="0:6245">
                        1.2
                      </p>
                      <p className="-translate-x-1/2 absolute font-app font-normal  left-[calc(50%+13.46px)]  top-[2.5px] app-type-helper" data-node-id="0:6246" style={{ fontVariationSettings: '"wdth" 100' }}>
                        %
                      </p>
                    </div>
                    <p className="-translate-x-1/2 [word-break:break-word] absolute font-app font-normal  left-[calc(50%+23px)] text-[var(--color-primary)]  text-center top-[202px] whitespace-nowrap app-type-helper" data-node-id="0:6247" style={{ fontVariationSettings: '"wdth" 100' }}>
                      %
                    </p>
                    <div className="absolute bg-[#ebeef5] h-[16px] left-[102px] top-[144px] w-px" data-node-id="0:6248" data-name="分割线备份 9" />
                    <div className="absolute bg-[#ebeef5] h-[16px] left-[227px] top-[144px] w-px" data-node-id="0:6249" data-name="分割线备份 12" />
                    <div className="absolute bg-[#ebeef5] h-[18px] left-[102px] top-[197px] w-px" data-node-id="0:6250" data-name="分割线备份 14" />
                    <div className="absolute bg-[#ebeef5] h-[18px] left-[227px] top-[197px] w-px" data-node-id="0:6251" data-name="分割线备份 13" />
                  </div>
                </div>
              </div>
              <div className="absolute h-[37px] left-[48px] overflow-clip top-px w-[107px]" data-node-id="0:6252" data-name="Container">
                <div className="absolute contents left-0 top-[17px]" data-node-id="0:6253" data-name="Paragraph" />
                <div className="absolute contents left-0 top-0" data-node-id="0:6254" data-name="Container" />
              </div>
            </div>
            <div className="absolute h-[26px] left-[15px] overflow-clip top-[14.25px] w-[325px]" data-node-id="0:6255" data-name="Section Header">
              <div className="absolute h-[26px] left-0 overflow-clip top-0 w-[325px]" data-node-id="0:6256" data-name="Heading 2:margin">
                <div className="absolute h-[23px] left-[21px] top-[1.75px] w-[96px]" data-node-id="0:6257" data-name="Heading 2:margin" />
                <SceneAction onAction={onAction} action={{"type": "detail", "value": "一利五率+营收/利润"}} className="[word-break:break-word] absolute font-app  left-[13px] not-italic text-[var(--color-primary)]  top-[2px] whitespace-nowrap app-type-module" data-node-id="0:6258">
                  一利五率+营收/利润
                </SceneAction>
                <div className="-translate-y-1/2 absolute bg-gradient-to-t from-[#ffa938] h-[14px] left-0 rounded-[9793.893px] shadow-[0px_2px_8px_0px_rgba(255,0,0,0.28)] to-[#ff4e1d] top-[calc(50%+1px)] w-[5px]" data-node-id="0:6259" data-name="Gradient" />

              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute h-[291px] left-[10px] overflow-clip top-[454px] w-[355px]" data-node-id="0:6271" data-name="编组 3">
        <div className="absolute backdrop-blur-[3.997px] bg-[rgba(255,255,255,0.9)] border border-solid border-white h-[291px] left-0 rounded-[16px] shadow-[0px_4px_20px_0px_rgba(200,215,235,0.3)] top-0 w-[355px]" data-node-id="0:6272" data-name="col" />
        <div className="overview-tax-tabs" role="tablist" aria-label="纳税情况视图">
          {([['trend','营业收入与整体税负趋势'],['actual','当月实缴税款情况']] as const).map(([value,label])=><button key={value} type="button" role="tab" id={'tax-tab-'+value} aria-selected={taxTab===value} aria-controls="tax-chart-panel" tabIndex={taxTab===value?0:-1} onClick={()=>setTaxTab(value)} onKeyDown={event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const next=event.key==='Home'?'trend':event.key==='End'?'actual':taxTab==='trend'?'actual':'trend';setTaxTab(next);document.getElementById('tax-tab-'+next)?.focus()}}>{label}</button>)}
        </div>
        <div className="absolute inset-[0_55.49%_82.82%_5.35%] overflow-clip" data-node-id="0:6280" data-name="编组 20备份">
          <p className="[word-break:break-word] absolute font-app  left-[calc(50%-56.5px)] not-italic text-[var(--color-primary)]  top-[calc(50%-25px)] whitespace-nowrap mt-[13.0px]! app-type-module" data-node-id="0:6281">
            二级公司纳税情况
          </p>
          <div className="-translate-y-1/2 absolute bg-gradient-to-t from-[#ffa938] h-[14px] left-0 rounded-[9793.893px] shadow-[0px_2px_8px_0px_rgba(255,0,0,0.28)] to-[#ff4e1d] top-[calc(50%+1px)] w-[5px]" data-node-id="0:6282" data-name="Gradient" />
        </div>

        <div className={"absolute contents left-[15px] top-[113px] tax-chart-panel "+(taxTab==='actual'?'is-actual':'')} role="tabpanel" id="tax-chart-panel" aria-labelledby={'tax-tab-'+taxTab} data-node-id="0:6300" data-name="Top Metric summary tags">
          <div className="absolute contents left-[15px] top-[113px]" data-node-id="0:6301" data-name="编组 17">
            <div className="absolute contents left-[15px] top-[113px]" data-node-id="0:6302" data-name="编组 18">
              <div className="absolute h-[16px] left-[15px] overflow-clip top-[113px] w-[211px]" data-node-id="0:6303" data-name="编组 20">
                <div className="-translate-y-1/2 absolute bg-gradient-to-b from-[#ff7338] h-[10px] left-0 rounded-[2px] to-[#ff4e1d] top-1/2 w-[10.118px]" data-node-id="0:6304" data-name="Background" />
                <p className="[word-break:break-word] absolute font-app  left-[15px] not-italic text-[var(--color-secondary)]  top-[calc(50%-8px)] whitespace-nowrap app-type-secondary" data-node-id="0:6305">
                  营业收入 (万元)
                </p>
                <div className="absolute inset-[0_0_0_53.55%] overflow-clip" data-node-id="0:6306" data-name="编组 10">
                  <div className="absolute bottom-[31.25%] left-0 top-[31.25%] w-[10.12px]" data-node-id="0:6309" data-name="形状结合">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={img7} />
                  </div>
                  <p className="[word-break:break-word] absolute font-app  left-[17px] not-italic text-[var(--color-secondary)]  top-[calc(50%-8px)] whitespace-nowrap app-type-secondary" data-node-id="0:6310">
                    整体税负率 (%)
                  </p>
                </div>
              </div>
              <div className="absolute h-[123.944px] left-[15px] overflow-clip top-[149px] w-[325px]" data-node-id="0:6311" data-name="编组 4">
                <div className="absolute inset-[4.03%_2.77%_95.56%_8%]" data-node-id="0:6312" data-name="Vector">
                  <div className="absolute inset-[-114.37%_0]">
                    <img alt="" className="block max-w-none size-full" src={imgVector} />
                  </div>
                </div>
                <div className="absolute inset-[31.47%_2.77%_68.13%_8%]" data-node-id="0:6313" data-name="Vector">
                  <div className="absolute inset-[-114.37%_0]">
                    <img alt="" className="block max-w-none size-full" src={imgVector} />
                  </div>
                </div>
                <div className="absolute inset-[58.09%_2.77%_40.3%_8%]" data-node-id="0:6314" data-name="Vector">
                  <div className="absolute inset-[21.41%_0_10.51%_0]">
                    <img alt="" className="block max-w-none size-full" src={imgVector1} />
                  </div>
                </div>
                <div className="absolute inset-[82.3%_2.77%_17.3%_8%]" data-node-id="0:6315" data-name="Vector">
                  <div className="absolute inset-[-114.37%_0]">
                    <img alt="" className="block max-w-none size-full" src={imgVector2} />
                  </div>
                </div>
                <div className="absolute h-[10.015px] left-0 top-px w-[16.473px]" data-node-id="0:6316" data-name="Text" />
                <p className="[word-break:break-word] absolute font-app  left-[3px] not-italic text-[var(--color-muted)]  top-0 whitespace-nowrap app-type-helper" data-node-id="0:6317">
                  20k
                </p>
                <div className="absolute h-[10.021px] left-0 top-[35.31px] w-[16.473px]" data-node-id="0:6318" data-name="Text" />
                <p className="[word-break:break-word] absolute font-app  left-[3px] not-italic text-[var(--color-muted)]  top-[34px] whitespace-nowrap app-type-helper" data-node-id="0:6319">
                  15k
                </p>
                <div className="absolute h-[10.031px] left-0 top-[69.62px] w-[16.473px]" data-node-id="0:6320" data-name="Text" />
                <p className="[word-break:break-word] absolute font-app  left-[3px] not-italic text-[var(--color-muted)]  top-[69px] whitespace-nowrap app-type-helper" data-node-id="0:6321">
                  10k
                </p>
                <div className="absolute h-[10.053px] left-0 top-[97.07px] w-[5.491px]" data-node-id="0:6322" data-name="Text" />
                <p className="[word-break:break-word] absolute font-app  left-[17px] not-italic text-[var(--color-muted)]  top-[96px] whitespace-nowrap app-type-helper" data-node-id="0:6323">
                  0
                </p>
                <p className="[word-break:break-word] absolute font-app  left-[318px] not-italic text-[var(--color-muted)]  top-0 whitespace-nowrap app-type-helper" data-node-id="0:6324">
                  3
                </p>
                <p className="[word-break:break-word] absolute font-app  left-[318px] not-italic text-[var(--color-muted)]  top-[34px] whitespace-nowrap app-type-helper" data-node-id="0:6325">
                  2
                </p>
                <p className="[word-break:break-word] absolute font-app  left-[318px] not-italic text-[var(--color-muted)]  top-[69px] whitespace-nowrap app-type-helper" data-node-id="0:6326">
                  1
                </p>
                <p className="[word-break:break-word] absolute font-app  left-[318px] not-italic text-[var(--color-muted)]  top-[96px] whitespace-nowrap app-type-helper" data-node-id="0:6327">
                  0
                </p>
                <div className="absolute bg-gradient-to-b from-[#ff7338] h-[86px] left-[47.19px] rounded-tl-[5px] rounded-tr-[5px] to-[#ff4e1d] top-[16.04px] w-[8px]" data-node-id="0:6328" data-name="rectangle备份 18" />
                <div className="absolute bg-gradient-to-b from-[#ff7338] h-[72px] left-[96.19px] rounded-tl-[5px] rounded-tr-[5px] to-[#ff4e1d] top-[30.04px] w-[8px]" data-node-id="0:6329" data-name="rectangle备份 19" />
                <div className="absolute bg-gradient-to-b from-[#ff7338] h-[80px] left-[145.19px] rounded-tl-[5px] rounded-tr-[5px] to-[#ff4e1d] top-[22.04px] w-[8px]" data-node-id="0:6330" data-name="rectangle备份 20" />
                <div className="absolute bg-gradient-to-b from-[#ff7338] h-[65px] left-[194.19px] rounded-tl-[5px] rounded-tr-[5px] to-[#ff4e1d] top-[37.04px] w-[8px]" data-node-id="0:6331" data-name="rectangle备份 21" />
                <div className="absolute bg-gradient-to-b from-[#ff7338] h-[86px] left-[243.19px] rounded-tl-[5px] rounded-tr-[5px] to-[#ff4e1d] top-[16.04px] w-[8px]" data-node-id="0:6332" data-name="rectangle备份 22" />
                <div className="absolute bg-gradient-to-b from-[#ff7338] h-[86px] left-[292.19px] rounded-tl-[5px] rounded-tr-[5px] to-[#ff4e1d] top-[16.04px] w-[8px]" data-node-id="0:6333" data-name="rectangle备份 23" />
                <div className="absolute inset-[17.58%_8.33%_57.48%_16.01%]" data-node-id="0:6334" data-name="Vector">
                  <div className="absolute inset-[-3.5%_-0.12%_-3.52%_-0.17%]">
                    <img alt="" className="block max-w-none size-full" src={imgVector3} />
                  </div>
                </div>
                <div className="absolute inset-[21.27%_83.51%_73.89%_14.64%]" data-node-id="0:6335" data-name="Vector">
                  <div className="absolute inset-[-16.67%]">
                    <img alt="" className="block max-w-none size-full" src={imgVector4} />
                  </div>
                </div>
                <div className="absolute inset-[38.94%_68.38%_56.21%_29.78%]" data-node-id="0:6336" data-name="Vector">
                  <div className="absolute inset-[-16.67%]">
                    <img alt="" className="block max-w-none size-full" src={imgVector5} />
                  </div>
                </div>
                <div className="absolute inset-[24.85%_53.24%_70.31%_44.91%]" data-node-id="0:6337" data-name="Vector">
                  <div className="absolute inset-[-16.67%]">
                    <img alt="" className="block max-w-none size-full" src={imgVector6} />
                  </div>
                </div>
                <div className="absolute inset-[37.1%_37.8%_58.06%_60.35%]" data-node-id="0:6338" data-name="Vector">
                  <div className="absolute inset-[-16.67%]">
                    <img alt="" className="block max-w-none size-full" src={imgVector7} />
                  </div>
                </div>
                <div className="absolute inset-[15.61%_22.98%_79.55%_75.17%]" data-node-id="0:6339" data-name="Vector">
                  <div className="absolute inset-[-16.67%]">
                    <img alt="" className="block max-w-none size-full" src={imgVector6} />
                  </div>
                </div>
                <div className="absolute inset-[26.82%_7.85%_68.34%_90.31%]" data-node-id="0:6340" data-name="Vector">
                  <div className="absolute inset-[-16.67%]">
                    <img alt="" className="block max-w-none size-full" src={imgVector8} />
                  </div>
                </div>
                <p className="[word-break:break-word] absolute font-app  left-[43.03px] not-italic text-[var(--color-muted)]  top-[110.94px] whitespace-nowrap app-type-helper" data-node-id="0:6341">
                  1月
                </p>
                <p className="[word-break:break-word] absolute font-app  left-[91.03px] not-italic text-[var(--color-muted)]  top-[110.94px] whitespace-nowrap app-type-helper" data-node-id="0:6342">
                  2月
                </p>
                <p className="[word-break:break-word] absolute font-app  left-[140.02px] not-italic text-[var(--color-muted)]  top-[110.94px] whitespace-nowrap app-type-helper" data-node-id="0:6343">
                  3月
                </p>
                <p className="[word-break:break-word] absolute font-app  left-[191.02px] not-italic text-[var(--color-muted)]  top-[110.94px] whitespace-nowrap app-type-helper" data-node-id="0:6344">
                  4月
                </p>
                <p className="[word-break:break-word] absolute font-app  left-[238.02px] not-italic text-[var(--color-muted)]  top-[110.94px] whitespace-nowrap app-type-helper" data-node-id="0:6345">
                  5月
                </p>
                <p className="[word-break:break-word] absolute font-app  left-[287.02px] not-italic text-[var(--color-muted)]  top-[110.94px] whitespace-nowrap app-type-helper" data-node-id="0:6346">
                  6月
                </p>
              </div>
            </div>
          </div>
          <div className="absolute contents left-[182.41px] top-[111px]" data-node-id="0:6347" data-name="编组 17备份" />
        </div>
      </div>
      <ProvinceTaxMap/>
      <div className="absolute h-[320px] left-[10px] overflow-clip top-[1349px] w-[355px]" data-node-id="0:6484" data-name="编组 11备份 2">
        <div className="absolute backdrop-blur-[3.997px] bg-[rgba(255,255,255,0.8)] border border-solid border-white inset-0 rounded-[16px] shadow-[0px_4px_20px_0px_rgba(200,215,235,0.3)]" data-node-id="0:6485" data-name="CARD 2.2: 集团重大科技创新项目实施进度 (4 Cols):shadow" />
        <div className="absolute inset-[0.31%_28.73%_84.06%_5.35%] overflow-clip" data-node-id="0:6486" data-name="编组 20备份 2">
          <SceneAction onAction={onAction} action={{"type": "detail", "value": "集团重大科技创新项目实施进度"}} className="[word-break:break-word] absolute font-app  left-[calc(50%-104px)] not-italic text-[var(--color-primary)]  top-[calc(50%-25px)] whitespace-nowrap mt-[13.0px]! app-type-module" data-node-id="0:6487">
            集团重大科技创新项目实施进度
          </SceneAction>
          <div className="-translate-y-1/2 absolute bg-gradient-to-t from-[#ffa938] h-[14px] left-0 rounded-[9793.893px] shadow-[0px_2px_8px_0px_rgba(255,0,0,0.28)] to-[#ff4e1d] top-[calc(50%+1px)] w-[5px]" data-node-id="0:6488" data-name="Gradient" />
        </div>
        <div className="innovation-legend" aria-label="研发经费图例">
          <span><i className="innovation-budget-key" aria-hidden="true"/>预算研发经费投入 (万元)</span>
          <span><i className="innovation-actual-key" aria-hidden="true"/>实际研发经费投入 (万元)</span>
        </div>
        <div className="absolute inset-[27.19%_4.23%_62.5%_5.35%] overflow-clip" data-node-id="0:6500" data-name="编组 35">
          <div className="absolute h-[33px] left-[280.92px] overflow-clip top-0 w-[40.077px]" data-node-id="0:6501" data-name="Container">
            <div className="[word-break:break-word] absolute font-app h-[33px]  left-0 not-italic overflow-clip text-[var(--color-muted)]  top-0 w-[40.077px] whitespace-nowrap app-type-helper" data-node-id="0:6502" data-name="Container">
              <p className="absolute left-[8.08px] top-0" data-node-id="0:6503">
                8,500
              </p>
              <p className="absolute left-0 top-[17px]" data-node-id="0:6504">
                7,200
              </p>
            </div>
          </div>
          <div className="absolute h-[24px] left-[128px] overflow-clip top-[5px] w-[157px]" data-node-id="0:6505" data-name="Container">
            <div className="absolute inset-0 overflow-clip" data-node-id="0:6506" data-name="编组 13">
              <div className="absolute h-[6px] left-0 opacity-81 right-0 rounded-[9999px] top-0" data-node-id="0:6507" style={{ backgroundImage: "linear-gradient(90deg, rgb(255, 59, 0) 0%, rgb(255, 59, 0) 100%), linear-gradient(90deg, rgb(241, 245, 249) 0%, rgb(241, 245, 249) 100%)" }} data-name="Background" />
              <div className="absolute bg-[#ffd1bd] h-[6px] left-0 right-[5.14%] rounded-[9999px] top-[18px]" data-node-id="0:6508" data-name="Background" />
            </div>
            <div className="absolute h-[6.066px] left-[20px] right-[-84.96px] top-[14.02px]" data-node-id="0:6509" data-name="Background" />
          </div>
          <SceneAction onAction={onAction} action={{"type": "detail", "value": "新一代人工智能技术…"}} className="[word-break:break-word] absolute font-app  left-0 not-italic text-[var(--color-primary)]  top-[8px] whitespace-nowrap app-type-helper" data-node-id="0:6510">
            新一代人工智能技术…
          </SceneAction>
        </div>
        <div className="absolute inset-[41.25%_9.58%_47.81%_5.35%] overflow-clip" data-node-id="0:6511" data-name="编组 34">
          <div className="absolute h-[35px] left-[257px] overflow-clip top-0 w-[45px]" data-node-id="0:6512" data-name="Container备份">
            <div className="[word-break:break-word] absolute font-app h-[35px]  left-0 not-italic overflow-clip text-[var(--color-muted)]  top-0 w-[45px] whitespace-nowrap app-type-helper" data-node-id="0:6513" data-name="Container">
              <p className="absolute left-[13px] top-0" data-node-id="0:6514">
                6,200
              </p>
              <p className="absolute left-0 top-[19px]" data-node-id="0:6515">
                5,100
              </p>
            </div>
          </div>
          <div className="absolute h-[24.115px] left-[126px] overflow-clip top-[6px] w-[140px]" data-node-id="0:6516" data-name="Container">
            <div className="absolute h-[6.031px] left-0 overflow-clip right-0 top-0" data-node-id="0:6517" data-name="Background">
              <div className="absolute bg-[#ff5c2b] h-[6.031px] left-0 opacity-81 right-0 rounded-[9999px] top-0" data-node-id="0:6518" data-name="Background" />
            </div>
            <div className="absolute h-[6.083px] left-0 overflow-clip right-[13px] top-[18.03px]" data-node-id="0:6519" data-name="Background">
              <div className="absolute bg-[#ffd1bd] h-[6.083px] left-0 right-0 rounded-[9999px] top-0" data-node-id="0:6520" data-name="Background" />
            </div>
          </div>
          <p className="[word-break:break-word] absolute font-app  left-0 not-italic text-[var(--color-primary)]  top-[10px] whitespace-nowrap app-type-helper" data-node-id="0:6521">
            高性能复合材料研制
          </p>
        </div>
        <div className="absolute inset-[55.94%_19.72%_33.75%_5.35%] overflow-clip" data-node-id="0:6522" data-name="编组 33">
          <div className="absolute h-[33px] left-[215.45px] overflow-clip top-0 w-[50.547px]" data-node-id="0:6523" data-name="Container备份 2">
            <div className="[word-break:break-word] absolute font-app h-[33px]  left-0 not-italic overflow-clip text-[var(--color-muted)]  top-0 w-[50.547px] whitespace-nowrap app-type-helper" data-node-id="0:6524" data-name="Container">
              <p className="absolute left-[18.55px] top-0" data-node-id="0:6525">
                2,600
              </p>
              <p className="absolute left-0 top-[17px]" data-node-id="0:6526">
                1,800
              </p>
            </div>
          </div>
          <div className="absolute h-[24.157px] left-[128px] overflow-clip top-[5px] w-[102px]" data-node-id="0:6527" data-name="Container">
            <div className="absolute h-[24.157px] left-0 overflow-clip right-0 top-0" data-node-id="0:6528" data-name="Background">
              <div className="absolute inset-0 overflow-clip" data-node-id="0:6529" data-name="编组 26">
                <div className="absolute bg-[#ff5c2b] h-[6.043px] left-0 opacity-81 right-0 rounded-[9999px] top-0" data-node-id="0:6530" data-name="Background" />
                <div className="absolute bg-[#ffd1bd] h-[6.114px] left-0 right-[18.18%] rounded-[9999px] top-[18.04px]" data-node-id="0:6531" data-name="Background" />
              </div>
            </div>
            <div className="absolute h-[6.114px] left-[20px] right-[-50.11px] top-[18.04px]" data-node-id="0:6532" data-name="Background" />
          </div>
          <p className="[word-break:break-word] absolute font-app  left-0 not-italic text-[var(--color-primary)]  top-[9px] whitespace-nowrap app-type-helper" data-node-id="0:6533">
            新型生物药物研发平台
          </p>
        </div>
        <div className="absolute inset-[70%_25.07%_19.06%_5.35%] overflow-clip" data-node-id="0:6534" data-name="编组 32">
          <div className="absolute h-[35px] left-[191.3px] overflow-clip top-0 w-[55.7px]" data-node-id="0:6535" data-name="Container备份 3">
            <div className="[word-break:break-word] absolute font-app h-[35px]  left-0 not-italic overflow-clip text-[var(--color-muted)]  top-0 w-[55.7px] whitespace-nowrap app-type-helper" data-node-id="0:6536" data-name="Container">
              <p className="absolute left-[23.7px] top-0" data-node-id="0:6537">
                1,900
              </p>
              <p className="absolute left-0 top-[19px]" data-node-id="0:6538">
                1,400
              </p>
            </div>
          </div>
          <p className="[word-break:break-word] absolute font-app  left-0 not-italic text-[var(--color-primary)]  top-[10px] whitespace-nowrap app-type-helper" data-node-id="0:6539">
            7nm芯片先导制程项目
          </p>
          <div className="absolute contents inset-[17.14%_14.57%_13.58%_53.44%]" data-node-id="0:6540" data-name="编组 3">
            <div className="absolute inset-[17.14%_14.57%_13.58%_53.44%] overflow-clip" data-node-id="0:6541" data-name="编组 28">
              <div className="absolute bg-[#ff5c2b] h-[6.068px] left-0 opacity-81 right-0 rounded-[9999px] top-0" data-node-id="0:6542" data-name="Background" />
              <div className="absolute bg-[#ffd1bd] h-[6.181px] left-0 right-[30%] rounded-[9999px] top-[18.07px]" data-node-id="0:6543" data-name="Background" />
            </div>
          </div>
        </div>
        <div className="absolute inset-[84.69%_33.24%_4.38%_5.35%] overflow-clip" data-node-id="0:6544" data-name="编组 31">
          <div className="absolute h-[35px] left-[172.08px] overflow-clip top-0 w-[45.915px]" data-node-id="0:6545" data-name="Container备份 4">
            <div className="[word-break:break-word] absolute font-app h-[35px]  left-0 not-italic overflow-clip text-[var(--color-muted)]  top-0 w-[45.915px] whitespace-nowrap app-type-helper" data-node-id="0:6546" data-name="Container">
              <p className="absolute left-[13.92px] top-0" data-node-id="0:6547">
                1,500
              </p>
              <p className="absolute left-0 top-[19px]" data-node-id="0:6548">
                1,200
              </p>
            </div>
          </div>
          <p className="[word-break:break-word] absolute font-app  left-0 not-italic text-[var(--color-primary)]  top-[6px] whitespace-nowrap app-type-helper" data-node-id="0:6549">
            新型固态电池规模化
          </p>
          <div className="absolute inset-[14.29%_16.51%_13.05%_60.09%] overflow-clip" data-node-id="0:6550" data-name="编组 30">
            <div className="absolute bg-[#ff5c2b] h-[6.162px] left-0 opacity-81 right-0 rounded-[9999px] top-0" data-node-id="0:6551" data-name="Background" />
            <div className="absolute bg-[#ffd1bd] h-[6.431px] left-0 right-[27.29%] rounded-[9999px] top-[19px]" data-node-id="0:6552" data-name="Background" />
          </div>
        </div>
      </div>
      </div>

    </div>
  );
}
