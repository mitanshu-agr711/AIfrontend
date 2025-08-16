

const SideBar = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-6 flex flex-col relative">
     
      <div className="absolute top-4 right-4">
       
      </div>

  
      <div className="font-bold text-3xl flex items-center justify-center mb-8">
        Profile
      </div>

     
      <nav className="flex-grow">
        <ul className="flex flex-col gap-6 text-2xl">
          <li>
            <a href="/about" className="hover:text-blue-600">Home</a>
          </li>
          <li>
            <a href="/contact" className="hover:text-blue-600">Interview</a>
          </li>
          <li>
            <a href="/services" className="hover:text-blue-600">Workspace</a>
          </li>
        </ul>
      </nav>

      <div></div>

      <div className="flex justify-center mt-8">
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md">
          Logout
        </button>
      </div>
    </div>
  );
};

export default SideBar;
