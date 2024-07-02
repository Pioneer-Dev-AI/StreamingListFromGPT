import ManOnRocket from "~/assets/ManOnRocket.svg";

const FactLoading = () => {
  return (
    <div className="flex items-center justify-center relative">
      <img
        src={ManOnRocket}
        alt="Man_on_Rocket"
        className="mix-blend-hard-light h-[350px] w-[250px]  animate-rocket-go"
      />
      <h1 className="bottom-10 absolute font-bold text-lg">
        Launching into fact-finding mission...
      </h1>
    </div>
  );
};

export default FactLoading;
