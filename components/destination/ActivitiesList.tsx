import React from "react";
import { CheckCircle } from "lucide-react";

interface ActivitiesListProps {
  activities: string[];
}

export default function ActivitiesList({ activities }: ActivitiesListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          <span className="text-gray-800">{activity}</span>
        </div>
      ))}
    </div>
  );
}