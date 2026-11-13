import {SceneAction, type SceneProps} from "../components/SceneAction";
const img = "/assets/figma/8556753c-959a-4d17-8799-0e7fd28400b4.png";
const img1 = "/assets/figma/90ac7634-b6b4-400d-ab97-7258ca0301ca.png";
const img9 = "/assets/figma/7ef76e1f-c7b6-44ce-a610-0ced85a31483.png";
const imgTopHeaderSection = "/assets/figma/64f8dc81-fe3c-4f5f-b718-8559991b2306.svg";
const imgBattery = "/assets/figma/6573aa0b-76ef-4088-ba88-4f83d8feb4be.svg";
const imgWifi = "/assets/figma/96583421-512e-4b03-9dd7-7e67e32fe71d.svg";
const imgCellularConnection = "/assets/figma/8be9fc34-4fe1-43fc-bfed-555b9ca2ddf7.svg";
const imgFrame = "/assets/figma/4c596416-5e9d-4a48-b6ab-befe890109e7.svg";
const img2 = "/assets/figma/b9fadcbf-a716-479d-9dec-279cead65b1b.svg";
const imgRow = "/assets/figma/128baefe-54c7-44b1-8d3a-676b1e45797b.svg";
const imgFill = "/assets/figma/9f1f1bee-6825-442e-af89-503517163cb5.svg";
const imgRow1 = "/assets/figma/1594662e-5e32-4e22-acd4-9460e7571b57.svg";
const imgFrame1 = "/assets/figma/7bca5c95-ed5f-470d-99d7-59043abc7d24.svg";
const img10 = "/assets/figma/445475f3-9977-4d01-a5ca-649d23cb272a.svg";
const img11 = "/assets/figma/5fe6da51-e4cc-4310-8ed8-650dc6256c68.svg";

