

const sideBar=()=>{
    return(
        <> 
        <div className=" bg-gray-800 text-white p-4 h-full w-2/12 gap-5 flex flex-col">
        <h3>Interview Ai</h3>
        <h2>Tools</h2>
        <ul className="flex flex-col gap-5">
            <li><a href="/about">Interview</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/services">Services</a></li>
        </ul>


        </div>
        </>
    )
}
export default sideBar;