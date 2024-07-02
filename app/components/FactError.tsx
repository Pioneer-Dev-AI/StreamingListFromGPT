import ManOnRocket from "~/assets/ManOnRocket.svg";

const FactError = ({ error }: { error: string | null }) => {
  return (
    <div className="flex items-center justify-center relative">
      <img
        src={ManOnRocket}
        alt="Man_on_Rocket"
        className="mix-blend-hard-light h-[350px] w-[250px] animate-rocket-down"
      />
      <h1 className="bottom-10 absolute font-bold text-lg text-red-500">
        {error}
      </h1>
    </div>
  );
};

export default FactError;
