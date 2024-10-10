const Loader = ({ initial = false }) => {
  return (
    <div
      className={`${
        initial ? "w-screen h-screen" : "w-full h-full mt-32"
      } flex justify-center items-center`}
    >
      <div className="w-6 spinner"></div>
    </div>
  );
};

export default Loader;
