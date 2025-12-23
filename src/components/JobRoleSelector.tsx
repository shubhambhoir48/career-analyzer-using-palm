import { useState } from "react";
import { JOB_ROLES, ROLE_CATEGORY_LABELS } from "@/types/palm-analysis";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Briefcase, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface JobRoleSelectorProps {
  selectedRole: string;
  onRoleSelect: (role: string) => void;
}

export function JobRoleSelector({ selectedRole, onRoleSelect }: JobRoleSelectorProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["executive", "management"]);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const allRoles = Object.entries(JOB_ROLES).flatMap(([category, roles]) =>
    roles.map((role) => ({ ...role, category }))
  );

  const filteredRoles = searchTerm
    ? allRoles.filter(
        (role) =>
          role.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          role.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Briefcase className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-display font-semibold text-foreground">
          Select Target Role
        </h2>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search roles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Search Results */}
      {filteredRoles && (
        <Card className="p-4 mb-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">
            Search Results ({filteredRoles.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto">
            {filteredRoles.map((role) => (
              <Button
                key={role.id}
                variant={selectedRole === role.id ? "default" : "outline"}
                size="sm"
                onClick={() => onRoleSelect(role.id)}
                className={cn(
                  "justify-start gap-2 h-auto py-2 text-left",
                  selectedRole === role.id && "bg-primary text-primary-foreground"
                )}
              >
                <span className="text-lg">{role.icon}</span>
                <span className="truncate text-xs">{role.label}</span>
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Categories */}
      {!searchTerm && (
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {Object.entries(JOB_ROLES).map(([category, roles]) => (
            <Card key={category} className="overflow-hidden">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <span className="font-semibold text-foreground">
                  {ROLE_CATEGORY_LABELS[category] || category}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {roles.length} roles
                  </span>
                  {expandedCategories.includes(category) ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              {expandedCategories.includes(category) && (
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {roles.map((role) => (
                      <Button
                        key={role.id}
                        variant={selectedRole === role.id ? "default" : "ghost"}
                        size="sm"
                        onClick={() => onRoleSelect(role.id)}
                        className={cn(
                          "justify-start gap-2 h-auto py-2 text-left",
                          selectedRole === role.id && "bg-primary text-primary-foreground"
                        )}
                      >
                        <span className="text-lg">{role.icon}</span>
                        <span className="truncate text-xs">{role.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {selectedRole && (
        <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-sm text-center">
            Selected: <strong className="text-primary">{selectedRole}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
