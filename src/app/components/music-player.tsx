"use client";

import { useRef, useState, type CSSProperties, type ChangeEvent } from "react";

type Track = {
  title: string;
  artist: string;
  artwork: string;
  preview: string;
};

const TRACKS: Track[] = [
  {
    title: "Liar's Game",
    artist: "Jim Wolfe",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/9c/e1/31/9ce131fe-2967-d660-be2f-6060df3fd559/cover.jpg/100x100bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview122/v4/6d/2f/0f/6d2f0f90-d85c-6613-30de-7b610bc779bc/mzaf_5308783432351835983.plus.aac.p.m4a",
  },
  {
    title: "Address Unknown",
    artist: "The Ink Spots",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/d1/a7/85/d1a785df-5d04-0cb1-3f2b-c11f324945dc/634457098190.png/100x100bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/1a/35/b1/1a35b174-7abc-b0b6-77c3-d39a9965036d/mzaf_2873724531481135926.plus.aac.p.m4a",
  },
  {
    title: "Milestones",
    artist: "Shook",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/7e/cd/07/7ecd07a6-f341-a8c1-e710-d68ddebb8a61/859713522367_cover.jpg/100x100bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/0a/93/b5/0a93b56d-6458-d9c1-b6c4-d4c231d458f1/mzaf_8564349902315977354.plus.aac.p.m4a",
  },
  {
    title: "Sweet City Woman",
    artist: "Stampeders",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/9a/eb/51/9aeb5183-9dd5-784e-91be-c108cdf108f0/481.jpg/100x100bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/98/0a/1f/980a1f20-1a68-c590-15f7-f80cc1797236/mzaf_2876261314116906966.plus.aac.p.m4a",
  },
  {
    title: "Dancing In The Moonlight",
    artist: "King Harvest & MONTMARTRE",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/1a/cb/cf/1acbcfc4-9d91-0839-538b-8e0e9f98dae7/197190789966.jpg/100x100bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/e5/5a/78/e55a7889-2a86-c3f9-2227-b900f6a5509b/mzaf_9318164196702309815.plus.aac.p.m4a",
  },
  {
    title: "Funny How Time Slips Away (Single Version)",
    artist: "Billy Walker",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music/bf/0a/b8/mzi.waahccny.jpg/100x100bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/8d/6b/97/8d6b97f3-974f-7a08-efd7-17e86ce745e4/mzaf_1232004648422898475.plus.aac.p.m4a",
  },
  {
    title: "Unsquare Dance",
    artist: "The Dave Brubeck Quartet",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music/54/03/c0/mzi.ibljbmcn.jpg/100x100bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/0c/d1/2c/0cd12cca-cdb8-15f1-779d-e03394cb801c/mzaf_15202066089328635077.plus.aac.p.m4a",
  },
  {
    title: "Così fan tutte, K.588 / Act 1: \"Soave sia il vento\" - \"Non son cattivo\" - \"Che vita maledetta\" - \"Madame, ecco la vostra colazione\"",
    artist: "Karita Mattila, Neville Marriner, Academy of St Martin in the Fields, Anne Sofie von Otter, José Van Dam & Elzbieta Szmytka",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/e5/eb/97/e5eb9723-a626-6970-2765-eddc453f9863/00028948304073.rgb.jpg/100x100bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/fa/77/c2/fa77c2e9-8cfd-0ca9-faec-341e084de5ad/mzaf_1919378621509127493.plus.aac.p.m4a",
  },
  {
    title: "Season of the Witch",
    artist: "Al Kooper & Stephen Stills",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/1b/2e/e2/1b2ee207-77b1-45a5-d7b8-a08e74ebb09b/mzi.stlvpsff.jpg/100x100bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e4/89/f6/e489f628-535c-c7d4-6c73-58033f4be247/mzaf_14069998802604883464.plus.aac.p.m4a",
  },
  {
    title: "Coffee Cold",
    artist: "Galt MacDermot",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/f0/e4/b0/f0e4b090-7748-df29-1bcb-980e710474ef/660355929526.jpg/100x100bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/1a/34/7a/1a347a93-b53b-444d-f7f4-a15961832510/mzaf_11081425281860189361.plus.aac.p.m4a",
  },
  {
    title: "Listen",
    artist: "Chicago",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music/y2005/m06/d02/h07/s05.fqzmqwcj.jpg/100x100bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/6f/72/e6/6f72e641-1eda-5988-b10a-b9e07d05795c/mzaf_17257521740921290830.plus.aac.p.m4a",
  },
  {
    title: "Hold On Loosely",
    artist: "38 Special",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/81/6b/a0/816ba076-8f92-c053-005e-8a946e51273f/06UMGIM06761.rgb.jpg/100x100bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/16/63/57/1663578f-c658-9e2f-6e94-762686a3dca3/mzaf_180022970827662128.plus.aac.p.m4a",
  },
  {
    title: "Battle Hymn of the Republic (LP Version)",
    artist: "Herbie Mann",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music/y2005/m07/d22/h04/mzi.dvpjxqtg.jpg/100x100bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ce/91/de/ce91de1e-e84d-ce91-c071-7a8491a83d51/mzaf_12766225485054054115.plus.aac.p.m4a",
  },
  {
    title: "It Came Out of the Sky",
    artist: "Creedence Clearwater Revival",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/29/1b/da/291bda3c-1743-c65c-41a6-f22a88936136/14CMGIM00939.rgb.jpg/100x100bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/4b/44/a6/4b44a6d6-337b-10c8-aefd-e65c7e9eca7a/mzaf_18417907475405266495.plus.aac.p.m4a",
  },
  {
    title: "Smoke On the Water",
    artist: "Deep Purple",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/09/70/d0/0970d0fa-a46d-049b-125c-d131171fce1c/603497877393.jpg/100x100bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/2a/94/17/2a941713-19fc-1f9c-05ac-ed94771785db/mzaf_15446383104230611946.plus.aac.p.m4a",
  },
  {
    title: "Mercy, Mercy, Mercy",
    artist: "The Buckinghams",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/d8/0f/19/d80f19ec-b5a1-fad5-42b0-eb1cc1860691/mzi.rqogqesq.jpg/100x100bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/41/5a/bd/415abd09-30b3-758b-b06d-bb57783def62/mzaf_15480157648804299564.plus.aac.p.m4a",
  },
  {
    title: "Buena Vista",
    artist: "The Shiffers",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/18/c3/c6/18c3c603-9df6-fc71-d1c0-5f4a514208fa/8033237768797.png/100x100bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/b8/50/40/b85040f9-b2c0-d8d5-243c-f88f36c54dd7/mzaf_6149543130139246014.plus.aac.p.m4a",
  },
  {
    title: "All That We Perceive",
    artist: "Thievery Corporation",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/0a/90/59/0a905907-f9ef-83e3-4877-b82708ed8121/00792755853351_Cover.jpg/100x100bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/64/47/0f/64470f93-6b12-46b0-3b46-2f248800e9a9/mzaf_14154492958057532302.plus.aac.p.m4a",
  },
  {
    title: "Transatlantic",
    artist: "Quantic",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/50/ce/c8/50cec873-aef4-8e9e-d9fe-122a268daff7/5037454734347.jpg/100x100bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/78/81/53/7881530b-308e-1566-dd30-627667915741/mzaf_7728994508384442088.plus.aac.p.m4a",
  },
  {
    title: "Golddigger",
    artist: "Supreme Beings of Leisure",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/d3/51/fd/d351fd4b-6c1f-586b-d03a-e0210dbb1b8d/s03.bbvmthgg.jpg/100x100bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/76/c3/ac/76c3ac7f-892c-a869-1e4e-f7d70ff52175/mzaf_12414813773210331514.plus.aac.p.m4a",
  },
  {
    title: "Music & Wine (Speakeasy 3000 Remix)",
    artist: "Blue Six",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music/y2005/m01/d26/h12/s05.dxhxgczl.jpg/100x100bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/24/3e/63/243e6340-b5bb-dad9-4e07-b1515f35a00e/mzaf_10784302360278836862.plus.aac.p.m4a",
  },
  {
    title: "Wishing Ain't No Sin",
    artist: "Billy Momo",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/b0/79/04/b079040b-77ab-fc8c-8d05-332a5e2482fb/859713886193.jpg/100x100bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/5b/c0/0c/5bc00cf5-3975-2c97-9405-e1d296685b60/mzaf_8025298758983785432.plus.aac.p.m4a",
  },
  {
    title: "Baby Blue",
    artist: "Badfinger",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/e7/4b/9e/e74b9e46-9f9a-049c-b29a-ce4c4588efa6/05099964244051.rgb.jpg/100x100bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/07/d0/75/07d07553-9db7-ba4e-cc44-df6ae0e1a92a/mzaf_6514424155423171977.plus.aac.p.m4a",
  },
  {
    title: "Sleepwalk",
    artist: "Santo & Johnny",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music49/v4/2e/44/3b/2e443b1f-6adc-5a58-8bca-d64aac82585b/4250252616139_cover.jpg/100x100bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ba/1e/44/ba1e443b-7d9a-1337-c037-42837839f882/mzaf_1246671264495922329.plus.aac.p.m4a",
  },
  {
    title: "Escape (The Pina Colada Song) [Single Version]",
    artist: "Rupert Holmes",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/f0/60/a6/f060a64d-f437-0ced-1b32-9108d6caf0fa/21UM1IM06418.rgb.jpg/100x100bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/aa/4b/82/aa4b8244-124c-4022-2442-718845408015/mzaf_16903983618651608786.plus.aac.p.m4a",
  },
  {
    title: "Samba dans tes bras",
    artist: "Paris Bossa Nova",
    artwork:
      "https://is1-ssl.mzstatic.com/image/thumb/Music/v4/eb/94/54/eb9454cc-5ddd-9220-3105-65051cbb4d9c/616892008941.jpg/100x100bb.jpg",
    preview:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/5a/b9/36/5ab93683-5b41-6158-d7ef-6b4023dc9cef/mzaf_15516733750518713032.plus.aac.p.m4a",
  },
];

