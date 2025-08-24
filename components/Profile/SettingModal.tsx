import React, { useState } from "react";
import { X, Bell, Shield, Download, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/entities/User";

export default function SettingsModal({ user, onClose, onUserUpdate }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await User.logout();
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const settingsItems = [
    { icon: Bell, label: "Notifications", action: () => console.log("Notifications") },
    { icon: Shield, label: "Privacy Settings", action: () => console.log("Privacy") },
    { icon: Download, label: "Download Data", action: () => console.log("Download") }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
      <div className="w-full bg-white rounded-t-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mb-8">
          {settingsItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 rounded-2xl transition-colors"
            >
              <item.icon className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900 font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        <Button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full h-12 rounded-2xl bg-red-500 hover:bg-red-600 text-white flex items-center justify-center"
        >
          <LogOut className="w-5 h-5 mr-2" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </div>
  );
}