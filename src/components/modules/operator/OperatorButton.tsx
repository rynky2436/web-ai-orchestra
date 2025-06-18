
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface OperatorButtonProps {
  label: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  buttonColor?: string;
}

export const OperatorButton = ({ 
  label, 
  description, 
  icon: Icon, 
  onClick, 
  disabled = false,
  className = "",
  buttonColor = "bg-red-500 hover:bg-red-600"
}: OperatorButtonProps) => {
  return (
    <Card className={`bg-white/5 border-white/10 ${className}`}>
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Icon className="w-4 h-4" />
          <span>{label}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 text-sm mb-4">
          {description}
        </p>
        <Button 
          onClick={onClick}
          disabled={disabled}
          className={`w-full ${buttonColor} text-white disabled:opacity-50`}
        >
          {label}
        </Button>
      </CardContent>
    </Card>
  );
};
