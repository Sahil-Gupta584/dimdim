"use client";

import { useState } from "react";
import styles from "./page.module.css";

const installCommand = "npm install -g dimdim";
const startCommand = "dimdim start --interval 1200 --fade 20";

const commands = [
  {
    command: "dimdim start",
    note: "Start the background fader with the default 20 minute interval and 20 second fade.",
  },
  {
    command: "dimdim start -i 600 -f 10",
    note: "Use a custom 10 minute interval and a 10 second screen fade.",
  },
  {
    command: "dimdim status",
    note: "Check whether the dimdim background process is currently running.",
  },
  {
    command: "dimdim stop",
    note: "Stop the fader process when you want full control back.",
  },
];

export default function Home() {
  return (
    <main className={styles.page}>
      <Header />
      <Hero />
      <Story />
    </main>
  );
}

function Header() {
  return (
    <header className={styles.header}>
      <a href="#top" className={styles.brand}>
        <LogoMark />
        <span>dimdim</span>
      </a>
      <nav className={styles.nav}>
        <a href="#story">Story</a>
        <a href="https://www.npmjs.com/package/dimdim" target="_blank" rel="noreferrer">
          npm <ArrowIcon />
        </a>
      </nav>
    </header>
  );
}

function LogoMark() {
  return (
    <span className={styles.logoMark} aria-hidden="true">
      <svg viewBox="0 0 32 32" fill="none" role="img">
        <path
          d="M6 16c2.7-4.5 6-6.8 10-6.8s7.3 2.3 10 6.8c-2.7 4.5-6 6.8-10 6.8S8.7 20.5 6 16Z"
          fill="#f4fff9"
        />
        <path
          d="M10.5 13.1c1.4-1 3.2-1.6 5.5-1.6s4.1.6 5.5 1.6"
          stroke="#8fd8bd"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
        <circle cx="16" cy="16" r="3.2" fill="#12715b" />
        <path d="M16 5v3.1M8.8 7.8l2.1 2.2M23.2 7.8 21.1 10" stroke="#c8ffe8" strokeLinecap="round" strokeWidth="2" />
      </svg>
    </span>
  );
}

function Hero() {
  return (
    <section id="top" className={styles.hero}>
      <div className={styles.heroCopy}>
        <div className={styles.pill}>
          <SparkleIcon />
          Lightweight Windows eye-strain protection
        </div>
        <h1 className={styles.title}>
          Blink more.
          <span>
            Strain less.
            <i aria-hidden="true" />
          </span>
        </h1>
        <p className={styles.lede}>
          dimdim is an npm-installed CLI that runs a tiny native Windows screen fader in the background, nudging you into regular breaks without another heavy desktop app.
        </p>
        <div className={styles.ctas}>
          <a className={styles.primaryCta} href="https://github.com/Sahil-Gupta584/dimdim.git" target="_blank" rel="noreferrer">
            <GithubIcon />
            View source
          </a>
          <a className={styles.secondaryCta} href="#story">
            Read the story
            <ArrowIcon />
          </a>
        </div>
        <dl className={styles.stats}>
          <div>
            <dt>Package</dt>
            <dd>npm CLI</dd>
          </div>
          <div>
            <dt>Runtime</dt>
            <dd>Rust native</dd>
          </div>
          <div>
            <dt>License</dt>
            <dd>MIT</dd>
          </div>
        </dl>
      </div>
      <div id="install" className={styles.panelSlot}>
        <CommandPanel />
      </div>
    </section>
  );
}

function CommandPanel() {
  return (
    <div className={styles.commandPanel}>
      <div className={styles.panelChrome}>
        <span />
        <span />
        <span />
        <strong>CLI</strong>
      </div>
      <div className={styles.panelBody}>
        <CopyableCommand command={installCommand} />
        <div className={styles.comment}># Starts with the 20-20-20 defaults</div>
        <CopyableCommand command={startCommand} />
        <div className={styles.note}>
          Runs quietly in the background, fades the screen on schedule, and registers itself to start on Windows logon.
        </div>
      </div>
    </div>
  );
}

function CopyableCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  async function copyCommand() {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className={styles.copyRow}>
      <code>{command}</code>
      <button onClick={copyCommand} title="Copy command" type="button">
        {copied ? <CheckIcon /> : <CopyIcon />}
        <span className={styles.srOnly}>Copy command</span>
      </button>
    </div>
  );
}

function Story() {
  return (
    <section id="story" className={styles.storySection}>
      <div className={styles.storyCard}>
        <div>
          <p className={styles.eyebrow}>The wake-up call</p>
          <h2>It started with one number plate I could not read.</h2>
          <div className={styles.storyText}>
            <p>
              While touching some grass, I noticed I could not clearly see vehicle number plates farther than about 10 meters away. I was spending long hours staring at screens, and that moment made the problem feel real.
            </p>
            <p>
              I knew that if I kept ignoring it, that distance would keep getting shorter. dimdim exists as a small, persistent reminder to pause, blink, and protect your eyes before strain becomes normal.
            </p>
          </div>
        </div>
        <div className={styles.commandList}>
          <div className={styles.commandListHeader}>Available commands</div>
          {commands.map((item) => (
            <div className={styles.commandItem} key={item.command}>
              <code>{item.command}</code>
              <p>{item.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 5l7 7-7 7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.4-4-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 2.9 1.3 3.6 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.2 11.2 0 0 1 6 0C17.5 4.9 18.5 5.2 18.5 5.2c.6 1.6.2 2.9.1 3.2.8.9 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1.1.9 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m20 6-11 11-5-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}
