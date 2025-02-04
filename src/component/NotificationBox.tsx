import React, { useEffect } from 'react';
import { Card, CardContent } from "@/component/ui/card"
import { Bell, X } from 'lucide-react'
import Image from "next/image"; 
interface NotificationProps {
  bandName: string;
  profileImage: string;
  message: string;
  onClose: () => void;
}

export function NotificationBox({ bandName, profileImage, message, onClose }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <Card className="w-80 bg-white shadow-lg border-blue-500 border-2 mb-4">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
         <Image
              className="h-12 w-12 rounded-full object-cover"
              src={profileImage}
              alt={bandName}
              width={50} 
              height={30}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-blue-600 truncate">
              {bandName}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {message}
            </p>
          </div>
          <div className="flex-shrink-0 flex items-center">
            <Bell className="h-5 w-5 text-blue-500 mr-2" />
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

