"use client";

import React, { useState, useRef } from "react";

export const POINTS_DATA = [
  {
    lead: "Think like a designer",
    tail: "",
  },
  {
    lead: "Build like an engineer.",
    tail: "",
  },
  {
    lead: "Lead like a founder.",
    tail: "",
  },
];

export const InteractivePoints: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(-1);
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);
  const textRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const openRow = (i: number) => {
    const row = rowRefs.current[i];
    const text = textRefs.current[i];
    if (row && text) {
      row.style.height = `${text.offsetHeight}px`;
    }
    setActiveIdx(i);
  };

  const closeRow = (i: number) => {
    const row = rowRefs.current[i];
    if (row) {
      row.style.height = "";
    }
    setActiveIdx((prev) => (prev === i ? -1 : prev));
  };

  return (
    <ul className="points">
      {POINTS_DATA.map((item, i) => (
        <li
          key={item.lead}
          ref={(el) => {
            rowRefs.current[i] = el;
          }}
          className="points__row"
          data-open={activeIdx === i ? "" : undefined}
          data-dim={activeIdx !== -1 && activeIdx !== i ? "" : undefined}
          tabIndex={0}
          onMouseEnter={() => openRow(i)}
          onMouseLeave={() => closeRow(i)}
          onFocus={() => openRow(i)}
          onBlur={() => closeRow(i)}
        >
          <span
            className="points__text"
            ref={(el) => {
              textRefs.current[i] = el;
            }}
          >
            <span className="points__lead">{item.lead}</span>
            {item.tail ? <span className="points__tail"> {item.tail}</span> : null}
          </span>
        </li>
      ))}
    </ul>
  );
};
