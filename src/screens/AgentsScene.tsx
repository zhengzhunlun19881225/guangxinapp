import {SceneAction, type SceneProps} from "../components/SceneAction";
const imgGradient = "/assets/figma/2b50f122-57a2-4772-a8a3-83a432c46e6e.svg";
const imgBattery = "/assets/figma/cea82b38-94de-40f6-8c9f-0c73f7b2f381.svg";
const imgWifi = "/assets/figma/41f3a522-d31d-4c6c-aeef-3b978c058b5f.svg";
const imgCellularConnection = "/assets/figma/3939e404-b088-4328-ad04-20cc3f11043d.svg";
const img1 = "/assets/figma/9efe077b-a070-404a-9dcb-faf8a72a3ae4.svg";
const img2 = "/assets/figma/a11197e7-9fb0-41ed-963e-ac6273c03445.svg";
const img3 = "/assets/figma/d9108484-1984-41d2-a19b-d3938a68b3f7.svg";
const img7 = "/assets/figma/4695fbe2-cbad-4c37-b5db-b4c45fb9a5c8.svg";
const imgHot = "/assets/figma/f577bd64-1a34-477b-8215-2a5174e17980.svg";
const img4 = "/assets/figma/b1f53ff9-b4a0-4c30-ab23-ef2262055466.svg";
const img5 = "/assets/figma/d4502d96-67da-4f0b-92f8-fe7e1a812bc5.svg";
const imgIcon = "/assets/figma/93a55a3f-b6bb-49e4-a761-abefa87cf0e3.svg";
const img6 = "/assets/figma/5cd0f093-bb78-4f0d-8b1f-c805588e52d0.svg";
const img8 = "/assets/figma/c84274fa-0ad0-4f67-aec6-ac4942c022a1.svg";

export default function AgentsScene({onAction}: SceneProps) {
  return (
    <div className="bg-white relative size-full" data-node-id="0:5540" data-name="智能体">
      <div className="absolute contents left-[15.5px] top-[16.5px]" data-node-id="0:5545" data-name="导航:30/状态栏StatusBar/黑色字备份 2">
        <div className="absolute h-[15px] left-[15.5px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-51.5px_-28.5px] mask-size-[447px_922px] overflow-clip top-[16.5px] w-[344.828px]" data-node-id="0:5546" style={{ maskImage: `url("${imgGradient}")` }}>
          <div className="absolute h-[15px] left-0 overflow-clip right-0 top-0" data-node-id="0:5547" data-name="iPhone X/Status Bars/Status Bar (Black)">
            <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[15px] left-1/2 overflow-clip top-1/2 w-[344.828px]" data-node-id="0:5548" data-name="iPhone X/Status Bars/Status Bar (Black)">
              <div className="absolute h-[11.333px] right-0 top-[0.83px] w-[24.328px]" data-node-id="0:5549" data-name="Battery">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBattery} />
              </div>
              <div className="absolute inset-[5.54%_8.51%_21.36%_87.06%]" data-node-id="0:5555" data-name="Wifi">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgWifi} />
              </div>
              <div className="absolute inset-[7.78%_14.4%_21.11%_80.67%]" data-node-id="0:5559" data-name="Cellular Connection">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCellularConnection} />
              </div>
              <div className="absolute h-[15px] left-0 overflow-clip top-0 w-[40px]" data-node-id="0:5562" data-name="Time Style">
                <p className="[word-break:break-word] absolute font-app leading-[0] left-0 not-italic text-[15px] text-[var(--color-primary)] top-[calc(50%-7.5px)] tracking-[-0.3px] whitespace-nowrap" data-node-id="0:5563">
                  <span className="app-inherit-leading">19:4</span>
                  <span className="app-inherit-leading">1</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      
      <div className="absolute contents left-[15px] top-[56px]" data-node-id="0:5697" data-name="编组 4">
        <div className="absolute h-[15px] left-[15px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-51px_-68px] mask-size-[447px_922px] top-[56px] w-[7px]" data-node-id="0:5698" style={{ maskImage: `url("${imgGradient}")` }} data-name="编组">
          <div className="absolute inset-[-6.4%_-13.71%]">
            <img alt="" className="block max-w-none size-full" src={img8} />
          </div>
        </div>
      </div>
      
      
    </div>
  );
}
