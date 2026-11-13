import PortalBanner from "../components/PortalBanner";
import {ChevronRight} from "lucide-react";
import {SceneAction, type SceneProps} from "../components/SceneAction";
const img = "/assets/figma/1c7fc862-b078-4de5-98d3-cd51a5a0f51f.png";
const img2 = "/assets/figma/dfeddcb7-bd05-4b4d-af3e-9873d0f1ae52.png";
const img3 = "/assets/figma/e84ad16d-435d-4806-af40-e760a9396377.png";
const img4 = "/assets/figma/1a1d8f44-7c9b-4d99-8b7b-1d4ab7b95fce.png";
const img5 = "/assets/figma/fd08b93b-bf37-4465-84c8-114892a9d7db.png";
const img6G = "/assets/figma/c870548d-6f64-459c-a5f9-f28f682fb0c3.png";
const img8 = "/assets/figma/635c4711-ac58-448c-8ee9-cd39f9d8e990.png";
const img11 = "/assets/figma/ee1c30d6-a504-4fb5-882e-0899391b510a.png";
const img12 = "/assets/figma/f88714ef-4de6-4b3e-9a7b-363baf33f554.png";
const img13 = "/assets/figma/9388226f-b968-4388-8652-2ef05b3d6bd1.png";
const img14 = "/assets/figma/0d637543-e72e-48f1-ba5f-091431d9daca.png";
const img16 = "/assets/figma/ee2111ec-65f0-45eb-b99e-4cc1874a332c.png";
const img27 = "/assets/figma/3d117cde-4924-47ce-869c-fbcde8abd807.png";
const imgTopHeaderSection = "/assets/figma/22733795-0bdc-428d-903a-27d953ae7f71.svg";
const imgBattery = "/assets/figma/0fc82551-ee8e-4f04-85c4-26c028d2266d.svg";
const imgWifi = "/assets/figma/2d576c95-7864-4ad7-83b4-757093128fcd.svg";
const imgCellularConnection = "/assets/figma/45c71c45-15eb-4966-a031-2c79dee7acb4.svg";
const imgContainer = "/assets/figma/3bb3be1e-a7a8-46c4-89de-6e09832f0ebf.svg";
const imgFrame = "/assets/figma/710f5ba1-822b-4ca7-a11c-818108c7802a.svg";
const img1 = "/assets/figma/f10eb84d-e864-4cd0-a8ab-3ec9fd1ffa18.svg";
const imgArticle111 = "/assets/figma/2d5b04ff-496d-4ec3-8e5a-1e840741453a.svg";
const imgArticle222 = "/assets/figma/ae2c6da8-dd38-48cd-8e3b-bf8e952954d7.svg";
const imgText = "/assets/figma/bc1fa79a-64b2-4cea-bc97-f7f97fd0f0b9.svg";
const img6 = "/assets/figma/82437107-35f9-43a2-8da8-c9286c21b45e.svg";
const imgContainer1 = "/assets/figma/08e6139c-2ad8-49a8-86c2-be6d4cb58a47.svg";
const img7 = "/assets/figma/c0ef0db5-ef7e-499a-8c96-d25da3e6dee8.svg";
const img9 = "/assets/figma/d9891138-2750-4f05-a459-615eeae70fb3.svg";
const img10 = "/assets/figma/08338b57-d27b-4c98-bc3f-dd5d25983ba9.svg";
const imgButton = "/assets/figma/5a10f0d6-e195-4cb9-8879-133fbecec470.svg";
const imgSvg = "/assets/figma/4d34d4a9-4332-43e2-8364-f5b96a5de326.svg";
const imgContainer2 = "/assets/figma/48c11193-54b9-4425-b05e-6d0cc6dc9845.svg";
const imgSvg1 = "/assets/figma/ffa370e9-6b49-4920-8e2f-592c7de0488d.svg";
const imgSvg2 = "/assets/figma/fb165cef-ad10-470b-a319-a18d2d32d843.svg";
const imgContainer3 = "/assets/figma/2a17118d-34f1-4905-8ee4-6c76dde26649.svg";
const img15 = "/assets/figma/3b264d4b-833d-4b74-9397-71fbca0b1997.svg";
const imgFill = "/assets/figma/41fd577f-e228-476c-8045-03ae4a9e9b42.svg";
const imgFrame1 = "/assets/figma/7a90692b-02cf-423a-b2f7-4b59b41c988d.svg";
const imgRow = "/assets/figma/1191403c-65ec-4cfe-b9cf-715bbe1f0c5b.svg";
const imgRow1 = "/assets/figma/bb6cb5c8-0c69-48ed-87b4-e05178d38e89.svg";
const img17 = "/assets/figma/d2b7d2ad-ed44-429e-bc61-60eb220226aa.svg";
const img18 = "/assets/figma/cc0bf04d-862a-4e01-9df8-13c864d35f9f.svg";
const img19 = "/assets/figma/ea002ec6-169a-425c-8226-3bef7c816dde.svg";
const img20 = "/assets/figma/36d86562-8204-41e7-a74a-bd0b85b76fc7.svg";
const img21 = "/assets/figma/3ada57d7-a730-4c6a-a5bd-e3df306e508c.svg";
const img23 = "/assets/figma/b7d04e08-aa6e-44bc-a267-a0971d6e4aad.svg";
const img22 = "/assets/figma/af415af4-5d0d-4373-afff-58c2cb601d52.svg";
const img24 = "/assets/figma/38c5d62b-4152-443b-9467-fa27cc28a525.svg";
const img25 = "/assets/figma/4dbac310-0afa-4509-9f9e-edf9fee7a8ee.svg";
const img26 = "/assets/figma/58ab1535-082a-443a-9dc4-fbc8af2aa2e4.svg";

