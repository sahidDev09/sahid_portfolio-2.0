"use client";

import React, { useEffect, useState, useId } from "react";
import { motion } from "framer-motion";

interface SignatureProps {
  className?: string;
  play?: boolean;
}

const D_S = "M 115 287 L 109 284 L 103 283 L 97 282 L 91 282 L 85 283 L 79 285 L 73 288 L 67 293 L 62 299 L 61 305 L 64 311 L 70 314 L 76 317 L 82 318 L 88 320 L 94 322 L 100 323 L 106 324 L 112 325 L 118 325 L 124 326 L 130 326 L 136 326 L 142 325 L 148 324 L 153 319 L 154 313 L 151 307 L 146 301 L 141 295 L 135 289 L 129 283 L 123 277 L 117 272 L 111 266 L 105 261 L 99 255 L 93 250 L 87 245 L 81 239 L 75 234 L 69 228 L 63 223 L 57 217 L 51 211 L 45 206 L 40 200 L 34 194 L 30 188 L 26 182 L 22 176 L 20 170 L 18 164 L 17 158 L 17 152 L 18 146 L 19 140 L 22 134 L 25 128 L 30 122 L 36 116 L 42 110 L 48 105 L 54 101 L 60 97 L 66 94 L 72 90 L 78 87 L 84 85 L 90 82 L 96 80 L 102 78 L 108 76 L 114 74 L 120 72 L 126 70 L 132 69 L 138 67 L 144 66 L 150 64 L 156 63 L 162 62 L 168 61 L 174 60 L 180 59 L 186 58 L 192 57 L 198 56 L 204 55 L 210 54 L 216 54 L 222 53 L 228 52 L 234 52 L 240 51 L 246 51 L 252 51 L 258 50 L 264 50 L 270 50 L 276 49 L 282 49 L 288 49 L 294 49 L 300 49 L 306 49 L 312 49 L 318 50 L 324 50 L 330 50 L 336 51 L 342 52 L 348 52 L 354 53 L 360 54 L 366 55 L 372 56 L 378 58 L 384 59 L 390 61 L 396 63 L 402 65 L 408 68 L 414 73 L 419 79 L 420 81";
const D_MAIN = "M 149 258 L 155 260 L 161 259 L 167 255 L 173 252 L 179 252 L 181 258 L 187 260 L 193 258 L 199 252 L 205 246 L 210 240 L 214 234 L 219 228 L 224 222 L 228 216 L 233 210 L 237 204 L 242 198 L 247 192 L 252 186 L 258 181 L 264 180 L 263 186 L 260 192 L 258 198 L 255 204 L 252 210 L 249 216 L 246 222 L 243 228 L 241 234 L 240 240 L 246 239 L 252 236 L 258 232 L 264 231 L 267 237 L 265 243 L 265 249 L 265 255 L 271 255 L 277 254 L 283 252 L 287 255 L 287 261 L 293 263 L 299 261 L 305 258 L 311 256 L 316 253 L 321 247 L 327 243 L 333 243 L 339 242 L 345 242 L 351 239 L 357 236 L 361 230 L 367 232 L 373 231 L 379 229 L 385 228 L 391 227 L 397 225 L 403 224 L 409 223 L 415 222 L 421 221 L 427 220 L 433 219 L 439 219 L 445 218 L 451 217 L 457 217 L 463 216 L 469 215 L 475 215 L 481 214 L 487 214 L 493 214 L 499 213 L 505 213 L 511 213 L 517 212 L 523 212 L 529 212 L 535 212 L 541 212 L 547 211 L 553 211 L 559 213 L 565 211 L 571 210 L 577 210 L 583 210 L 589 210 L 595 211 L 601 209 L 607 210 L 613 210 L 619 210 L 625 210 L 627 215 L 625 221 L 622 227 L 620 233 L 618 239 L 623 239 L 629 237 L 635 232 L 641 231 L 645 236 L 644 242 L 643 248 L 643 254 L 648 256 L 654 255 L 660 255 L 666 254 L 672 252 L 678 250 L 684 246 L 690 244 L 695 245 L 697 250 L 703 248 L 709 245 L 715 242 L 721 240 L 721 246 L 720 252 L 720 258 L 726 259 L 732 257 L 738 254 L 744 254 L 745 260 L 751 263 L 757 264 L 763 264 L 769 262 L 775 259 L 781 257 L 785 259 L 789 264 L 795 263 L 801 260 L 807 254 L 812 248 L 818 243 L 824 237 L 828 232 L 831 226 L 834 220 L 837 214 L 840 208 L 843 202 L 846 196 L 848 190 L 852 184 L 855 178 L 858 172 L 859 171";
const D_ASC = "M 570 206 L 573 200 L 577 194 L 581 188 L 585 182 L 590 176 L 594 170 L 598 164 L 602 158 L 606 152 L 610 146 L 614 140 L 618 134 L 622 128 L 626 122 L 629 116 L 633 110 L 638 105 L 644 103 L 647 97 L 651 91 L 654 85 L 657 79 L 660 73 L 663 67 L 666 61 L 670 55 L 673 49 L 676 43 L 679 37 L 682 31 L 686 25 L 689 19 L 689 19 L 686 25 L 682 31 L 679 37 L 676 43 L 673 49 L 670 55 L 666 61 L 663 67 L 660 73 L 657 79 L 654 85 L 651 91 L 647 97 L 644 103 L 645 109 L 644 115 L 641 121 L 638 127 L 636 133 L 633 139 L 630 145 L 627 151 L 625 157 L 622 163 L 619 169 L 616 175 L 614 181 L 611 187 L 608 193 L 605 199 L 604 205 L 606 210 L 612 210 L 618 210 L 624 210 L 627 214 L 625 220 L 622 226 L 620 232 L 619 238 L 622 240 L 628 237 L 634 233 L 640 231 L 645 235 L 644 241 L 643 247 L 643 253 L 647 256 L 653 255 L 659 255 L 665 254 L 671 253 L 677 251 L 683 247 L 689 244 L 695 244 L 696 250 L 700 249";
const D_FLOURISH = "M 277 296 L 277 302 L 278 308 L 281 314 L 285 320 L 291 326 L 297 331 L 303 335 L 309 339 L 315 342 L 321 344 L 327 346 L 333 348 L 339 350 L 345 351 L 351 352 L 357 352 L 363 353 L 369 353 L 375 353 L 381 352 L 387 351 L 393 351 L 399 349 L 405 348 L 411 346 L 417 344 L 423 341 L 429 338 L 435 335 L 441 332 L 447 328 L 453 324 L 459 320 L 465 316 L 471 311 L 477 306 L 483 301 L 489 296 L 495 291 L 501 285 L 507 279 L 513 273 L 519 267 L 524 261";
const D_OUTLINE = "M 688 13 L 694 13 L 695 17 L 620 176 L 608 206 L 610 208 L 626 208 L 645 168 L 651 167 L 652 170 L 650 176 L 636 206 L 637 208 L 773 211 L 776 212 L 777 215 L 634 213 L 622 235 L 624 236 L 638 227 L 645 227 L 649 231 L 650 236 L 647 252 L 652 253 L 664 247 L 670 234 L 674 231 L 678 234 L 673 246 L 674 249 L 695 237 L 702 238 L 702 246 L 720 235 L 727 234 L 729 239 L 724 255 L 728 256 L 740 248 L 750 238 L 759 234 L 769 233 L 775 237 L 775 242 L 770 248 L 764 251 L 750 251 L 748 253 L 748 257 L 752 261 L 766 261 L 777 255 L 794 235 L 807 230 L 819 231 L 823 227 L 854 170 L 860 167 L 863 168 L 862 174 L 847 205 L 828 253 L 828 256 L 832 257 L 847 245 L 852 245 L 848 253 L 836 262 L 824 263 L 821 261 L 819 255 L 821 249 L 820 246 L 804 262 L 795 267 L 786 267 L 780 260 L 763 267 L 750 267 L 743 264 L 739 256 L 727 263 L 716 263 L 714 260 L 718 245 L 716 244 L 690 264 L 684 264 L 682 262 L 690 248 L 688 247 L 665 265 L 658 267 L 656 265 L 659 258 L 658 256 L 648 260 L 641 260 L 638 257 L 638 249 L 641 238 L 638 234 L 617 253 L 607 266 L 602 267 L 600 264 L 624 214 L 605 213 L 602 216 L 589 246 L 576 282 L 572 299 L 572 307 L 576 315 L 569 316 L 564 310 L 565 290 L 579 248 L 593 217 L 591 213 L 572 213 L 563 220 L 523 269 L 497 295 L 478 311 L 451 330 L 425 344 L 408 350 L 383 355 L 351 355 L 338 353 L 313 345 L 291 332 L 278 318 L 274 310 L 272 300 L 275 283 L 287 267 L 283 263 L 282 255 L 270 260 L 261 259 L 260 248 L 263 237 L 261 234 L 252 240 L 228 267 L 224 267 L 222 265 L 260 184 L 259 182 L 245 198 L 207 249 L 196 260 L 184 264 L 180 263 L 174 255 L 165 262 L 156 265 L 149 265 L 144 262 L 143 255 L 150 243 L 162 232 L 178 225 L 187 227 L 189 231 L 188 235 L 184 236 L 178 232 L 172 235 L 158 248 L 154 256 L 158 257 L 177 241 L 182 239 L 186 240 L 187 242 L 184 255 L 188 257 L 194 253 L 208 238 L 250 184 L 269 167 L 274 168 L 273 173 L 244 235 L 246 236 L 261 227 L 268 228 L 271 232 L 271 242 L 269 247 L 270 253 L 283 249 L 288 245 L 293 237 L 298 237 L 299 239 L 291 256 L 292 259 L 297 259 L 311 251 L 325 235 L 333 231 L 350 231 L 354 227 L 385 170 L 390 167 L 394 168 L 394 171 L 372 219 L 369 227 L 370 229 L 404 221 L 446 215 L 561 208 L 612 136 L 687 14 Z M 258 47 L 320 47 L 376 54 L 411 66 L 423 76 L 424 83 L 422 85 L 418 85 L 410 74 L 393 65 L 356 55 L 321 52 L 256 53 L 190 60 L 136 71 L 90 86 L 53 106 L 32 126 L 23 142 L 22 161 L 28 177 L 35 188 L 56 211 L 111 260 L 152 300 L 160 315 L 156 324 L 140 329 L 118 329 L 91 325 L 70 319 L 59 313 L 55 308 L 56 298 L 65 289 L 76 283 L 87 280 L 103 280 L 111 282 L 118 288 L 114 290 L 109 287 L 96 284 L 77 290 L 65 301 L 65 306 L 72 312 L 90 318 L 122 323 L 145 322 L 149 319 L 150 314 L 140 300 L 104 265 L 47 214 L 22 185 L 15 171 L 12 159 L 12 148 L 16 134 L 24 122 L 44 103 L 79 83 L 105 73 L 140 63 L 186 54 L 228 49 L 257 48 Z M 641 110 L 640 108 L 639 109 L 595 177 L 574 206 L 575 208 L 594 208 L 598 205 L 641 111 Z M 304 215 L 309 215 L 310 217 L 305 227 L 298 229 L 298 225 L 303 216 Z M 554 215 L 497 216 L 415 225 L 366 236 L 360 249 L 360 257 L 363 257 L 378 245 L 383 245 L 383 247 L 378 254 L 364 263 L 355 263 L 352 261 L 350 255 L 352 249 L 351 246 L 335 262 L 326 267 L 315 266 L 311 258 L 290 275 L 282 290 L 282 305 L 287 316 L 292 322 L 301 330 L 320 341 L 333 346 L 352 350 L 383 350 L 414 342 L 443 327 L 481 299 L 522 258 L 555 216 Z M 344 236 L 338 235 L 332 238 L 330 240 L 333 241 L 343 237 Z M 813 236 L 807 235 L 801 238 L 793 246 L 790 252 L 790 261 L 792 262 L 797 259 L 812 243 L 815 239 L 814 237 Z M 765 239 L 764 238 L 757 241 L 754 245 L 757 247 L 762 246 L 765 244 L 766 240 Z M 339 247 L 340 246 L 338 245 L 322 252 L 320 259 L 323 262 L 328 259 L 338 248 Z";
const DOT = {"cx": 303, "cy": 222, "r": 14};

