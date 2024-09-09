import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "../assets/logo.png";
import { useStateContext } from "../context";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { address } = useStateContext();
  const [isOpen, setIsOpen] = useState(false);

  const switchNavbar = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { label: "Home", to: "/", id: 1 },
    { label: "All Properties", to: "/allproperties", id: 2 },
    { label: "My Properties", to: `/myproperties/${address}`, id: 3 },
    { label: "Transactions", to: `/transactions`, id: 4 },

  ];

  return (
    <nav className="sticky top-0 z-50 py-3 border-b border-neutral-600/70">
      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-shrink-0">
            <img className="h-20 w-20" src={logo} alt="Logo" />
            <span className="text-xl tracking-tight">PropChain</span>
          </div>
          <ul className="hidden lg:flex ml-14 space-x-12">
            {navItems.map((item, index) => (
              <Link key={item.id} to={item.to}>
                <li className={window.location.pathname === item.to ? "text-sky-300" : ""}>
                  {item.label}
                </li>
              </Link>
            ))}
          </ul>
          <div className="hidden lg:flex justify-center space-x-12 items-center">
            <w3m-button className="text-lg bg-gradient-to-r from-purple-300 to-purple-900 hover:scale-110 py-2 px-3 rounded-md" />
          </div>
          <div className="lg:hidden md:flex flex-col justify-end">
            <button onClick={switchNavbar}>
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="fixed right-0 z-10 bg-neutral-900 w-full p-10 flex flex-col justify-center items-center lg:hidden">
            <ul>
              {navItems.map((item) => (
                <Link key={item.id} to={item.to}>
                  <li className={window.location.pathname === item.to ? "text-sky-300" : ""}>
                    {item.label}
                  </li>
                </Link>
              ))}
              <li>
                <w3m-button className="text-lg bg-gradient-to-r from-purple-300 to-purple-900 hover:scale-110 py-2 px-3 rounded-md" />
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
