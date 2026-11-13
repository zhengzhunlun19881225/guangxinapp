import {SceneAction, type SceneProps} from "../components/SceneAction";
const imgGradient = "/assets/figma/2c527a70-9733-4cdd-a1ef-e166736d937c.svg";
const imgBattery = "/assets/figma/7d140957-b2b4-4742-9c55-c223866af32e.svg";
const imgWifi = "/assets/figma/bc3524cd-3eba-4c27-bff7-ffbaf6a783c7.svg";
const imgCellularConnection = "/assets/figma/1ae8cb31-c47d-4552-b8bc-72a28ca1178c.svg";
const img1 = "/assets/figma/bec0e0ed-6262-4051-96c4-7745c8d712cb.svg";
const img2 = "/assets/figma/4975c3af-1030-412b-8626-f5f9c1e8ee47.svg";
const img3 = "/assets/figma/1a9aca5b-6fd8-4285-a09f-7a08eb379b85.svg";
const img7 = "/assets/figma/5cad9283-d040-411a-bc47-2a46c9ea83be.svg";
const imgHot = "/assets/figma/618aca00-79ee-4227-b899-7bd955751484.svg";
const img4 = "/assets/figma/cdfeb7a0-e2e9-40c0-8c27-7630ed0135ba.svg";
const img5 = "/assets/figma/144ec0b5-c335-41f8-88da-3135e7a5cb97.svg";
const imgIcon = "/assets/figma/3fda4b10-52a9-47ac-baf2-2db737cc2733.svg";
const img6 = "/assets/figma/32f98a8a-c341-41f9-8097-1a0db8aab0f9.svg";
const img8 = "/assets/figma/10712fbe-4556-4931-a96c-c1b6332e7e56.svg";

export default function SkillsScene({onAction}: SceneProps) {
  return (
    <div className="bg-white relative size-full" data-node-id="0:5372" data-name="技能">
      <div className="absolute contents left-[15.5px] top-[16.5px]" data-node-id="0:5377" data-name="导航:30/状态栏StatusBar/黑色字备份 2">
        <div className="absolute h-[15px] left-[15.5px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-51.5px_-28.5px] mask-size-[447px_922px] overflow-clip top-[16.5px] w-[344.828px]" data-node-id="0:5378" style={{ maskImage: `url("${imgGradient}")` }}>
          <div className="absolute h-[15px] left-0 overflow-clip right-0 top-0" data-node-id="0:5379" data-name="iPhone X/Status Bars/Status Bar (Black)">
            <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[15px] left-1/2 overflow-clip top-1/2 w-[344.828px]" data-node-id="0:5380" data-name="iPhone X/Status Bars/Status Bar (Black)">
              <div className="absolute h-[11.333px] right-0 top-[0.83px] w-[24.328px]" data-node-id="0:5381" data-name="Battery">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBattery} />
              </div>
              <div className="absolute inset-[5.54%_8.51%_21.36%_87.06%]" data-node-id="0:5387" data-name="Wifi">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgWifi} />
              </div>
              <div className="absolute inset-[7.78%_14.4%_21.11%_80.67%]" data-node-id="0:5391" data-name="Cellular Connection">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCellularConnection} />
              </div>
              <div className="absolute h-[15px] left-0 overflow-clip top-0 w-[40px]" data-node-id="0:5394" data-name="Time Style">
                <p className="[word-break:break-word] absolute font-app leading-[0] left-0 not-italic text-[15px] text-[var(--color-primary)] top-[calc(50%-7.5px)] tracking-[-0.3px] whitespace-nowrap" data-node-id="0:5395">
                  <span className="app-inherit-leading">19:4</span>
                  <span className="app-inherit-leading">1</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      
      <div className="absolute contents left-[15px] top-[56px]" data-node-id="0:5529" data-name="编组 4">
        <div className="absolute h-[15px] left-[15px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-51px_-68px] mask-size-[447px_922px] top-[56px] w-[7px]" data-node-id="0:5530" style={{ maskImage: `url("${imgGradient}")` }} data-name="编组">
          <div className="absolute inset-[-6.4%_-13.71%]">
            <img alt="" className="block max-w-none size-full" src={img8} />
          </div>
        </div>
      </div>
      
      
    </div>
  );
}
