"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getActiveAnnouncement } from "@/lib/data";

export default function AnnouncementBar() {
  const [announcement, setAnnouncement] = useState<{ message: string; link_url: string | null } | null>(null);

  useEffect(() => {
    async function fetchAnnouncement() {
      const data = await getActiveAnnouncement();
      if (data) setAnnouncement(data);
    }
    fetchAnnouncement();
  }, []);

  if (!announcement) {
    return (
      <div className="w-full bg-[#3b2e27] text-[#e8d5c4] py-2 px-4 text-center text-xs tracking-[0.1em] font-medium uppercase relative z-50">
        <span>✦ THE FESTIVE COLLECTION IS NOW LIVE</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-primary text-primary-foreground py-2 px-4 text-center text-xs tracking-[0.1em] font-medium uppercase relative z-50">
      {announcement.link_url ? (
        <Link href={announcement.link_url} className="hover:opacity-80 transition-opacity">
          {announcement.message}
        </Link>
      ) : (
        <span>{announcement.message}</span>
      )}
    </div>
  );
}
