import React, { useRef, useEffect, useState } from "react";
import "./App.css";

const videoUrls = [
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
];

function getRandomVideoUrl() {
  const randomIndex = Math.floor(Math.random() * videoUrls.length);
  return videoUrls[randomIndex];
}

interface ReelItemProps {
  index: number;
  isActive: boolean;
}

const ReelItem: React.FC<ReelItemProps> = ({ index, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl] = useState(getRandomVideoUrl());

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive]);

  return (
    <div
      data-index={index}
      className={`reel-item ${isActive ? "active" : "inactive"}`}
    >
      <video ref={videoRef} src={videoUrl} loop muted preload="auto" />
    </div>
  );
};

const Reels: React.FC = () => {
  const reelContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const options = {
      rootMargin: "-10% 0px -25% 0px", // Adjusted to trigger earlier
      threshold: 0.15, // Lower threshold to detect earlier
    };

    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const index = Number(entry.target.getAttribute("data-index"));
        if (entry.isIntersecting) {
          setActiveIndex(index);
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);
    const reelItems = reelContainerRef.current?.children;
    if (reelItems) {
      Array.from(reelItems).forEach((item) => observer.observe(item));
    }

    const container = reelContainerRef.current;

    const handleScroll = () => {
      if (container) {
        const children = Array.from(container.children);

        children.forEach((child, index) => {
          const rect = child.getBoundingClientRect();
          console.log(rect);
          if (rect.top >= 0 && rect.top <= window.innerHeight * 0.4) {
            setActiveIndex(index);
          }
        });
      }
    };

    container?.addEventListener("scroll", handleScroll);

    return () => {
      if (reelItems) {
        Array.from(reelItems).forEach((item) => observer.unobserve(item));
      }
      container?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const reels = Array.from({ length: 50 }, (_, index) => (
    <ReelItem key={index} index={index} isActive={activeIndex === index} />
  ));

  return (
    <div className="reel-container" ref={reelContainerRef}>
      {reels}
    </div>
  );
};

export default Reels;
