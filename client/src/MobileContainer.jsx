function MobileContainer({ children }) {
  return (
    <div
      className="w-[550px] h-screen bg-deep shadow-2xl mx-auto flex flex-col overflow-hidden "
      style={{
        minWidth: "400px",
        maxWidth: "600px",
        height: "100vh",
        minHeight: "100vh",
        maxHeight: "100vh",
        borderRadius: "0px",
      }}
    >
      {children}
    </div>
  );
}
export default MobileContainer;
