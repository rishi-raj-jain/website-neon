import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { forwardRef, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

import Link from 'components/shared/link';

const Video = forwardRef(
  (
    {
      className,
      videoClassName,
      video: { icon, title: videoTitle, mp4, webm },
      title,
      description,
      linkLabel,
      linkUrl,
      isActive,
      isMobile,
      switchVideo,
    },
    videoRef
  ) => {
    const [visibilityRef, isInView] = useInView();
    const progressBarRef = useRef(null);

    const updateProgress = (video) => () => {
      const progress = progressBarRef.current;
      const percentage = (video.currentTime + 0.2) / video.duration;
      progress.style.transform = `scaleX(${percentage})`;
    };

    useEffect(() => {
      const video = videoRef?.current;

      if (!video) {
        return;
      }

      if (isMobile) {
        if (isInView) {
          video.play();
        } else {
          video.pause();
        }

        return;
      }

      if (isInView && isActive) {
        video.play();
      } else {
        video.pause();
      }

      video.addEventListener('timeupdate', updateProgress(video));
      video.addEventListener('ended', switchVideo);

      return () => {
        video.removeEventListener('timeupdate', updateProgress(video));
        video.removeEventListener('ended', switchVideo);
      };
    }, [isInView, isActive, isMobile, videoRef, switchVideo]);

    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div
        className={clsx(
          'group cursor-pointer',
          {
            'pointer-events-none cursor-default': isActive || isMobile,
          },
          className
        )}
        ref={visibilityRef}
        onClick={!isMobile && switchVideo}
      >
        <div className="relative rounded-2xl bg-[linear-gradient(180deg,#111313_51.48%,#050505_100%)] p-1.5 shadow-[-2px_0px_2px_0px_rgba(0,0,0,0.25)_inset,2px_0px_2px_0px_rgba(0,0,0,0.25)_inset,0px_2px_2px_0px_rgba(0,0,0,0.30)_inset,0px_1.4px_0px_0px_rgba(255,255,255,0.03)]">
          <div
            className={clsx(
              'relative h-[466px] overflow-hidden rounded-[10px] group-hover:after:opacity-0 2xl:h-[430px] md:h-[317px] sm:h-auto sm:after:hidden',
              'after:absolute after:inset-0 after:bg-[linear-gradient(180deg,#131515_51.48%,#050505_100%)] after:opacity-50 after:transition-opacity after:duration-300',
              {
                'after:!opacity-0': isActive,
              }
            )}
          >
            {/* 
                Video optimization parameters:
                -mp4: -pix_fmt yuv420p -vf scale=:704-2 -movflags faststart -vcodec libx264 -crf 20
                -webm: -c:v libvpx-vp9 -crf 20 -vf scale=704:-2 -deadline best -an
            */}
            <video
              className={clsx(
                'absolute left-0 top-0 h-auto min-w-[704px] transition-all duration-1000 2xl:min-w-[652px] md:min-w-[480px] sm:static sm:h-auto sm:min-w-0',
                videoClassName,
                isActive && '!left-0 lg:!left-1/2 lg:-translate-x-1/2 sm:left-0 sm:translate-x-0'
              )}
              height={466}
              width={704}
              controls={false}
              ref={videoRef}
              loop={isMobile}
              muted
              playsInline
            >
              <source src={mp4} type="video/mp4" />
              <source src={webm} type="video/webm" />
            </video>

            <div
              className={clsx(
                'absolute top-11 transition-all delay-700 duration-1000 lt:top-10 md:top-6',
                isActive ? '-left-full opacity-0' : 'left-10 opacity-100 lt:left-8 md:left-4'
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="ml-auto w-auto md:h-6 xs:h-4"
                height={32}
                width={32}
                src={icon}
                alt=""
                loading="eager"
              />
              <h2 className="font-title text-[64px] font-medium leading-none tracking-[-0.04em] text-white lt:text-[48px] md:text-[42px] xs:text-[30px]">
                {videoTitle}
              </h2>
            </div>
          </div>
        </div>
        <div className="mt-5 px-1">
          <h3 className="text-xl leading-dense tracking-tighter text-white lg:text-lg">{title}</h3>
          <div className="mt-3.5 h-px w-full overflow-hidden bg-gray-new-15 sm:hidden" aria-hidden>
            <div
              className={clsx(
                'h-full w-full origin-left scale-x-0 bg-[linear-gradient(90deg,rgba(228,229,231,0.10)_0%,#E4E5E7_100%)] opacity-0 transition-[transform,opacity] duration-[400ms] ease-linear',
                isActive && 'opacity-100'
              )}
              ref={progressBarRef}
            />
          </div>
          <p
            className={clsx(
              'mt-3.5 max-w-[366px] font-light tracking-extra-tight transition-colors duration-200 lg:text-[15px]',
              isActive
                ? 'text-gray-new-80'
                : 'text-gray-new-40 lg:min-h-[90px] sm:!min-h-0 [@media(max-width:840px)]:min-h-[112px]'
            )}
          >
            {description}
          </p>
          <Link
            className="pointer-events-auto mt-2.5 flex w-fit items-center text-sm font-medium leading-none tracking-[-0.03em] text-white"
            to={linkUrl}
            withArrow
          >
            {linkLabel}
          </Link>
        </div>
      </div>
    );
  }
);

Video.propTypes = {
  className: PropTypes.string,
  videoClassName: PropTypes.string,
  video: PropTypes.shape({
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    mp4: PropTypes.string.isRequired,
    webm: PropTypes.string.isRequired,
  }).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  linkLabel: PropTypes.string.isRequired,
  linkUrl: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
  switchVideo: PropTypes.func.isRequired,
};

export default Video;
