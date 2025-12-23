import { JOB_ROLES } from "@/types/palm-analysis";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface JobRoleSelectorProps {
  selectedRole: string;
  onRoleSelect: (role: string) => void;
}

export function JobRoleSelector({ selectedRole, onRoleSelect }: JobRoleSelectorProps) {
  return (
    <div className="space-y-6">
      {/* Corporate Roles */}
      <div>
        <h3 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">
            💼
          </span>
          Corporate Roles
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {JOB_ROLES.corporate.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              isSelected={selectedRole === role.id}
              onClick={() => onRoleSelect(role.id)}
            />
          ))}
        </div>
      </div>

      {/* Industry-Specific Roles */}
      <div>
        <h3 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-mystic/10 flex items-center justify-center text-sm">
            🏢
          </span>
          Industry-Specific Roles
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {JOB_ROLES.industrySpecific.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              isSelected={selectedRole === role.id}
              onClick={() => onRoleSelect(role.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface RoleCardProps {
  role: { id: string; label: string; icon: string };
  isSelected: boolean;
  onClick: () => void;
}

function RoleCard({ role, isSelected, onClick }: RoleCardProps) {
  return (
    <Card
      className={cn(
        "p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02]",
        isSelected
          ? "border-2 border-primary bg-primary/5 shadow-lg glow-mystic"
          : "border border-border hover:border-primary/50 hover:bg-muted/50"
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{role.icon}</span>
        <span className={cn(
          "text-sm font-medium",
          isSelected ? "text-primary" : "text-foreground"
        )}>
          {role.label}
        </span>
      </div>
    </Card>
  );
}
