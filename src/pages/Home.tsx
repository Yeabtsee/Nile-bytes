import { Hero } from '../components/Hero';
import { Services } from '../components/Services';
import { Portfolio } from '../components/Portfolio';
import { Team } from '../components/Team';
import { Contact } from '../components/Contact';

export function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Portfolio />
      <Team />
      <Contact />
    </>
  );
}
