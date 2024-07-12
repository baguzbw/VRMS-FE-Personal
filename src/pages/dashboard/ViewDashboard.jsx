import { useEffect } from 'react';
import Card from '../../components/Card';
import Footer from '../../components/Footer';
import Graph from '../../components/Graph';
import Navbar from '../../components/NavBar';

export default function Dashboard() {
  useEffect(() => {
    document.title = ' Dashboard - VRMS';
  });

  return (
    <div>
      <Navbar />
      <div className="px-6 py-8">
        <Card />
        <Graph />
      </div>
      <Footer />
    </div>
  );
}
