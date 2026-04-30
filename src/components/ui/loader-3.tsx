import { cn } from "@/lib/utils";

export const Loader3 = () => {
  const boxes = Array.from({ length: 8 }, (_, i) => i);
  
  return (
    <div className="loader-container h-full w-full flex items-center justify-center min-h-[400px]">
      <div className="loader">
        {boxes.map((i) => (
          <div key={i} className={`box box${i}`}>
            <div className="face front"></div>
            <div className="face back"></div>
            <div className="face left"></div>
            <div className="face right"></div>
            <div className="face top"></div>
            <div className="face bottom"></div>
          </div>
        ))}
        <div className="ground">
          <div></div>
        </div>
      </div>
    </div>
  );
};