export default function WorkbenchScene({onAction}: SceneProps) {
  return (
    <div className="bg-[#f5f5f5] relative size-full" data-node-id="0:6655" data-name="工作台">
      <div className="absolute h-[1451px] left-0 overflow-clip top-0 w-[375px]" data-node-id="0:6656" data-name="背景">
        <div className="-translate-y-1/2 absolute bg-[#f7f8fa] h-[1451px] left-0 shadow-[0px_0px_34px_0px_rgba(0,0,0,0.12)] top-1/2 w-[375px]" data-node-id="0:6658" data-name="PhoneShellContainer" />
        <div className="absolute h-[1451px] left-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-34px_-33.817px] mask-size-[443px_1519px] overflow-clip top-[-0.18px] w-[375.238px]" data-node-id="0:6659" style={{ maskImage: `url("${imgTopHeaderSection}")` }} data-name="TopHeaderSection">
          <div className="absolute h-[249.038px] left-0 top-[0.18px] w-[375px]" data-node-id="0:6660" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 375 249.04' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(38.942 0 0 25.911 318.75 24.904)'><stop stop-color='rgba(255,216,214,1)' offset='0'/><stop stop-color='rgba(255,233,231,1)' offset='0.35'/><stop stop-color='rgba(252,247,246,1)' offset='0.7'/><stop stop-color='rgba(247,248,250,1)' offset='1'/></radialGradient></defs></svg>\")" }} data-name="TopHeaderSection" />
          <div className="absolute flex inset-[0.03%_0_85.43%_0] items-center justify-center" data-node-id="0:6661" style={{ containerType: "size" }}>
            <div className="-scale-x-100 flex-none h-[100cqh] w-[100cqw]">
              <div className="opacity-40 relative size-full" data-name="位图">
                <img alt="" className="absolute inset-0 max-w-none object-bottom pointer-events-none size-full" src={img} />
              </div>
            </div>
          </div>
          <div className="-translate-y-1/2 absolute h-[1451px] left-0 overflow-clip top-1/2 w-[375px]" data-node-id="0:6662" data-name="背景">
            <div className="-translate-y-1/2 absolute bg-[#f7f8fa] h-[1451px] left-0 shadow-[0px_0px_34px_0px_rgba(0,0,0,0.12)] top-1/2 w-[375px]" data-node-id="0:6664" data-name="PhoneShellContainer" />
            <div className="absolute h-[249.038px] left-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-34px_-34px] mask-size-[443px_1519px] overflow-clip top-0 w-[375.238px]" data-node-id="0:6665" style={{ maskImage: `url("${imgTopHeaderSection}")` }} data-name="TopHeaderSection">
              <div className="absolute h-[249.038px] left-0 top-0 w-[375px]" data-node-id="0:6666" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 375 249.04' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(38.942 0 0 25.911 318.75 24.904)'><stop stop-color='rgba(255,210,208,1)' offset='0'/><stop stop-color='rgba(255,233,231,1)' offset='0.35'/><stop stop-color='rgba(252,247,246,1)' offset='0.7'/><stop stop-color='rgba(247,248,250,1)' offset='1'/></radialGradient></defs></svg>\")" }} data-name="TopHeaderSection" />
              <div className="absolute flex inset-[0.07%_0_15.2%_0] items-center justify-center" data-node-id="0:6667" style={{ containerType: "size" }}>
                <div className="-scale-x-100 flex-none h-[100cqh] w-[100cqw]">
                  <div className="opacity-40 relative size-full" data-name="位图">
                    <img alt="" className="absolute inset-0 max-w-none object-bottom pointer-events-none size-full" src={img} />
                  </div>
                </div>
              </div>
              <div className="absolute contents inset-[6.7%_3.97%_87.28%_4.13%]" data-node-id="0:6668" data-name="导航:30/状态栏StatusBar/黑色字备份 2">
                <div className="absolute inset-[6.7%_3.97%_87.28%_4.13%] overflow-clip" data-node-id="0:6669">
                  <div className="absolute h-[15px] left-0 overflow-clip right-0 top-0" data-node-id="0:6670" data-name="iPhone X/Status Bars/Status Bar (Black)">
                    <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[15px] left-1/2 overflow-clip top-1/2 w-[344.828px]" data-node-id="0:6671" data-name="iPhone X/Status Bars/Status Bar (Black)">
                      <div className="absolute h-[11.333px] right-0 top-[0.83px] w-[24.328px]" data-node-id="0:6672" data-name="Battery">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBattery} />
                      </div>
                      <div className="absolute inset-[5.54%_8.51%_21.36%_87.06%]" data-node-id="0:6678" data-name="Wifi">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgWifi} />
                      </div>
                      <div className="absolute inset-[7.78%_14.4%_21.11%_80.67%]" data-node-id="0:6682" data-name="Cellular Connection">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCellularConnection} />
                      </div>
                      <div className="absolute h-[15px] left-0 overflow-clip top-0 w-[40px]" data-node-id="0:6685" data-name="Time Style">
                        <p className="[word-break:break-word] absolute font-app leading-[0] left-0 not-italic text-[15px] text-[var(--color-primary)] top-[calc(50%-7.5px)] tracking-[-0.3px] whitespace-nowrap" data-node-id="0:6686">
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
          <div className="absolute contents inset-[1.16%_3.97%_97.8%_4.13%]" data-node-id="0:6687" data-name="导航:30/状态栏StatusBar/黑色字备份 2">
            <div className="absolute inset-[1.16%_3.97%_97.8%_4.13%] overflow-clip" data-node-id="0:6688">
              <div className="absolute h-[15px] left-0 overflow-clip right-0 top-0" data-node-id="0:6689" data-name="iPhone X/Status Bars/Status Bar (Black)">
                <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[15px] left-1/2 overflow-clip top-1/2 w-[344.828px]" data-node-id="0:6690" data-name="iPhone X/Status Bars/Status Bar (Black)">
                  <div className="absolute h-[11.333px] right-0 top-[0.83px] w-[24.328px]" data-node-id="0:6691" data-name="Battery">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBattery} />
                  </div>
                  <div className="absolute inset-[5.54%_8.51%_21.36%_87.06%]" data-node-id="0:6697" data-name="Wifi">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgWifi} />
                  </div>
                  <div className="absolute inset-[7.78%_14.4%_21.11%_80.67%]" data-node-id="0:6701" data-name="Cellular Connection">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCellularConnection} />
                  </div>
                  <div className="absolute h-[15px] left-0 overflow-clip top-0 w-[40px]" data-node-id="0:6704" data-name="Time Style">
                    <p className="[word-break:break-word] absolute font-app leading-[0] left-0 not-italic text-[15px] text-[var(--color-primary)] top-[calc(50%-7.5px)] tracking-[-0.3px] whitespace-nowrap" data-node-id="0:6705">
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
      <div className="absolute contents left-[10px] top-[97px]" data-node-id="0:6706" data-name="编组 38备份">
        <div className="absolute h-[86px] left-[10px] overflow-clip top-[97px] w-[361px]" data-node-id="0:6707" data-name="编组 37">
          <div className="absolute inset-[0_76.18%_0_0]" data-node-id="0:6708" data-name="位图">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute left-0 max-w-none size-full top-0" src={img1} />
            </div>
          </div>
          <div className="absolute h-[55.135px] left-[90px] overflow-clip top-[11.86px] w-[271px]" data-node-id="0:6709" data-name="col备份 4">
            <div className="[word-break:break-word] absolute font-app h-[55.135px] left-0 not-italic overflow-clip top-0 w-[271px]" data-node-id="0:6710" data-name="row">
              <p className="absolute  left-0 text-[var(--color-primary)]  top-0 whitespace-nowrap mt-[7.0px]! app-type-page" data-node-id="0:6711">
                早上好，张嘉嘉
              </p>
              <p className="absolute  left-[calc(50%-135.5px)] text-[var(--color-secondary)]  top-[calc(50%+12.57px)] w-[271px] app-type-function" data-node-id="0:6712">
                AI为您提效赋能，聚焦关键事务与战略推进！
              </p>
            </div>
          </div>
        </div>
      </div>














    </div>
  );
}