const PLAYLIST_URL =
  "https://music.apple.com/us/playlist/i-love/pl.u-06oxpqztYrEXE5b";

const hiRes = (artwork: string) => artwork.replace("100x100bb", "600x600bb");

function formatTime(seconds: number) {
  const whole = Math.max(0, Math.floor(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(30);

  const track = TRACKS[index];
  const progress = duration > 0 ? Math.min(100, (elapsed / duration) * 100) : 0;

  const playTrack = (nextIndex: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (nextIndex !== index) {
      audio.src = TRACKS[nextIndex].preview;
      setIndex(nextIndex);
      setElapsed(0);
      setDuration(30);
    } else if (!audio.getAttribute("src")) {
      audio.src = TRACKS[nextIndex].preview;
    }

    setStarted(true);
    audio.play().catch(() => setPlaying(false));
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!started) {
      playTrack(index);
    } else if (audio.paused) {
      audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  };

  const changeTrack = (delta: number) => {
    playTrack((index + delta + TRACKS.length) % TRACKS.length);
  };

  const seek = (event: ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = Number(event.currentTarget.value);
    audio.currentTime = next;
    setElapsed(next);
  };

  const onEnded = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (index < TRACKS.length - 1) {
      playTrack(index + 1);
    } else {
      audio.currentTime = 0;
      setElapsed(0);
      setPlaying(false);
    }
  };

  return (
    <div className="music-player-shell">
      <div
        className={`music-card${playing ? " is-playing" : ""}`}
        role="group"
        aria-label="I LOVE playlist preview player"
      >
        <div className="music-now">
          <div className="music-now__top">
            <div className="music-art">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={started ? hiRes(track.artwork) : "/music/i-love.jpg"}
                alt={
                  started
                    ? `${track.title} by ${track.artist}`
                    : "I LOVE playlist cover"
                }
              />
            </div>
            <div className="music-meta">
              <div className="music-meta__text">
                <p className="music-meta__title">
                  {started ? track.title : "I LOVE"}
                </p>
                <p className="music-meta__artist">
                  {started ? track.artist : "Shreyansh Singh"}
                </p>
              </div>
            </div>
          </div>

          {started ? (
            <div className="music-playback">
              <input
                className="music-seek"
                type="range"
                min={0}
                max={duration || 30}
                step={0.01}
                value={Math.min(elapsed, duration || 30)}
                onChange={seek}
                aria-label="Seek preview"
                aria-valuetext={`${formatTime(elapsed)} of ${formatTime(
                  duration
                )}`}
                style={{ "--progress": `${progress}%` } as CSSProperties}
              />
              <div className="music-times">
                <span>{formatTime(elapsed)}</span>
                <span>-{formatTime(Math.max(0, duration - elapsed))}</span>
              </div>
              <div className="music-controls">
                <button
                  type="button"
                  className="music-control music-control--prev"
                  onClick={() => changeTrack(-1)}
                  aria-label="Previous track"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/music/next.svg" alt="" width={26} height={18} />
                </button>
                <button
                  type="button"
                  className="music-control music-control--toggle music-control--primary"
                  onClick={togglePlay}
                  aria-label={playing ? "Pause" : "Play"}
                >
                  {playing ? (
                    <svg
                      width="36"
                      height="38"
                      viewBox="0 0 26 28"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M3.71429 1H9.28571C10.5238 1 11.1429 1.61905 11.1429 2.85714V25.1429C11.1429 26.381 10.5238 27 9.28571 27H3.71429C2.47619 27 1.85714 26.381 1.85714 25.1429V2.85714C1.85714 1.61905 2.47619 1 3.71429 1ZM16.7143 1H22.2857C23.5238 1 24.1429 1.61905 24.1429 2.85714V25.1429C24.1429 26.381 23.5238 27 22.2857 27H16.7143C15.4762 27 14.8571 26.381 14.8571 25.1429V2.85714C14.8571 1.61905 15.4762 1 16.7143 1Z" />
                    </svg>
                  ) : (
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M3.33333 2.33333C3.33333 1.53333 4.2 1.06667 4.86667 1.46667L14 7.13333C14.6667 7.53333 14.6667 8.46667 14 8.86667L4.86667 14.5333C4.2 14.9333 3.33333 14.4667 3.33333 13.6667V2.33333Z" />
                    </svg>
                  )}
                </button>
                <button
                  type="button"
                  className="music-control music-control--next"
                  onClick={() => changeTrack(1)}
                  aria-label="Next track"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/music/next.svg" alt="" width={26} height={18} />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="music-cta"
              onClick={() => playTrack(0)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/music/play.svg" alt="" width={16} height={16} />
              <span>Play</span>
            </button>
          )}
        </div>

        <div className="music-list">
          <div className="music-list__scroll">
            {TRACKS.map((item, i) => {
              const active = started && i === index;
              return (
                <button
                  key={item.preview}
                  type="button"
                  className={`music-row${active ? " is-active" : ""}`}
                  onClick={() => (active ? togglePlay() : playTrack(i))}
                  aria-current={active ? "true" : undefined}
                  aria-label={
                    active && playing
                      ? `Pause ${item.title} by ${item.artist}`
                      : `Play ${item.title} by ${item.artist}`
                  }
                >
                  <span className="music-row__thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.artwork}
                      alt=""
                      width={40}
                      height={40}
                      loading="lazy"
                    />
                    {active && (
                      <span className="music-eq" aria-hidden="true">
                        <span className="music-eq__bars">
                          <i />
                          <i />
                          <i />
                          <i />
                        </span>
                      </span>
                    )}
                  </span>
                  <span className="music-row__text">
                    <span className="music-row__title">{item.title}</span>
                    <span className="music-row__artist">{item.artist}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <a
            className="music-open"
            href={PLAYLIST_URL}
            target="_blank"
            rel="noreferrer"
          >
            Go to Playlist
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 9L9 3M9 3H4.5M9 3V7.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        <audio
          ref={audioRef}
          preload="none"
          onLoadedMetadata={(event) => {
            const next = event.currentTarget.duration;
            if (Number.isFinite(next)) setDuration(next);
          }}
          onTimeUpdate={(event) =>
            setElapsed(event.currentTarget.currentTime)
          }
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={onEnded}
          onError={() => setPlaying(false)}
        />
      </div>
    </div>
  );
}
