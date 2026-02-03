import { Briefcase, Mail, MapPin } from "lucide-react";
import GlassCard from "./GlassCard";
import { useGitHub } from "./GitHubContext";
import { profile, skills } from "./aboutData";

export default function ProfileCard() {
  const { data } = useGitHub();
  const avatar = data?.avatar || profile.avatar;
  const name = data?.name || profile.name;
  const handle = data?.handle || profile.handle;
  const bio = data?.bio || profile.bio;
  const location = data?.location || profile.location;

  return (
    <GlassCard className="p-5">
      {/* Avatar */}
      <div className="flex items-center gap-3">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 bg-neutral-200/50 shadow-lg shadow-black/10">
          <img
            src={avatar}
            alt={name}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
        <div>
          <h3 className="font-sans text-lg font-semibold text-neutral-900">
            {name}
          </h3>
          <p className="font-mono text-sm text-neutral-500">
            {handle}
          </p>
        </div>
      </div>

      {/* Title + Status */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-300/30 bg-purple-500/10 px-3 py-1">
          <Briefcase size={12} className="text-purple-500" />
          <span className="text-xs font-medium text-purple-700">
            {profile.title}
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3 py-1">
          <span className="font-mono text-[10px] text-neutral-400">
            {profile.status.emoji}
          </span>
          <span className="text-xs text-neutral-600">
            {profile.status.text}
          </span>
        </div>
      </div>

      {/* Bio */}
      <p className="mt-3 text-xs leading-relaxed text-neutral-700">
        {bio}
      </p>

      {/* Location + Email */}
      <div className="mt-3 flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-neutral-500">
          <MapPin size={13} />
          <span className="text-xs">{location}</span>
        </div>
        <div className="flex items-center gap-1.5 text-neutral-500">
          <Mail size={13} />
          <span className="text-xs">{profile.email}</span>
        </div>
      </div>

      {/* Badges */}
      <div className="mt-3 flex flex-wrap gap-2">
        {profile.highlights.map((h) => (
          <span
            key={h}
            className="rounded-full border border-purple-300/30 bg-purple-500/10 px-2.5 py-0.5 font-mono text-[10px] font-medium text-purple-700"
          >
            {h}
          </span>
        ))}
      </div>

      {/* Skills */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {skills.map((item) => (
          <span
            key={item}
            className="rounded-md border border-gray-400/40 bg-white/15 px-2 py-0.5 font-mono text-[11px] text-neutral-700"
          >
            {item}
          </span>
        ))}
      </div>
    </GlassCard>
  );
}
