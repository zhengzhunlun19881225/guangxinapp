const img = "https://www.figma.com/api/mcp/asset/0efe2a10-d77a-47ce-89ab-3fd9872a9d3e.png";
const img1 = "https://www.figma.com/api/mcp/asset/cb5bf7d8-a1d8-41a7-a4ae-30d8368a4bdd.svg";
const img2 = "https://www.figma.com/api/mcp/asset/5e3dd7bf-7a6f-475e-8519-8c8664dbc686.svg";

export default function Component7() {
  return (
    <div className="relative size-full" data-node-id="0:8606" data-name="编组 7">
      <div className="absolute contents inset-[6.25%_91.43%_0_0]" data-node-id="0:8607" data-name="编组 5">
        <div className="absolute contents inset-[6.25%_91.43%_0_0]" data-node-id="0:8608" data-name="编组 2">
          <div className="absolute contents inset-[6.25%_91.43%_0_0]" data-node-id="0:8609" data-name="编组 15">
            <div className="absolute inset-[6.25%_91.43%_0_0]" data-node-id="0:8610" data-name="椭圆形">
              <img alt="" className="absolute block inset-0 max-w-none size-full" height="30" src={img} width="30" />
            </div>
          </div>
        </div>
      </div>
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Alibaba_PuHuiTi:Regular'] leading-[32px] left-[173px] not-italic text-[#03091b] text-[18px] text-center top-0 whitespace-nowrap" data-node-id="0:8611">
        广新门户
      </p>
      <div className="absolute contents inset-[15.63%_0_15.63%_93.71%]" data-node-id="0:8612" data-name="编组 17备份">
        <div className="absolute contents inset-[15.63%_0_15.63%_93.71%]" data-node-id="0:8613" data-name="Clipped">
          <div className="absolute inset-[18.9%_0.6%_22.18%_94.01%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1.051px_-1.047px] mask-size-[22px_22px]" data-node-id="0:8615" style={{ maskImage: `url("${img1}")` }} data-name="编组">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={img2} />
          </div>
        </div>
      </div>
    </div>
  );
}
