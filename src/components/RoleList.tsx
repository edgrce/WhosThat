type Roles = {
  civilian: number;
  undercover: number;
  mrwhite: number;
};

type RoleMeta = {
  label: string;
  color: string;
  icon: string;
};

type Props = {
  roles: Roles;
  meta: Record<string, RoleMeta>;
};

export default function RoleList({ roles, meta }: Props) {
  return (
    <>
      {Object.entries(roles).map(([role, count]) => {
        const m = meta[role];
        return (
          <div
            key={role}
            className="flex items-center gap-4 mb-4 last:mb-0 rounded-lg px-4 py-3"
            style={{
              background: m.color,
              color: role === "undercover" ? "#ffe7a0" : "#22364a",
              fontWeight: 700,
              fontSize: 22,
              opacity: count > 0 ? 1 : 0.4,
            }}
          >
            <img src={m.icon} alt={m.label} className="w-9 h-9" />
            <span className="flex-1">{m.label}</span>
            <span className="text-xl font-bold">{count}</span>
          </div>
        );
      })}
    </>
  );
}