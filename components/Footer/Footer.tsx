"use client";

import React, { useState } from "react";
import Image from "next/image";
import "./footer.css";

export const Footer = () => {
  const [hasCopied, setHasCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("iamsahidofficial99@gmail.com");
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2200);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const navLinks = [
    { label: "GitHub", href: "https://github.com/sahidDev09" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/sahidofficial09" },
    { label: "Instagram", href: "https://www.instagram.com/0sahid_99" },
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#experience" },
    { label: "About", href: "#about" },
  ];

  return (
    <footer id="contact" className="brud-footer">
      {/* Background Plate Image with website purple hue shift */}
      <div className="brud-footer__plate" aria-hidden="true">
        <Image
          src="/images/footer_bg_image.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="brud-footer__image"
        />
      </div>

      {/* Top Gradient Fade */}
      <div className="brud-footer__fade" aria-hidden="true" />

      {/* Center CTA Block */}
      <div className="brud-footer__cta">
        <h2 className="brud-footer__title">Your ideas. My code.</h2>

        <div className="brud-footer__actions">
          <a href="mailto:iamsahidofficial99@gmail.com" className="brud-btn-solid">
            Start a project
          </a>

          <button
            type="button"
            className="brud-copypill"
            data-copied={hasCopied ? "" : undefined}
            onClick={handleCopy}
            aria-label="Copy email address">
            <span className="brud-copypill__faces" aria-hidden="true">
              {/* Code icon */}
              <span className="brud-copypill__face" title="Developer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </span>
              {/* AI / Sparkle icon */}
              <span className="brud-copypill__face" title="AI Engineer">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.6l1.8 6.1L20 10.5l-6.2 1.8L12 18.4l-1.8-6.1L4 10.5l6.2-1.8z" />
                </svg>
              </span>
              {/* Design / Target icon */}
              <span className="brud-copypill__face" title="UI/UX Designer">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="11" r="6.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="12" cy="11" r="2.2" />
                </svg>
              </span>
            </span>

            <span className="brud-copypill__label">
              {hasCopied ? "Email copied to clipboard!" : "Copy email address"}
            </span>

            <svg className="brud-copypill__copy" viewBox="0 0 24 24" aria-hidden="true">
              {hasCopied ? (
                <polyline
                  points="20 6 9 17 4 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <>
                  <rect
                    x="9"
                    y="9"
                    width="11"
                    height="11"
                    rx="2.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <path
                    d="M15 5.5A2.5 2.5 0 0 0 12.5 3h-7A2.5 2.5 0 0 0 3 5.5v7A2.5 2.5 0 0 0 5.5 15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Middle Links & Credits Bar */}
      <div className="brud-footer__bar">
        <ul className="brud-footer__links">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                className="brud-footer__link"
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <p className="brud-footer__legal">Available for full-time roles &amp; high-impact projects.</p>
      </div>

      {/* Bottom Exact Wordmark Banner: SAHID [S Logo] AHMED */}
      <div className="brud-footer__wordmark">
        <span className="brud-footer__word">
          <span className="sr-only">Sahid Ahmed</span>
          <span aria-hidden="true">Sahid</span>
          <Image
            src="/sahid_nav.png"
            alt="Sahid Logo"
            width={160}
            height={160}
            className="brud-footer__glyph"
          />
          <span aria-hidden="true">Ahmed</span>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
