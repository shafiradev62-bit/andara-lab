import { Switch, Route } from "wouter";
import Navbar from "@/components/Navbar";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Footer";
import NewsletterSection from "@/components/NewsletterSection";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import DataHubPage from "@/pages/DataHubPage";
import AdminPage from "@/pages/AdminPage";
import {
  MacroOutlooksPage,
  PolicyMonetaryPage,
  GeopoliticalPage,
  DeepDivesPage,
  RegionalPage,
  ESGPage,
  BlogPage,
} from "@/pages/SectionPage";

function SiteHeader() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <MarketTicker />
      <Navbar />
    </div>
  );
}

function Layout({ children, withNewsletter = true }: { children: React.ReactNode; withNewsletter?: boolean }) {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <SiteHeader />
      {/* pt = ticker(2rem) + navbar(3.5rem) = 5.5rem */}
      <main className="pt-[5.5rem]">{children}</main>
      {withNewsletter && <NewsletterSection />}
      <Footer />
    </div>
  );
}

function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}

export default function App() {
  return (
    <Switch>
      <Route path="/admin">
        <AdminLayout>
          <AdminPage />
        </AdminLayout>
      </Route>
      <Route>
        <Switch>
          <Route path="/contact">
            <Layout withNewsletter={false}>
              <ContactPage />
            </Layout>
          </Route>
          <Route path="/">
            <Layout>
              <HomePage />
            </Layout>
          </Route>
          <Route path="/about">
            <Layout>
              <AboutPage />
            </Layout>
          </Route>

          <Route path="/macro/macro-outlooks">
            <Layout><MacroOutlooksPage /></Layout>
          </Route>
          <Route path="/macro/policy-monetary">
            <Layout><PolicyMonetaryPage /></Layout>
          </Route>
          <Route path="/macro/geopolitical">
            <Layout><GeopoliticalPage /></Layout>
          </Route>

          <Route path="/sectoral/deep-dives">
            <Layout><DeepDivesPage /></Layout>
          </Route>
          <Route path="/sectoral/regional">
            <Layout><RegionalPage /></Layout>
          </Route>
          <Route path="/sectoral/esg">
            <Layout><ESGPage /></Layout>
          </Route>

          <Route path="/data">
            <Layout withNewsletter={false}><DataHubPage /></Layout>
          </Route>
          <Route path="/data/economic-calendar">
            <Layout withNewsletter={false}><DataHubPage /></Layout>
          </Route>
          <Route path="/data/market-dashboard">
            <Layout withNewsletter={false}><DataHubPage /></Layout>
          </Route>

          <Route path="/blog/economics-101">
            <Layout><BlogPage sub="economics-101" /></Layout>
          </Route>
          <Route path="/blog/market-pulse">
            <Layout><BlogPage sub="market-pulse" /></Layout>
          </Route>
          <Route path="/blog/lab-notes">
            <Layout><BlogPage sub="lab-notes" /></Layout>
          </Route>

          <Route>
            <Layout withNewsletter={false}>
              <div className="max-w-[1200px] mx-auto px-6 py-24 text-center">
                <div className="text-[72px] font-bold text-gray-100 mb-4">404</div>
                <h1 className="text-[24px] font-semibold text-gray-900 mb-3">Page not found</h1>
                <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
                <a href="/" className="text-[13.5px] font-medium text-white bg-[#1a3a5c] px-6 py-2.5">
                  Go Home
                </a>
              </div>
            </Layout>
          </Route>
        </Switch>
      </Route>
    </Switch>
  );
}
