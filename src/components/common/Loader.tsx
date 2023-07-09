import { selectLoading } from "@/app/features/common/commonSlice";
import { useAppSelector } from "@/app/hooks";

type Props = {};

const Loader = (props: Props) => {
  const loading = useAppSelector(selectLoading);

  return (
    <div
      className={`transition-opacity  duration-500 bg-black bg-opacity-80 fixed left-0 right-0 bottom-0 top-0 ${
        loading.isLoading ? "opacity-100 z-[99]" : "opacity-0 z-[-10]"
      }`}
    >
      <div className="flex items-center justify-center h-full w-full">
        <div className="w-full text-center">
          <div className="flex items-center justify-center">
            <div className="animate-ping rounded-full h-[30px] w-[30px] bg-red-500"></div>
            <div className="animate-ping rounded-full h-[30px] w-[30px] bg-green-500"></div>
            <div className="animate-ping rounded-full h-[30px] w-[30px] bg-blue-500"></div>
          </div>
          <h1 className="text-2xl font-extrabold mt-5 animate-pulse text-white">
            {loading.message}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Loader;
