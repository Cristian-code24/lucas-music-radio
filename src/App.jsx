import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import RadioInfo from './components/RadioInfo/RadioInfo';
import SocialLinks from './components/SocialLinks/SocialLinks';
import Footer from './components/Footer/Footer';
import useAudioPlayer from './hooks/useAudioPlayer';
import useAudioVisualizer from './hooks/useAudioVisualizer';
import './App.css';

export default function App() {
  const {
    status,
    volume,
    isMuted,
    errorMessage,
    corsSupported,
    getAudio,
    togglePlay,
    setVolume,
    toggleMute,
  } = useAudioPlayer();

  const audioElement = getAudio();

  const {
    getFrequencyData,
    useFallback,
  } = useAudioVisualizer(corsSupported ? audioElement : null, status);

  return (
    <div className="app">
      <Header
        status={status}
        onTogglePlay={togglePlay}
      />

      <main className="app__main">
        <Hero
          status={status}
          volume={volume}
          isMuted={isMuted}
          errorMessage={errorMessage}
          onTogglePlay={togglePlay}
          onVolumeChange={setVolume}
          onToggleMute={toggleMute}
          getFrequencyData={getFrequencyData}
          useFallback={useFallback}
        />

        <section className="app__info-section" id="info">
          <RadioInfo />
          <SocialLinks />
        </section>
      </main>

      <Footer />
    </div>
  );
}