export default function StaffScene({onAction}: SceneProps) {
  return (
    <div className="bg-[#f2f3f7] relative size-full" data-node-id="0:8620" data-name="我的门户-普通">
      <div className="absolute h-[960.942px] left-0 overflow-clip top-[-0.18px] w-[375px]" data-node-id="0:8621" data-name="背景">
        <div className="-translate-y-1/2 absolute bg-[#f7f8fa] h-[960.942px] left-0 shadow-[0px_0px_34px_0px_rgba(0,0,0,0.12)] top-1/2 w-[375px]" data-node-id="0:8623" data-name="PhoneShellContainer" />
        <div className="absolute h-[249.038px] left-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-34px_-34px] mask-size-[443px_1028.942px] overflow-clip top-0 w-[375.238px]" data-node-id="0:8624" style={{ maskImage: `url("${imgTopHeaderSection}")` }} data-name="TopHeaderSection">
          <div className="absolute h-[249.038px] left-0 top-0 w-[375px]" data-node-id="0:8625" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 375 249.04' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(38.942 0 0 25.911 318.75 24.904)'><stop stop-color='rgba(255,210,208,1)' offset='0'/><stop stop-color='rgba(255,233,231,1)' offset='0.35'/><stop stop-color='rgba(252,247,246,1)' offset='0.7'/><stop stop-color='rgba(247,248,250,1)' offset='1'/></radialGradient></defs></svg>\")" }} data-name="TopHeaderSection" />
          <div className="absolute flex inset-[0.07%_0_15.2%_0] items-center justify-center" data-node-id="0:8626" style={{ containerType: "size" }}>
            <div className="-scale-x-100 flex-none h-[100cqh] w-[100cqw]">
              <div className="opacity-40 relative size-full" data-name="位图">
                <img alt="" className="absolute inset-0 max-w-none object-bottom pointer-events-none size-full" src={img} />
              </div>
            </div>
          </div>
          <div className="absolute contents inset-[6.7%_3.97%_87.28%_4.13%]" data-node-id="0:8627" data-name="导航:30/状态栏StatusBar/黑色字备份 2">
            <div className="absolute inset-[6.7%_3.97%_87.28%_4.13%] overflow-clip" data-node-id="0:8628">
              <div className="absolute h-[15px] left-0 overflow-clip right-0 top-0" data-node-id="0:8629" data-name="iPhone X/Status Bars/Status Bar (Black)">
                <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[15px] left-1/2 overflow-clip top-1/2 w-[344.828px]" data-node-id="0:8630" data-name="iPhone X/Status Bars/Status Bar (Black)">
                  <div className="absolute h-[11.333px] right-0 top-[0.83px] w-[24.328px]" data-node-id="0:8631" data-name="Battery">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBattery} />
                  </div>
                  <div className="absolute inset-[5.54%_8.51%_21.36%_87.06%]" data-node-id="0:8637" data-name="Wifi">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgWifi} />
                  </div>
                  <div className="absolute inset-[7.78%_14.4%_21.11%_80.67%]" data-node-id="0:8641" data-name="Cellular Connection">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCellularConnection} />
                  </div>
                  <div className="absolute h-[15px] left-0 overflow-clip top-0 w-[40px]" data-node-id="0:8644" data-name="Time Style">
                    <p className="[word-break:break-word] absolute font-app leading-[0] left-0 not-italic text-[15px] text-[var(--color-primary)] top-[calc(50%-7.5px)] tracking-[-0.3px] whitespace-nowrap" data-node-id="0:8645">
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
      <PortalBanner onAction={onAction}/>
      
      
      
      <section className="portal-notices" aria-label="通知公告，左右滑动查看" tabIndex={0}><div className="relative h-[225px] shrink-0 overflow-clip w-[236px]" data-node-id="0:9027" data-name="1: 基金榜单 (热涨ETF)">
        <div className="absolute border border-[rgba(0,0,0,0.03)] border-solid bottom-0 left-0 rounded-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] top-0 w-[236px]" data-node-id="0:9029" style={{ backgroundImage: "linear-gradient(180deg, rgba(255, 231, 231, 0.7) 0%, rgba(255, 232, 232, 0.275) 14.846%, rgba(255, 255, 255, 0.213) 30.026%, rgba(255, 255, 255, 0.137) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="1: 基金榜单 (热涨ETF)" />
        <button type="button" className="portal-notice-heading" data-node-id="0:9033" onClick={()=>onAction({type:"list",value:"最新通知"})}><span>最新通知</span><ChevronRight size={14} aria-hidden="true"/></button>
        <img className="portal-notice-icon" data-node-id="0:9041" src="/assets/ui/notice-red.png" alt="" />
        <div className="absolute h-[22px] left-[15px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-17px_-55px] mask-size-[240px_229px] overflow-clip top-[54px] w-[200px]" data-node-id="0:9042" style={{ maskImage: `url("${imgContainer2}")` }} data-name="Item">
          <div className="-translate-y-1/2 absolute h-[22px] left-0 overflow-clip top-1/2 w-[200px]" data-node-id="0:9043" data-name="Container">
            <div className="-translate-y-1/2 absolute h-[22px] left-0 overflow-clip top-1/2 w-[21.086px]" data-node-id="0:9044" data-name="Container">
              <div className="-translate-y-1/2 absolute h-[18px] left-0 top-1/2 w-[21.086px]" data-node-id="0:9045" data-name="Container" />
              <p className="[word-break:break-word] absolute font-app  left-[calc(50%-10.54px)] not-italic text-[var(--color-brand)]  top-0 whitespace-nowrap app-type-body" data-node-id="0:9046">
                1.
              </p>
            </div>
            <SceneAction onAction={onAction} action={{"type": "detail", "value": "关于2026年五一劳动节放假..."}} className="[word-break:break-word] absolute font-app  left-[17px] not-italic text-[var(--color-primary)]  top-0 whitespace-nowrap app-type-body" data-node-id="0:9047">
              关于2026年五一劳动节放假...
            </SceneAction>
          </div>
        </div>
        <div className="absolute h-[22px] left-[14.5px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-16.5px_-89px] mask-size-[240px_229px] overflow-clip top-[88px] w-[183.5px]" data-node-id="0:9048" style={{ maskImage: `url("${imgContainer2}")` }} data-name="Item">
          <div className="-translate-y-1/2 absolute h-[22px] left-0 overflow-clip top-1/2 w-[183.5px]" data-node-id="0:9049" data-name="Container">
            <div className="-translate-y-1/2 absolute h-[22px] left-0 overflow-clip top-1/2 w-[13px]" data-node-id="0:9050" data-name="Container">
              <div className="-translate-y-1/2 absolute h-[18px] left-[0.5px] top-1/2 w-[12px]" data-node-id="0:9051" data-name="Container" />
              <p className="[word-break:break-word] absolute font-app  left-[calc(50%-6.5px)] not-italic text-[var(--color-warning)]  top-0 whitespace-nowrap app-type-body" data-node-id="0:9052">
                2.
              </p>
            </div>
            <SceneAction onAction={onAction} action={{"type": "detail", "value": "开展集团数据安全专项检查"}} className="[word-break:break-word] absolute font-app  left-[17.5px] not-italic text-[var(--color-primary)]  top-0 whitespace-nowrap app-type-body" data-node-id="0:9053">
              开展集团数据安全专项检查
            </SceneAction>
          </div>
        </div>
        <div className="absolute h-[22px] left-[14.5px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-16.5px_-123px] mask-size-[240px_229px] overflow-clip top-[122px] w-[201.5px]" data-node-id="0:9054" style={{ maskImage: `url("${imgContainer2}")` }} data-name="Item">
          <div className="-translate-y-1/2 absolute h-[22px] left-0 overflow-clip top-1/2 w-[201.5px]" data-node-id="0:9055" data-name="Container">
            <div className="-translate-y-1/2 absolute h-[22px] left-0 overflow-clip top-1/2 w-[13px]" data-node-id="0:9056" data-name="Container">
              <div className="-translate-y-1/2 absolute h-[18px] left-[0.5px] top-1/2 w-[12px]" data-node-id="0:9057" data-name="Container" />
              <p className="[word-break:break-word] absolute font-app  left-[calc(50%-6.5px)] not-italic text-[var(--color-warning)]  top-0 whitespace-nowrap app-type-body" data-node-id="0:9058">
                3.
              </p>
            </div>
            <SceneAction onAction={onAction} action={{"type": "detail", "value": "组织2026年度员工体检的通知"}} className="[word-break:break-word] absolute font-app  left-[17.5px] not-italic text-[var(--color-primary)]  top-0 whitespace-nowrap app-type-body" data-node-id="0:9059">
              组织2026年度员工体检的通知
            </SceneAction>
          </div>
        </div>
        <div className="absolute h-[22px] left-[14.5px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-16.5px_-157px] mask-size-[240px_229px] overflow-clip top-[156px] w-[210.5px]" data-node-id="0:9060" style={{ maskImage: `url("${imgContainer2}")` }} data-name="Item">
          <div className="-translate-y-1/2 absolute h-[22px] left-0 overflow-clip top-1/2 w-[210.5px]" data-node-id="0:9061" data-name="Container">
            <div className="-translate-y-1/2 absolute h-[18px] left-0 overflow-clip top-1/2 w-[13px]" data-node-id="0:9062" data-name="Container">
              <div className="-translate-y-1/2 absolute h-[18px] left-[0.5px] top-1/2 w-[12px]" data-node-id="0:9063" data-name="Container" />
              <p className="-translate-x-1/2 [word-break:break-word] absolute font-app  left-1/2 not-italic text-[var(--color-muted)]  text-center top-0 whitespace-nowrap app-type-body" data-node-id="0:9064">
                4.
              </p>
            </div>
            <SceneAction onAction={onAction} action={{"type": "detail", "value": "参加“数字化创新大赛”的通知"}} className="[word-break:break-word] absolute font-app  left-[17.5px] not-italic text-[var(--color-primary)]  top-0 whitespace-nowrap app-type-body" data-node-id="0:9065">
              参加“数字化创新大赛”的通知
            </SceneAction>
          </div>
        </div>
        <div className="absolute h-[22px] left-[14.5px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-16.5px_-191px] mask-size-[240px_229px] overflow-clip top-[190px] w-[195.5px]" data-node-id="0:9066" style={{ maskImage: `url("${imgContainer2}")` }} data-name="Item">
          <div className="-translate-y-1/2 absolute h-[22px] left-0 overflow-clip top-1/2 w-[195.5px]" data-node-id="0:9067" data-name="Container">
            <div className="-translate-y-1/2 absolute h-[18px] left-0 overflow-clip top-1/2 w-[13px]" data-node-id="0:9068" data-name="Container">
              <div className="-translate-y-1/2 absolute h-[18px] left-[0.5px] top-1/2 w-[12px]" data-node-id="0:9069" data-name="Container" />
              <p className="-translate-x-1/2 [word-break:break-word] absolute font-app  left-1/2 not-italic text-[var(--color-muted)]  text-center top-0 whitespace-nowrap app-type-body" data-node-id="0:9070">
                5.
              </p>
            </div>
            <SceneAction onAction={onAction} action={{"type": "detail", "value": "办公区网络升级维护的通知..."}} className="[word-break:break-word] absolute font-app  left-[17.5px] not-italic text-[var(--color-primary)]  top-0 whitespace-nowrap app-type-body" data-node-id="0:9071">
              办公区网络升级维护的通知...
            </SceneAction>
          </div>
        </div>
      </div><div className="relative h-[225px] shrink-0 overflow-clip w-[236px]" data-node-id="0:9072" data-name="1: 基金榜单 (热涨ETF)备份">
        <div className="absolute border border-[rgba(0,0,0,0.03)] border-solid bottom-0 left-0 rounded-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] top-0 w-[236px]" data-node-id="0:9074" style={{ backgroundImage: "linear-gradient(180deg, rgba(210, 216, 255, 0.7) 0%, rgba(217, 222, 255, 0.275) 10.615%, rgba(255, 255, 255, 0.144) 18.132%, rgba(255, 255, 255, 0.05) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="1: 基金榜单 (热涨ETF)" />
        <button type="button" className="portal-notice-heading" data-node-id="0:9078" onClick={()=>onAction({type:"list",value:"最新公告"})}><span>最新公告</span><ChevronRight size={14} aria-hidden="true"/></button>
        <img className="portal-notice-icon" data-node-id="0:9086" src="/assets/ui/notice-blue.png" alt="" />
        <div className="absolute h-[22px] left-[15px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-17px_-55px] mask-size-[240px_229px] overflow-clip top-[54px] w-[187px]" data-node-id="0:9087" style={{ maskImage: `url("${imgContainer3}")` }} data-name="Item">
          <div className="-translate-y-1/2 absolute h-[22px] left-0 overflow-clip top-1/2 w-[187px]" data-node-id="0:9088" data-name="Container">
            <div className="-translate-y-1/2 absolute h-[22px] left-0 overflow-clip top-1/2 w-[21.086px]" data-node-id="0:9089" data-name="Container">
              <div className="-translate-y-1/2 absolute h-[18px] left-0 top-1/2 w-[21.086px]" data-node-id="0:9090" data-name="Container" />
              <p className="[word-break:break-word] absolute font-app  left-[calc(50%-10.54px)] not-italic text-[var(--color-brand)]  top-0 whitespace-nowrap app-type-body" data-node-id="0:9091">
                1.
              </p>
            </div>
            <SceneAction onAction={onAction} action={{"type": "detail", "value": "广新2026年度社会招聘公告"}} className="[word-break:break-word] absolute font-app  left-[17px] not-italic text-[var(--color-primary)]  top-0 whitespace-nowrap app-type-body" data-node-id="0:9092">
              广新2026年度社会招聘公告
            </SceneAction>
          </div>
        </div>
        <div className="absolute h-[22px] left-[14.5px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-16.5px_-89px] mask-size-[240px_229px] overflow-clip top-[88px] w-[224.5px]" data-node-id="0:9093" style={{ maskImage: `url("${imgContainer3}")` }} data-name="Item">
          <div className="-translate-y-1/2 absolute h-[22px] left-0 overflow-clip top-1/2 w-[224.5px]" data-node-id="0:9094" data-name="Container">
            <div className="-translate-y-1/2 absolute h-[22px] left-0 overflow-clip top-1/2 w-[13px]" data-node-id="0:9095" data-name="Container">
              <div className="-translate-y-1/2 absolute h-[18px] left-[0.5px] top-1/2 w-[12px]" data-node-id="0:9096" data-name="Container" />
              <p className="[word-break:break-word] absolute font-app  left-[calc(50%-6.5px)] not-italic text-[var(--color-warning)]  top-0 whitespace-nowrap app-type-body" data-node-id="0:9097">
                2.
              </p>
            </div>
            <SceneAction onAction={onAction} action={{"type": "detail", "value": "供应商准入审核结果的公示集团总"}} className="[word-break:break-word] absolute font-app  left-[17.5px] not-italic text-[var(--color-primary)]  top-0 whitespace-nowrap app-type-body" data-node-id="0:9098">
              供应商准入审核结果的公示集团总
            </SceneAction>
          </div>
        </div>
        <div className="absolute h-[22px] left-[14.5px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-16.5px_-123px] mask-size-[240px_229px] overflow-clip top-[122px] w-[169.5px]" data-node-id="0:9099" style={{ maskImage: `url("${imgContainer3}")` }} data-name="Item">
          <div className="-translate-y-1/2 absolute h-[22px] left-0 overflow-clip top-1/2 w-[169.5px]" data-node-id="0:9100" data-name="Container">
            <div className="-translate-y-1/2 absolute h-[22px] left-0 overflow-clip top-1/2 w-[13px]" data-node-id="0:9101" data-name="Container">
              <div className="-translate-y-1/2 absolute h-[18px] left-[0.5px] top-1/2 w-[12px]" data-node-id="0:9102" data-name="Container" />
              <p className="[word-break:break-word] absolute font-app  left-[calc(50%-6.5px)] not-italic text-[var(--color-warning)]  top-0 whitespace-nowrap app-type-body" data-node-id="0:9103">
                3.
              </p>
            </div>
            <SceneAction onAction={onAction} action={{"type": "detail", "value": "集团总部办公区搬迁安排"}} className="[word-break:break-word] absolute font-app  left-[17.5px] not-italic text-[var(--color-primary)]  top-0 whitespace-nowrap app-type-body" data-node-id="0:9104">
              集团总部办公区搬迁安排
            </SceneAction>
          </div>
        </div>
        <div className="absolute h-[22px] left-[14.5px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-16.5px_-157px] mask-size-[240px_229px] overflow-clip top-[156px] w-[229.5px]" data-node-id="0:9105" style={{ maskImage: `url("${imgContainer3}")` }} data-name="Item">
          <div className="-translate-y-1/2 absolute h-[22px] left-0 overflow-clip top-1/2 w-[229.5px]" data-node-id="0:9106" data-name="Container">
            <div className="-translate-y-1/2 absolute h-[18px] left-0 overflow-clip top-1/2 w-[13px]" data-node-id="0:9107" data-name="Container">
              <div className="-translate-y-1/2 absolute h-[18px] left-[0.5px] top-1/2 w-[12px]" data-node-id="0:9108" data-name="Container" />
              <p className="-translate-x-1/2 [word-break:break-word] absolute font-app  left-1/2 not-italic text-[var(--color-muted)]  text-center top-0 whitespace-nowrap app-type-body" data-node-id="0:9109">
                4.
              </p>
            </div>
            <SceneAction onAction={onAction} action={{"type": "detail", "value": "2026年度优秀员工评选结果的公示"}} className="[word-break:break-word] absolute font-app  left-[17.5px] not-italic text-[var(--color-primary)]  top-0 whitespace-nowrap app-type-body" data-node-id="0:9110">
              2026年度优秀员工评选结果的公示
            </SceneAction>
          </div>
        </div>
        <div className="absolute h-[22px] left-[14.5px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-16.5px_-191px] mask-size-[240px_229px] overflow-clip top-[190px] w-[210.5px]" data-node-id="0:9111" style={{ maskImage: `url("${imgContainer3}")` }} data-name="Item">
          <div className="-translate-y-1/2 absolute h-[22px] left-0 overflow-clip top-1/2 w-[210.5px]" data-node-id="0:9112" data-name="Container">
            <div className="-translate-y-1/2 absolute h-[18px] left-0 overflow-clip top-1/2 w-[13px]" data-node-id="0:9113" data-name="Container">
              <div className="-translate-y-1/2 absolute h-[18px] left-[0.5px] top-1/2 w-[12px]" data-node-id="0:9114" data-name="Container" />
              <p className="-translate-x-1/2 [word-break:break-word] absolute font-app  left-1/2 not-italic text-[var(--color-muted)]  text-center top-0 whitespace-nowrap app-type-body" data-node-id="0:9115">
                5.
              </p>
            </div>
            <SceneAction onAction={onAction} action={{"type": "detail", "value": "广智新创新研究院揭牌仪式公告"}} className="[word-break:break-word] absolute font-app  left-[17.5px] not-italic text-[var(--color-primary)]  top-0 whitespace-nowrap app-type-body" data-node-id="0:9116">
              广智新创新研究院揭牌仪式公告
            </SceneAction>
          </div>
        </div>
      </div></section>
      
      
      <div className="absolute h-[32px] left-[15px] overflow-clip top-[44px] w-[350px]" data-node-id="0:9240" data-name="编组 7">
        <div className="absolute contents inset-[6.25%_91.43%_0_0]" data-node-id="0:9241" data-name="编组 5">
          <div className="absolute contents inset-[6.25%_91.43%_0_0]" data-node-id="0:9242" data-name="编组 2">
            <div className="absolute contents inset-[6.25%_91.43%_0_0]" data-node-id="0:9243" data-name="编组 15">
              <div className="absolute inset-[6.25%_91.43%_0_0]" data-node-id="0:9244" data-name="椭圆形">
                <img alt="" className="absolute block inset-0 max-w-none size-full" height="30" src={img16} width="30" />
              </div>
            </div>
          </div>
        </div>
        <p className="-translate-x-1/2 [word-break:break-word] absolute font-app  left-[173px] not-italic text-[var(--color-primary)]  text-center top-0 whitespace-nowrap mt-[3.0px]! app-type-page" data-node-id="0:9245">
          广新门户
        </p>
        <div className="absolute contents inset-[15.63%_0_15.63%_93.71%]" data-node-id="0:9246" data-name="编组 17备份">
          <div className="absolute contents inset-[15.63%_0_15.63%_93.71%]" data-node-id="0:9247" data-name="Clipped">
            <div className="absolute inset-[18.9%_0.6%_22.18%_94.01%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1.051px_-1.047px] mask-size-[22px_22px]" data-node-id="0:9249" style={{ maskImage: `url("${img17}")` }} data-name="编组">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={img18} />
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
