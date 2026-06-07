"use client";

import type { CSSProperties } from "react";
import { FONT_SANS } from "../lib/typography";
import { TEXT_PRIMARY, MAIN_PRIMARY, ALPHA_WHITE_FF } from "../lib/colors";
import { RADIUS_M } from "../lib/radii";
import { ELEVATION_CARD } from "../lib/elevation";
import Avatar from "./Avatar";
import type { Person } from "../data/match";

const PHOTO_W = 200;

const timeStyle: CSSProperties = {
  fontFamily: FONT_SANS,
  fontWeight: 400,
  fontSize: 12,
  lineHeight: "16px",
  display: "block",
  width: "100%",
  textAlign: "center",
};

// The empty chat, dating-app style: a like on a photo, then a nudge to start. The
// like reads as a chat message, so the liker sees their own like outgoing on the
// RIGHT with no avatar; the other side sees it incoming on the left with the liker's
// avatar in the gutter. The start-chat divider is centered.
export default function ChatStart({ self, other }: { self: Person; other: Person }) {
  const isLiker = self.id === "me";

  return (
    <div style={{ padding: "32px 16px 8px", display: "flex", flexDirection: "column" }}>
      <span style={{ ...timeStyle, marginBottom: 16 }}>
        <span style={{ color: "#AFADAB", fontWeight: 600 }}>Today</span> <span style={{ color: "#AFADAB" }}>2:20 AM</span>
      </span>

      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, justifyContent: isLiker ? "flex-end" : "flex-start", marginBottom: 8 }}>
        {!isLiker && <Avatar name={other.name} gradient={other.gradient} photo={other.photo} size={28} />}
        <div style={{ position: "relative", width: PHOTO_W, marginBottom: 14 }}>
          <div style={{ width: PHOTO_W, aspectRatio: "220 / 250", borderRadius: RADIUS_M, backgroundImage: "url(/liked-photo.png)", backgroundSize: "cover", backgroundPosition: "center", boxShadow: ELEVATION_CARD }} />
          <div style={{ position: "absolute", bottom: -14, ...(isLiker ? { right: 0 } : { left: 0 }), background: isLiker ? MAIN_PRIMARY : "#EEEEEE", borderRadius: 8, borderBottomRightRadius: isLiker ? 0 : 8, borderBottomLeftRadius: isLiker ? 8 : 0, padding: "8px 14px" }}>
            <span style={{ fontFamily: FONT_SANS, fontStyle: "italic", fontWeight: 400, fontSize: 15, lineHeight: "20px", color: isLiker ? ALPHA_WHITE_FF : TEXT_PRIMARY, whiteSpace: "nowrap" }}>
              {isLiker ? `You liked ${other.name}'s photo` : `${other.name} liked your photo`}
            </span>
          </div>
        </div>
      </div>

      <div style={{ alignSelf: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginTop: 16 }}>
        <span style={timeStyle}>
          <span style={{ color: "#AFADAB", fontWeight: 600 }}>Today</span> <span style={{ color: "#AFADAB" }}>1:42 PM</span>
        </span>
        <div style={{ fontFamily: FONT_SANS, fontWeight: 400, fontSize: 16, lineHeight: "24px", color: TEXT_PRIMARY, background: "#EFEFEF", borderRadius: 8, padding: "6px 9px" }}>
          Start the chat with {other.name}
        </div>
      </div>
    </div>
  );
}