export const Signature: React.FC<SignatureProps> = ({
  className = "",
  play = true,
}) => {
  const [key, setKey] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const rawId = useId();
  const safeId = rawId.replace(/[^a-zA-Z0-9_-]/g, "");
  const maskId = `sig-mask-${safeId}-${key}`;
  const gradId = `sig-grad-${safeId}`;

  useEffect(() => {
    if (!play) {
      return;
    }
    const timer = setTimeout(() => {
      setIsCompleted(true);
    }, 2700);
    return () => clearTimeout(timer);
  }, [key, play]);

  const handleReplay = () => {
    if (!play) return;
    setIsCompleted(false);
    setKey((prev) => prev + 1);
  };

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      <div
        className="relative cursor-pointer transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] -rotate-[20deg] origin-center"
        onClick={handleReplay}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleReplay();
          }
        }}
      >
        <svg
          viewBox="0 0 876 369"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-28 sm:w-36 md:w-44 lg:w-48 h-auto overflow-visible"
          aria-label="Sahid Ahmed Signature"
        >
          <defs>
            {/* Off-white ink with a faint warm falloff */}
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#d6d6d6ba" />
              <stop offset="100%" stopColor="#d6d6d6ba" />
            </linearGradient>

            {/* Handwriting stroke mask: reveals signature ink in real pen order */}
            <mask id={maskId}>
              <rect width="876" height="369" fill="black" />

              {/* Stroke 1: Capital 'S' loop and curve */}
              <motion.path
                key={`s-${key}`}
                d={D_S}
                fill="none"
                stroke="white"
                strokeWidth={58}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: play ? 1 : 0 }}
                transition={{
                  duration: 0.5,
                  ease: [0.37, 0, 0.63, 1],
                  delay: 0.1,
                }}
              />

              {/* Stroke 2: Connected cursive name 'ahid Ahmed' */}
              <motion.path
                key={`main-${key}`}
                d={D_MAIN}
                fill="none"
                stroke="white"
                strokeWidth={58}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: play ? 1 : 0 }}
                transition={{
                  duration: 1.0,
                  ease: [0.3, 0, 0.7, 1],
                  delay: 0.65,
                }}
              />

              {/* Stroke 3: Ascender loop */}
              <motion.path
                key={`asc-${key}`}
                d={D_ASC}
                fill="none"
                stroke="white"
                strokeWidth={58}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: play ? 1 : 0 }}
                transition={{
                  duration: 0.35,
                  ease: [0.37, 0, 0.63, 1],
                  delay: 1.7,
                }}
              />

              {/* Stroke 4: Dynamic underline flourish swoosh */}
              <motion.path
                key={`flourish-${key}`}
                d={D_FLOURISH}
                fill="none"
                stroke="white"
                strokeWidth={58}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: play ? 1 : 0 }}
                transition={{
                  duration: 0.35,
                  ease: [0.5, 0, 0.2, 1],
                  delay: 2.25,
                }}
              />

              {/* Stroke 5: Dot on 'i' */}
              <motion.circle
                key={`dot-${key}`}
                cx={DOT.cx}
                cy={DOT.cy}
                r={DOT.r * 2.2}
                fill="white"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: play ? 1 : 0, opacity: play ? 1 : 0 }}
                transition={{
                  duration: 0.1,
                  ease: "easeOut",
                  delay: 2.1,
                }}
              />
            </mask>
          </defs>

          {/* Primary Vector Signature Masked by Handwriting Strokes */}
          <g
            mask={isCompleted ? undefined : `url(#${maskId})`}
            opacity={play ? 1 : 0}
            className="transition-opacity duration-300"
          >
            <path
              d={D_OUTLINE}
              fill={`url(#${gradId})`}
              fillRule="evenodd"
              className="transition-all duration-300"
            />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Signature;
