"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  FaHome, FaBox, FaUpload, FaEdit, FaCog, 
  FaSignOutAlt, FaBars, FaTimes, FaUser, 
  FaFile, FaPlus, FaShoppingCart, FaHistory,
  FaCreditCard, FaAddressCard, FaLock
} from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebaseconfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CustomerDashboard() {
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Dashboard");

  // Design Editor State
  const [designFiles, setDesignFiles] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [exportFormat, setExportFormat] = useState('png');
  const [showDesigner, setShowDesigner] = useState(false);

  // Mock order data
  const [orders, setOrders] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  // Load user data and initial content
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/Auth/Login");
      } else {
        setUser(user);
        // Load mock data
        loadMockData();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadMockData = () => {
    // Mock design files
    setDesignFiles([
      { id: 1, name: "Business Card Design", date: "2023-05-15", type: "psd" },
      { id: 2, name: "Flyer Template", date: "2023-06-02", type: "ai" },
      { id: 3, name: "Logo Concept", date: "2023-06-10", type: "png" }
    ]);

    // Mock orders
    setOrders([
      {
        id: "ORD-1001",
        date: "2023-06-15",
        status: "Completed",
        total: "$45.99",
        items: ["Business Cards (100)"]
      },
      {
        id: "ORD-1002",
        date: "2023-06-20",
        status: "Processing",
        total: "$89.50",
        items: ["Flyers (500)", "Posters (50)"]
      }
    ]);

    // Mock recent activity
    setRecentActivity([
      { type: "order", id: "ORD-1002", date: "2023-06-20", action: "Order placed" },
      { type: "upload", id: "DSN-003", date: "2023-06-10", action: "Design uploaded" },
      { type: "order", id: "ORD-1001", date: "2023-06-15", action: "Order completed" }
    ]);
  };

  // Design Editor Functions
  const loadDesign = async (file) => {
    setSelectedDesign(file.id);
    // In a real implementation, this would initialize the Customers Canvas editor
    toast.info(`Loading design: ${file.name}`);
  };

  const uploadNewDesign = async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*,.psd,.ai,.pdf';
      
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        toast.info(`Uploading ${file.name}...`);
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Add to design files
        const newDesign = {
          id: Math.max(0, ...designFiles.map(d => d.id)) + 1,
          name: file.name,
          date: new Date().toISOString().split('T')[0],
          type: file.name.split('.').pop()
        };
        
        setDesignFiles([newDesign, ...designFiles]);
        setRecentActivity([
          { 
            type: "upload", 
            id: `DSN-${newDesign.id}`, 
            date: newDesign.date, 
            action: "Design uploaded" 
          },
          ...recentActivity
        ]);
        
        toast.success(`${file.name} uploaded successfully!`);
      };
      
      input.click();
    } catch (error) {
      toast.error("Error uploading design");
      console.error(error);
    }
  };

  const createNewOrder = () => {
    toast.info("Redirecting to order creation...");
    // In a real implementation, this would navigate to order creation
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      router.push("/Auth/Login");
    } catch (error) {
      toast.error("Error signing out");
      console.error("Logout error:", error);
    }
  };

  // Tab components
  const tabs = {
    Dashboard: (
      <div className="space-y-6">
        <div className="bg-gray-800 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, <span className="text-yellow-400">{user?.displayName || "Customer"}</span>
          </h1>
          <p className="text-gray-300 mb-6">
            Quick overview of your print projects and account
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center">
                <div className="bg-yellow-400 bg-opacity-20 p-3 rounded-full mr-3">
                  <FaBox className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Active Orders</p>
                  <p className="text-xl font-bold text-white">
                    {orders.filter(o => o.status === "Processing").length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center">
                <div className="bg-yellow-400 bg-opacity-20 p-3 rounded-full mr-3">
                  <FaUpload className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Designs</p>
                  <p className="text-xl font-bold text-white">{designFiles.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center">
                <div className="bg-yellow-400 bg-opacity-20 p-3 rounded-full mr-3">
                  <FaUser className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Member Since</p>
                  <p className="text-sm font-medium text-white">
                    {user?.metadata?.creationTime 
                      ? new Date(user.metadata.creationTime).toLocaleDateString() 
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Recent Activity</h2>
            <button className="text-sm text-yellow-400 hover:underline">View All</button>
          </div>
          
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div 
                  key={index} 
                  className="bg-black bg-opacity-30 rounded-lg p-3 border border-gray-700 flex items-center"
                >
                  <div className="bg-yellow-400 bg-opacity-20 p-2 rounded-full mr-3">
                    {activity.type === "order" ? (
                      <FaShoppingCart className="text-yellow-400 text-sm" />
                    ) : (
                      <FaFile className="text-yellow-400 text-sm" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-400">
                      {activity.id} • {activity.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-black bg-opacity-30 rounded-lg p-4 text-center border border-gray-700">
              <p className="text-gray-400 py-6">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    ),

    "My Orders": (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Your Orders</h1>
          <button 
            onClick={createNewOrder}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-medium transition flex items-center"
          >
            <FaPlus className="mr-2" /> New Order
          </button>
        </div>

        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-black bg-opacity-30">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Order #</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Items</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-700 cursor-pointer">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">{order.id}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{order.date}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        order.status === "Completed" 
                          ? "bg-green-500 bg-opacity-20 text-green-400" 
                          : "bg-yellow-500 bg-opacity-20 text-yellow-400"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-300">
                      {order.items.join(", ")}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">{order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-black bg-opacity-30 rounded-lg p-8 text-center border border-gray-700">
            <FaBox className="mx-auto text-4xl text-gray-500 mb-3" />
            <h3 className="text-lg font-medium text-gray-300 mb-1">No orders yet</h3>
            <p className="text-gray-400 mb-4">Get started by placing your first order</p>
            <button 
              onClick={createNewOrder}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-medium"
            >
              Create New Order
            </button>
          </div>
        )}
      </div>
    ),

    "Upload Design": (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-6">Upload Design</h1>

        <div 
          className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-yellow-400 transition cursor-pointer"
          onClick={uploadNewDesign}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="bg-yellow-400 bg-opacity-20 p-4 rounded-full">
              <FaUpload className="text-2xl text-yellow-400" />
            </div>
            <p className="text-gray-300">Drag and drop your design files here</p>
            <p className="text-sm text-gray-400">Supports: JPG, PNG, PDF, AI, PSD</p>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-medium transition">
              Browse Files
            </button>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Recent Uploads</h3>
          {designFiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {designFiles.map(file => (
                <div 
                  key={file.id} 
                  className="bg-black bg-opacity-30 p-4 rounded-lg border border-gray-700 hover:border-yellow-400 transition cursor-pointer"
                  onClick={() => loadDesign(file)}
                >
                  <div className="flex items-center">
                    <div className="bg-yellow-400 bg-opacity-20 p-3 rounded-full mr-3">
                      <FaFile className="text-yellow-400" />
                    </div>
                    <div>
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-xs text-gray-400">{file.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-black bg-opacity-30 rounded-lg p-4 text-center border border-gray-700">
              <p className="text-gray-400 py-4">No recent uploads</p>
            </div>
          )}
        </div>
      </div>
    ),

    "Edit Design": (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Design Editor</h1>
          <button
            onClick={() => setShowDesigner(!showDesigner)}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-medium transition flex items-center"
          >
            <FaEdit className="mr-2" /> {showDesigner ? "Close Editor" : "Open Editor"}
          </button>
        </div>

        {showDesigner ? (
          <>
            <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
              <div className="absolute top-0 left-0 w-full h-full bg-gray-900 rounded-lg border border-gray-700 flex items-center justify-center">
                <p className="text-gray-400">
                  {selectedDesign 
                    ? `Editing: ${designFiles.find(d => d.id === selectedDesign)?.name || "Design"}`
                    : "Select a design to edit"}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-black bg-opacity-30 p-4 rounded-lg border border-gray-700">
                <h3 className="font-medium mb-3">Design Files</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {designFiles.map(file => (
                    <div
                      key={file.id}
                      className={`p-2 rounded-md cursor-pointer ${
                        selectedDesign === file.id 
                          ? 'bg-yellow-400 text-black' 
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                      onClick={() => loadDesign(file)}
                    >
                      <div className="flex items-center">
                        <FaFile className="mr-2" />
                        <span className="truncate">{file.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={uploadNewDesign}
                  className="mt-3 w-full bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm"
                >
                  Upload New
                </button>
              </div>

              <div className="bg-black bg-opacity-30 p-4 rounded-lg border border-gray-700">
                <h3 className="font-medium mb-3">Editor Tools</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm">
                    Undo
                  </button>
                  <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm">
                    Redo
                  </button>
                  <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm">
                    Add Text
                  </button>
                  <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm">
                    Add Image
                  </button>
                </div>
              </div>

              <div className="bg-black bg-opacity-30 p-4 rounded-lg border border-gray-700">
                <h3 className="font-medium mb-3">Save & Export</h3>
                <div className="space-y-3">
                  <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-2 rounded-md text-sm font-medium">
                    Save Design
                  </button>
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md text-sm p-2"
                  >
                    <option value="png">PNG</option>
                    <option value="jpg">JPG</option>
                    <option value="pdf">PDF</option>
                  </select>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm">
                    Export
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-black bg-opacity-30 rounded-lg p-8 text-center border border-gray-700">
            <FaEdit className="mx-auto text-4xl text-gray-500 mb-3" />
            <h3 className="text-lg font-medium text-gray-300 mb-1">Editor is closed</h3>
            <p className="text-gray-400 mb-4">Open the editor to modify your designs</p>
            <button
              onClick={() => setShowDesigner(true)}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-medium"
            >
              Open Editor
            </button>
          </div>
        )}
      </div>
    ),

    Settings: (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="border-b border-gray-700 pb-6">
              <h2 className="text-lg font-medium mb-4">Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-yellow-400 focus:border-yellow-400"
                    defaultValue={user?.displayName?.split(' ')[0] || ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-yellow-400 focus:border-yellow-400"
                    defaultValue={user?.displayName?.split(' ')[1] || ''}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-400"
                    defaultValue={user?.email || ''}
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="border-b border-gray-700 pb-6">
              <h2 className="text-lg font-medium mb-4">Security</h2>
              <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-md text-sm font-medium transition flex items-center">
                <FaLock className="mr-2" /> Change Password
              </button>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-4">Payment Methods</h2>
              <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaCreditCard className="text-xl mr-3 text-gray-400" />
                    <div>
                      <p className="font-medium">Visa •••• 4242</p>
                      <p className="text-xs text-gray-400">Expires 04/2025</p>
                    </div>
                  </div>
                  <button className="text-sm text-yellow-400 hover:text-yellow-300">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-black bg-opacity-30 p-4 rounded-lg border border-gray-700">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-yellow-400 bg-opacity-20 flex items-center justify-center">
                  <FaUser className="text-xl text-yellow-400" />
                </div>
                <button className="text-sm text-yellow-400 hover:text-yellow-300 font-medium">
                  Update Photo
                </button>
              </div>
            </div>

            <div className="bg-black bg-opacity-30 p-4 rounded-lg border border-gray-700">
              <h3 className="font-medium mb-3">Shipping Address</h3>
              <div className="flex items-center">
                <FaAddressCard className="text-xl mr-3 text-gray-400" />
                <div>
                  <p className="text-sm">123 Main St, Apt 4B</p>
                  <p className="text-sm">New York, NY 10001</p>
                </div>
              </div>
              <button className="mt-3 w-full text-sm text-yellow-400 hover:text-yellow-300">
                Edit Address
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Navigation Bar */}
      <nav className="bg-black text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="lg:hidden mr-4 text-white focus:outline-none"
              >
                {mobileNavOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
              <h1 className="text-xl font-bold">
                <span className="text-yellow-400">59Minutes</span>Print
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center text-sm hover:text-yellow-400 transition"
              >
                <FaSignOutAlt className="mr-1" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Side Navigation */}
          <aside className={`
            fixed inset-y-0 left-0 z-40 
            w-64 bg-gray-800 shadow-lg 
            transform transition-transform duration-300 ease-in-out rounded
            ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'} 
            lg:relative lg:translate-x-0 lg:w-64
            mt-16 lg:mt-0
          `}>
            {/* Close button for mobile */}
            <div className="lg:hidden absolute top-2 right-2">
              <button
                onClick={() => setMobileNavOpen(false)}
                className="p-2 text-gray-400 hover:text-white focus:outline-none"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* User Profile */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-400 bg-opacity-20 p-2 rounded-full">
                  <FaUser className="text-yellow-400" />
                </div>
                <div className="overflow-hidden">
                  <p className="font-medium text-white truncate">{user?.displayName || 'Customer'}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="p-2 h-[calc(100%-72px-4rem)] overflow-y-auto">
              {Object.keys(tabs).map((tabName) => (
                <button
                  key={tabName}
                  onClick={() => {
                    setActiveTab(tabName);
                    setMobileNavOpen(false);
                  }}
                  className={`
                    w-full flex items-center px-4 py-3 text-sm rounded-md mb-1 
                    transition-all duration-200
                    ${activeTab === tabName
                      ? 'bg-yellow-400 text-black font-bold shadow-md'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                  `}
                >
                  <span className="mr-3 text-base">
                    {tabName === "Dashboard" && <FaHome />}
                    {tabName === "My Orders" && <FaBox />}
                    {tabName === "Upload Design" && <FaUpload />}
                    {tabName === "Edit Design" && <FaEdit />}
                    {tabName === "Settings" && <FaCog />}
                  </span>
                  <span className="text-left">{tabName}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            <div className="mb-4 flex lg:hidden items-center">
              {mobileNavOpen && (
                <button
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center text-sm text-yellow-400 mr-4"
                >
                  <FaTimes className="mr-1" /> Close Menu
                </button>
              )}
              <h2 className="text-xl font-bold text-white">{activeTab}</h2>
            </div>

            {tabs[activeTab]}
          </main>
        </div>
      </div>
    </div>
  );
}